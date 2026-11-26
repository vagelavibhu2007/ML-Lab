"""
Core package initialization
"""
from app.core.config import (
    PROJECT_NAME,
    API_VERSION,
    ALLOWED_ORIGINS,
    DEBUG,
    UPLOAD_DIR,
    MAX_UPLOAD_SIZE_BYTES,
    ALLOWED_EXTENSIONS,
)

__all__ = [
    "PROJECT_NAME",
    "API_VERSION",
    "ALLOWED_ORIGINS",
    "DEBUG",
    "UPLOAD_DIR",
    "MAX_UPLOAD_SIZE_BYTES",
    "ALLOWED_EXTENSIONS",
]
