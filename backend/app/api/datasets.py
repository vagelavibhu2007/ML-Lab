"""
Dataset API routes - Handles dataset uploads, validations, and previews.
"""
from fastapi import APIRouter, UploadFile, File, status
from app.schemas.dataset import DatasetUploadResponse
from app.services.dataset_service import DatasetService

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.post(
    "/upload",
    response_model=DatasetUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload and parse a CSV dataset",
    description=(
        "Upload a CSV dataset file (up to 25 MB). "
        "Validates file format and size, parses data using Pandas, "
        "stores the dataset with a unique UUID, and returns summary metadata "
        "including columns, dtypes, missing values, and a 10-row preview."
    ),
)
async def upload_dataset(
    file: UploadFile = File(..., description="CSV dataset file to upload")
) -> DatasetUploadResponse:
    """
    Upload CSV dataset endpoint.
    """
    return await DatasetService.process_upload(file)
