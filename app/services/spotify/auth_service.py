from fastapi import APIRouter, HTTPException, Request
from typing import Dict, Any
import requests
from ...core.config import settings
from ...core.logging import logger
from .client import spotify_client
import secrets
from urllib.parse import urlencode

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/spotify")
async def get_spotify_auth_url(request: Request) -> Dict[str, Any]:
    """
    Generate Spotify authorization URL.
    
    Args:
        request: FastAPI request object
        
    Returns:
        Dictionary containing the authorization URL
    """
    try:
        # Generate a random state string
        state = secrets.token_urlsafe(16)
        
        # Define the required scopes
        scopes = [
            "user-read-private",
            "user-read-email",
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-library-read",
            "streaming",
            "user-read-currently-playing",
            "playlist-read-private",
            "user-top-read"  # Required for audio features
        ]
        
        # Build the authorization URL
        auth_url = "https://accounts.spotify.com/authorize"
        params = {
            "client_id": settings.SPOTIFY_CLIENT_ID,
            "response_type": "code",
            "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
            "scope": " ".join(scopes),
            "state": state
        }
        
        # Store the state for later verification
        # In a real application, you would store this in a database or cache
        
        logger.info("Generated Spotify authorization URL")
        return {
            "url": f"{auth_url}?{urlencode(params)}"
        }
    except Exception as e:
        logger.error(f"Error generating Spotify auth URL: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while generating the authorization URL"
        )

@router.get("/callback")
async def spotify_callback(code: str, state: str, request: Request) -> Dict[str, Any]:
    """
    Handle Spotify OAuth callback.
    
    Args:
        code: Authorization code from Spotify
        state: State parameter for CSRF protection
        request: FastAPI request object
        
    Returns:
        Dictionary containing access and refresh tokens
    """
    try:
        # Exchange code for tokens
        token_response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.SPOTIFY_REDIRECT_URI,
                "client_id": settings.SPOTIFY_CLIENT_ID,
                "client_secret": settings.SPOTIFY_CLIENT_SECRET
            }
        )
        token_response.raise_for_status()
        
        tokens = token_response.json()
        logger.info("Successfully obtained Spotify access token")
        
        # Set tokens in the Spotify client
        spotify_client.set_tokens(
            access_token=tokens["access_token"],
            refresh_token=tokens.get("refresh_token")
        )
        
        return {
            "access_token": tokens["access_token"],
            "refresh_token": tokens.get("refresh_token"),
            "expires_in": tokens["expires_in"],
            "token_type": tokens["token_type"]
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error exchanging Spotify code for tokens: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to exchange authorization code for tokens"
        )
    except Exception as e:
        logger.error(f"Unexpected error in Spotify callback: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred"
        )

@router.post("/refresh")
async def refresh_spotify_token(refresh_token: str) -> Dict[str, Any]:
    """
    Refresh Spotify access token.
    
    Args:
        refresh_token: Refresh token from Spotify
        
    Returns:
        Dictionary containing new access token
    """
    try:
        # Exchange refresh token for new access token
        token_response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": settings.SPOTIFY_CLIENT_ID,
                "client_secret": settings.SPOTIFY_CLIENT_SECRET
            }
        )
        token_response.raise_for_status()
        
        tokens = token_response.json()
        logger.info("Successfully refreshed Spotify token")
        
        # Update tokens in the Spotify client
        spotify_client.set_tokens(
            access_token=tokens["access_token"],
            refresh_token=refresh_token
        )
        
        return {
            "access_token": tokens["access_token"],
            "expires_in": tokens["expires_in"],
            "token_type": tokens["token_type"]
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error refreshing Spotify token: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to refresh access token"
        )
    except Exception as e:
        logger.error(f"Unexpected error refreshing Spotify token: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred"
        )

@router.get("/client-token")
async def get_client_token() -> Dict[str, Any]:
    """
    Get a client credentials token for accessing audio features.
    
    Returns:
        Dictionary containing the access token
    """
    try:
        # Exchange client credentials for token
        token_response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "client_credentials",
                "client_id": settings.SPOTIFY_CLIENT_ID,
                "client_secret": settings.SPOTIFY_CLIENT_SECRET
            }
        )
        token_response.raise_for_status()
        
        tokens = token_response.json()
        logger.info("Successfully obtained Spotify client credentials token")
        
        return {
            "access_token": tokens["access_token"],
            "expires_in": tokens["expires_in"],
            "token_type": tokens["token_type"]
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error getting client credentials token: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get client credentials token"
        )
    except Exception as e:
        logger.error(f"Unexpected error getting client credentials token: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred"
        ) 