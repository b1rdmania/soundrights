from fastapi import APIRouter
from .endpoints import spotify, music

api_router = APIRouter()

# Include Spotify router with auth endpoints
api_router.include_router(spotify.router, prefix="/spotify", tags=["spotify"])

# Include music router
api_router.include_router(music.router, prefix="/music", tags=["music"]) 