from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Dict, Any, List
import requests
from app.core.config import settings
from app.core.logging import logger
from app.services.metadata.musicbrainz import musicbrainz_client
from app.services.metadata.jamendo import jamendo_service
import tempfile
import os
import time

router = APIRouter()

@router.post("/search")
async def search_music(query: str = Form(...)) -> Dict[str, Any]:
    """
    Search for music using Spotify's basic search, then enrich with MusicBrainz data,
    and find similar tracks on Jamendo.
    
    Args:
        query: Search query (song name, artist, etc.)
        
    Returns:
        Dictionary containing track information and similar tracks
    """
    try:
        # 1. Search Spotify for basic track info (no auth required)
        max_retries = 3
        retry_delay = 1  # seconds
        
        for attempt in range(max_retries):
            try:
                spotify_response = requests.get(
                    "https://api.spotify.com/v1/search",
                    params={
                        "q": query,
                        "type": "track",
                        "limit": 1
                    }
                )
                spotify_response.raise_for_status()
                spotify_data = spotify_response.json()
                break
            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    logger.error(f"Spotify API error after {max_retries} attempts: {str(e)}")
                    # If Spotify fails, try searching MusicBrainz directly
                    track_info = musicbrainz_client.search_track(query)
                    if not track_info:
                        raise HTTPException(
                            status_code=404,
                            detail="No tracks found"
                        )
                    spotify_data = {"tracks": {"items": [{"name": track_info["title"], "artists": [{"name": track_info["artist"]}]}]}}
                else:
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
        
        if not spotify_data["tracks"]["items"]:
            raise HTTPException(
                status_code=404,
                detail="No tracks found"
            )
            
        spotify_track = spotify_data["tracks"]["items"][0]
        
        # 2. Use Spotify data to search MusicBrainz
        musicbrainz_query = f"{spotify_track['name']} AND artist:{spotify_track['artists'][0]['name']}"
        track_info = musicbrainz_client.search_track(musicbrainz_query)
        
        if not track_info:
            # If MusicBrainz search fails, try a broader search
            track_info = musicbrainz_client.search_track(spotify_track['name'])
            if not track_info:
                raise HTTPException(
                    status_code=404,
                    detail="Track not found in MusicBrainz"
                )
        
        # 3. Use MusicBrainz data to find similar tracks on Jamendo
        similar_tracks = await jamendo_service.find_similar_tracks(
            title=track_info["title"],
            artist=track_info["artist"],
            tags=track_info.get("tags", []),
            mood=track_info.get("mood", "")
        )
        
        return {
            "track": {
                "title": track_info["title"],
                "artist": track_info["artist"],
                "duration": track_info.get("duration", 0),
                "tags": track_info.get("tags", []),
                "mood": track_info.get("mood", ""),
                "musicbrainz_url": track_info.get("url", ""),
                "spotify_url": spotify_track.get("external_urls", {}).get("spotify", ""),
                "features": track_info.get("features", {})
            },
            "similar_tracks": similar_tracks
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"API error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to search for tracks"
        )
    except Exception as e:
        logger.error(f"Error processing search: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process the search: {str(e)}"
        )

@router.post("/process-file")
async def process_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Process an uploaded audio file through MusicBrainz and find similar tracks.
    
    Args:
        file: The uploaded audio file
        
    Returns:
        Dictionary containing track information and similar tracks
    """
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Process the file through MusicBrainz
        track_info = musicbrainz_client.analyze_file(temp_path)
        
        # Get similar tracks from Jamendo
        similar_tracks = await jamendo_service.find_similar_tracks(
            title=track_info["title"],
            artist=track_info["artist"],
            tags=track_info.get("tags", []),
            mood=track_info.get("mood", "")
        )
        
        # Clean up the temporary file
        os.unlink(temp_path)
        
        return {
            "track": track_info,
            "similar_tracks": similar_tracks
        }
        
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process the audio file: {str(e)}"
        )

@router.post("/process-link")
async def process_link(url: str = Form(...)) -> Dict[str, Any]:
    """
    Process a music link through MusicBrainz.
    
    Args:
        url: The URL of the music to process
        
    Returns:
        Dictionary containing track information and similar tracks
    """
    try:
        # Process the URL through MusicBrainz
        track_info = musicbrainz_client.analyze_url(url)
        
        # Get similar tracks from Jamendo
        similar_tracks = await jamendo_service.find_similar_tracks(
            title=track_info["title"],
            artist=track_info["artist"],
            tags=track_info.get("tags", []),
            mood=track_info.get("mood", "")
        )
        
        return {
            "track": track_info,
            "similar_tracks": similar_tracks
        }
        
    except Exception as e:
        logger.error(f"Error processing link: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process the music link: {str(e)}"
        ) 