"""
Dataset service: Handles file validation, safe storage, CSV parsing with Pandas,
and metadata/preview generation.
"""
import uuid
from pathlib import Path
from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np
from fastapi import UploadFile, HTTPException, status
from app.core.config import UPLOAD_DIR, MAX_UPLOAD_SIZE_BYTES, ALLOWED_EXTENSIONS
from app.schemas.dataset import DatasetUploadResponse


def format_file_size(size_bytes: int) -> str:
    """
    Format byte size into a human-readable string (e.g. 1.25 MB).
    """
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"


def clean_json_value(val: Any) -> Any:
    """
    Sanitize pandas/numpy values to ensure JSON serializability.
    Converts NaN, NaT, and infinity values to None.
    Converts numpy numeric and boolean types to native Python equivalents.
    """
    if pd.isna(val):
        return None
    if isinstance(val, (float, np.floating)):
        if np.isnan(val) or np.isinf(val):
            return None
        return float(val)
    if isinstance(val, (int, np.integer)):
        return int(val)
    if isinstance(val, (bool, np.bool_)):
        return bool(val)
    if isinstance(val, (pd.Timestamp, np.datetime64)):
        return str(val)
    return val


class DatasetService:
    """
    Service responsible for managing dataset uploads, parsing, and metadata extraction.
    """

    @staticmethod
    def validate_file_extension(filename: str) -> None:
        """
        Validate that the uploaded file has a supported .csv extension.
        """
        if not filename or not filename.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Filename is missing or empty."
            )

        suffix = Path(filename).suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file format '{suffix}'. Only CSV files (.csv) are supported."
            )

    @classmethod
    async def save_file_stream(cls, file: UploadFile, dataset_id: str) -> Tuple[Path, int]:
        """
        Stream uploaded file contents to a temporary storage path on disk.
        Enforces maximum file size limit (25 MB) during streaming to prevent memory exhaustion.
        Raises HTTP 413 if the file exceeds the limit, and cleans up partial files.
        """
        temp_path = UPLOAD_DIR / f"{dataset_id}.tmp"
        bytes_read = 0
        chunk_size = 1024 * 64  # 64 KB chunks

        try:
            with open(temp_path, "wb") as buffer:
                while True:
                    chunk = await file.read(chunk_size)
                    if not chunk:
                        break
                    bytes_read += len(chunk)
                    if bytes_read > MAX_UPLOAD_SIZE_BYTES:
                        buffer.close()
                        if temp_path.exists():
                            temp_path.unlink()
                        max_mb = MAX_UPLOAD_SIZE_BYTES // (1024 * 1024)
                        raise HTTPException(
                            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
                            detail=f"File exceeds maximum allowed upload size of {max_mb} MB."
                        )
                    buffer.write(chunk)
        except HTTPException:
            raise
        except Exception as e:
            if temp_path.exists():
                temp_path.unlink()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to write uploaded file to storage: {str(e)}"
            )

        # Enforce non-empty file
        if bytes_read == 0:
            if temp_path.exists():
                temp_path.unlink()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded CSV file is empty (0 bytes)."
            )

        return temp_path, bytes_read

    @classmethod
    def parse_csv(cls, file_path: Path) -> pd.DataFrame:
        """
        Parse CSV file using Pandas with encoding fallbacks and robust error handling.
        """
        supported_encodings = ["utf-8", "utf-8-sig", "latin-1", "cp1252", "iso-8859-1"]
        df = None
        last_exception = None

        for enc in supported_encodings:
            try:
                df = pd.read_csv(file_path, encoding=enc)
                break
            except UnicodeDecodeError:
                continue
            except pd.errors.EmptyDataError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uploaded CSV file contains no data or columns."
                )
            except pd.errors.ParserError as pe:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Malformed CSV file: {str(pe)}"
                )
            except Exception as ex:
                last_exception = ex
                break

        if df is None:
            if last_exception:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unable to parse CSV file: {str(last_exception)}"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to decode CSV file with supported encodings (UTF-8, Latin-1, CP1252)."
            )

        if len(df.columns) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded CSV file contains no valid columns."
            )

        return df

    @classmethod
    async def process_upload(cls, file: UploadFile) -> DatasetUploadResponse:
        """
        Orchestrate the full upload lifecycle:
        1. Extension & metadata validation
        2. Streamed disk storage with size enforcement
        3. Pandas CSV parsing & encoding resolution
        4. Safe renaming to permanent storage
        5. Extraction of dataset statistics and JSON-safe preview
        """
        original_filename = Path(file.filename or "dataset.csv").name
        cls.validate_file_extension(original_filename)

        dataset_id = str(uuid.uuid4())
        temp_path = None
        final_path = UPLOAD_DIR / f"{dataset_id}.csv"

        try:
            # Step 1: Stream and validate size
            temp_path, bytes_read = await cls.save_file_stream(file, dataset_id)

            # Step 2: Parse CSV with Pandas
            df = cls.parse_csv(temp_path)

            # Step 3: Promote temp file to final storage path
            temp_path.rename(final_path)

            # Step 4: Extract statistics
            total_rows = int(len(df))
            total_columns = int(len(df.columns))
            columns = [str(col) for col in df.columns]
            dtypes = {str(col): str(dtype) for col, dtype in df.dtypes.items()}
            missing_values = {str(col): int(df[col].isna().sum()) for col in df.columns}
            unique_values = {str(col): int(df[col].nunique(dropna=True)) for col in df.columns}

            # Step 5: Generate JSON-safe 10-row preview
            preview_rows: List[Dict[str, Any]] = []
            preview_df = df.head(10)
            for _, row in preview_df.iterrows():
                row_dict = {}
                for col in preview_df.columns:
                    row_dict[str(col)] = clean_json_value(row[col])
                preview_rows.append(row_dict)

            return DatasetUploadResponse(
                success=True,
                dataset_id=dataset_id,
                filename=original_filename,
                file_size_bytes=bytes_read,
                file_size_formatted=format_file_size(bytes_read),
                total_rows=total_rows,
                total_columns=total_columns,
                columns=columns,
                dtypes=dtypes,
                missing_values=missing_values,
                unique_values=unique_values,
                preview=preview_rows,
            )

        except Exception:
            # Clean up any leftover files on error
            if temp_path and temp_path.exists():
                try:
                    temp_path.unlink()
                except OSError:
                    pass
            if final_path and final_path.exists():
                try:
                    final_path.unlink()
                except OSError:
                    pass
            raise
