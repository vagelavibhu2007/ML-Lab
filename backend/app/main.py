"""
ML Lab API - Backend Application Entrypoint
FastAPI server providing backend services for ML Lab.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import PROJECT_NAME, API_VERSION, ALLOWED_ORIGINS
from app.api import api_router

# Initialize FastAPI application
app = FastAPI(
    title=PROJECT_NAME,
    description="Backend API services for ML Lab (ML Model Studio)",
    version=API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular API router
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint verifying that the ML Lab API is running.
    """
    return {
        "message": "Welcome to ML Lab API",
        "status": "running"
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    System health check endpoint providing application status, name and version.
    """
    return {
        "status": "healthy",
        "application": "ML Lab",
        "version": API_VERSION
    }
