from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Dict, Any
import re
import requests
import base64
from app.core.config import settings
from app.core.exceptions import InvalidURLError, SpotifyAPIError
from app.core.logging import logger
from app.services.metadata.jamendo import jamendo_service
from app.services.spotify.client import spotify_client
from app.services.spotify.auth_service import get_spotify_auth_url, spotify_callback, refresh_spotify_token
from app.services.metadata.musicbrainz import musicbrainz_client
import random
from sqlalchemy.orm import Session
from app.services.spotify.auth_service import get_client_token

# Create main router
router = APIRouter()

# Add auth endpoints directly to the router
router.get("/auth/spotify", response_model=Dict[str, Any])(get_spotify_auth_url)
router.get("/auth/callback", response_model=Dict[str, Any])(spotify_callback)
router.post("/auth/refresh", response_model=Dict[str, Any])(refresh_spotify_token)

def extract_spotify_track_id(url: str) -> str:
    """Extract Spotify track ID from various URL formats."""
    if "spotify.com/track/" in url:
        # Handle standard Spotify URLs
        parts = url.split("track/")
        if len(parts) != 2:
            raise InvalidURLError("Invalid Spotify track URL format")
        track_id = parts[1].split("?")[0]  # Remove any query parameters
        return track_id
    elif "spotify:track:" in url:
        # Handle Spotify URI format
        parts = url.split("spotify:track:")
        if len(parts) != 2:
            raise InvalidURLError("Invalid Spotify track URI format")
        return parts[1]
    else:
        raise InvalidURLError("URL must be a valid Spotify track URL or URI")

def get_fallback_features(track_info: Dict[str, Any]) -> Dict[str, Any]:
    """Generate fallback audio features based on track metadata."""
    # Get track duration in minutes
    duration_minutes = track_info["duration_ms"] / 60000
    
    # Estimate BPM based on duration and genre hints
    # Most pop songs are between 90-130 BPM
    # Longer songs tend to be slower
    base_bpm = 120
    if duration_minutes > 5:
        base_bpm = 90
    elif duration_minutes < 3:
        base_bpm = 130
    
    # Add some randomness but keep it within reasonable bounds
    bpm = base_bpm + random.randint(-10, 10)
    
    # Estimate energy based on track name and artist
    # Look for energetic keywords in track name
    energy_keywords = ["rock", "metal", "dance", "party", "fast", "upbeat", "high", "loud"]
    track_name = track_info["name"].lower()
    energy = 0.5  # default neutral energy
    if any(keyword in track_name for keyword in energy_keywords):
        energy = 0.8
    elif any(word in track_name for word in ["slow", "quiet", "soft", "gentle"]):
        energy = 0.3
    
    # Estimate danceability based on energy
    danceability = energy + random.uniform(-0.1, 0.1)
    danceability = max(0.0, min(1.0, danceability))  # clamp between 0 and 1
    
    # Estimate valence (mood) based on track name
    positive_keywords = ["happy", "joy", "love", "smile", "good", "great", "wonderful"]
    negative_keywords = ["sad", "hate", "angry", "dark", "bad", "evil", "death"]
    valence = 0.5  # default neutral mood
    if any(keyword in track_name for keyword in positive_keywords):
        valence = 0.8
    elif any(keyword in track_name for keyword in negative_keywords):
        valence = 0.2
    
    # Estimate acousticness based on genre hints
    acousticness = 0.5  # default neutral
    if any(word in track_name for word in ["acoustic", "unplugged", "live"]):
        acousticness = 0.8
    elif any(word in track_name for word in ["electronic", "remix", "mix"]):
        acousticness = 0.2
    
    # Estimate instrumentalness based on track name
    instrumentalness = 0.5  # default neutral
    if any(word in track_name for word in ["instrumental", "solo", "guitar", "piano"]):
        instrumentalness = 0.8
    elif any(word in track_name for word in ["vocal", "sing", "voice"]):
        instrumentalness = 0.2
    
    return {
        "tempo": bpm,
        "key": random.randint(0, 11),  # Random musical key
        "energy": energy,
        "danceability": danceability,
        "valence": valence,
        "acousticness": acousticness,
        "instrumentalness": instrumentalness
    }

@router.post("/process")
async def process_spotify_url(
    url: str,
    access_token: str = Query(..., description="Spotify access token")
):
    """Process a Spotify URL and get track information."""
    try:
        # Set the user's access token
        spotify_client.set_tokens(access_token, None)
        
        # Extract track ID from URL
        track_id = extract_spotify_track_id(url)
        if not track_id:
            raise HTTPException(status_code=400, detail="Invalid Spotify URL")
        
        # Get track information from Spotify
        try:
            track_info = spotify_client.get_track_info(track_id)
            logger.info(f"Successfully retrieved track info for: {track_info.get('name', track_id)}")
        except SpotifyAPIError as e:
            logger.error(f"Error getting track info: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        
        # Get audio features from MusicBrainz
        try:
            audio_features = musicbrainz_client.get_track_features(
                track_info["name"],
                track_info["artists"][0]["name"]
            )
            logger.info(f"Successfully retrieved audio features from MusicBrainz")
        except Exception as e:
            logger.error(f"Error getting track features from MusicBrainz: {str(e)}")
            # Use fallback features if MusicBrainz fails
            audio_features = get_fallback_features(track_info)
            logger.info("Using fallback audio features")
        
        # Search for similar tracks on Jamendo
        similar_tracks = []
        try:
            similar_tracks = await jamendo_service.search_similar_tracks(
                track_info["name"],
                track_info["artists"][0]["name"],
                audio_features
            )
            logger.info(f"Found {len(similar_tracks)} similar tracks on Jamendo")
        except Exception as e:
            logger.error(f"Error searching similar tracks: {str(e)}")
        
        return {
            "track_info": track_info,
            "audio_features": audio_features,
            "similar_tracks": similar_tracks
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing Spotify URL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_track(query: str, access_token: str) -> Dict[str, Any]:
    """Search for a track by name or artist."""
    try:
        # Set the access token
        spotify_client.set_tokens(access_token, None)  # We don't have refresh token yet
        
        return spotify_client.search_track(query)
    except Exception as e:
        logger.error(f"Error searching track: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while searching tracks"
        ) 