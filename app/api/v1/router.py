
from fastapi import APIRouter
from .endpoints import music, recognize

api_router = APIRouter()

# Include music router
api_router.include_router(music.router, prefix="/music", tags=["music"])

# Include recognition router
api_router.include_router(recognize.router, prefix="/recognize", tags=["recognize"]) 
