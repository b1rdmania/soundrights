from fastapi import APIRouter
# Remove spotify from this import
from .endpoints import music, recognize

api_router = APIRouter()

# Ensure the commented-out spotify router inclusion is still gone or remove it

# Include music router
api_router.include_router(music.router, prefix="/music", tags=["music"])

# Include recognition router
api_router.include_router(recognize.router, prefix="/recognize", tags=["recognize"]) 