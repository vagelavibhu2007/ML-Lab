"""
API package - Routers and endpoint definitions
"""
from fastapi import APIRouter
from app.api.datasets import router as datasets_router

api_router = APIRouter()
api_router.include_router(datasets_router)

__all__ = ["api_router"]
