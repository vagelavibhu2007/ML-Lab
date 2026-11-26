"""
Dataset schemas for request validation and response models
"""
from typing import List, Dict, Any
from pydantic import BaseModel, Field


class DatasetUploadResponse(BaseModel):
    """
    Response model returned after successful dataset upload and parsing.
    """
    success: bool = Field(True, description="Indicates whether the upload and parsing succeeded")
    dataset_id: str = Field(..., description="Unique UUID identifier for the uploaded dataset")
    filename: str = Field(..., description="Original name of the uploaded CSV file")
    file_size_bytes: int = Field(..., description="File size in bytes")
    file_size_formatted: str = Field(..., description="Human-readable file size (e.g. 1.25 MB)")
    total_rows: int = Field(..., description="Total number of rows in the dataset")
    total_columns: int = Field(..., description="Total number of columns in the dataset")
    columns: List[str] = Field(..., description="List of column names")
    dtypes: Dict[str, str] = Field(..., description="Dictionary mapping column names to their data types")
    missing_values: Dict[str, int] = Field(..., description="Dictionary mapping column names to missing value count")
    unique_values: Dict[str, int] = Field(..., description="Dictionary mapping column names to unique value count")
    preview: List[Dict[str, Any]] = Field(..., description="First 10 rows of the dataset, JSON-serializable")
