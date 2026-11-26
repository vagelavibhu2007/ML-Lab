"""
Core configuration and settings for ML Lab API
"""
import os
from pathlib import Path
from typing import List, Set
from dotenv import load_dotenv

# Load environment variables from .env file if available
load_dotenv()

PROJECT_NAME: str = os.getenv("PROJECT_NAME", "ML Lab API")
API_VERSION: str = os.getenv("API_VERSION", "1.0.0")
DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

# Base directory of backend project
BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent

# Dataset upload directory and limits
UPLOAD_DIR: Path = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Maximum file upload size: 25 MB
MAX_UPLOAD_SIZE_BYTES: int = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", 25 * 1024 * 1024))
ALLOWED_EXTENSIONS: Set[str] = {".csv"}

# Default allowed origins for frontend clients
DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
]

env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    ALLOWED_ORIGINS: List[str] = [
        origin.strip() for origin in env_origins.split(",") if origin.strip()
    ]
else:
    ALLOWED_ORIGINS: List[str] = DEFAULT_ORIGINS
