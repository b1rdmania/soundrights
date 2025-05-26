"""
Main API router for v1 endpoints.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    tracks,
    licenses,
    utils,
    recognize,
    ip_verification
)

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(recognize.router, prefix="/recognize", tags=["audio-recognition"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(tracks.router, prefix="/tracks", tags=["tracks"])
api_router.include_router(licenses.router, prefix="/licenses", tags=["licenses"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(ip_verification.router, prefix="/ip-verification", tags=["ip-verification"])

# TODO: Add more routers as they are created
# api_router.include_router(tracks.router, prefix="/tracks", tags=["tracks"])
# api_router.include_router(licenses.router, prefix="/licenses", tags=["licenses"])
# api_router.include_router(users.router, prefix="/users", tags=["users"]) 