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
        # 1. Search MusicBrainz directly
        track_info = musicbrainz_client.search_track(query)
        if not track_info:
            raise HTTPException(
                status_code=404,
                detail="No tracks found in MusicBrainz"
            )

        # 2. Use MusicBrainz data to find similar tracks on Jamendo
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
                # Remove spotify_url if it's no longer relevant or fetch differently
                "features": track_info.get("features", {})
            },
            "similar_tracks": similar_tracks
        }

    except requests.exceptions.RequestException as e:
        logger.error(f"API error during external calls: {str(e)}") # Adjusted error log
        raise HTTPException(
            status_code=500,
            detail="Failed to search for tracks due to external service error"
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
    Process an uploaded audio file by searching MusicBrainz using the filename
    and finding similar tracks on Jamendo.

    Args:
        file: The uploaded audio file

    Returns:
        Dictionary containing track information and similar tracks
    """
    temp_path = None # Ensure temp_path is defined for cleanup
    try:
        # Use the original filename for the search query
        original_filename = file.filename
        if not original_filename:
            raise HTTPException(status_code=400, detail="Filename missing")
        # Basic cleanup: remove common extensions
        query = os.path.splitext(original_filename)[0]

        # 1. Search MusicBrainz using the cleaned filename
        logger.info(f"Searching MusicBrainz for query: {query}")
        track_info = await musicbrainz_client.search_track(query) # Use await for async method

        if not track_info:
            # Optionally save the file if needed for other purposes,
            # but for now, just raise the error if no track found
            # with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            #     content = await file.read()
            #     temp_file.write(content)
            #     temp_path = temp_file.name
            raise HTTPException(
                status_code=404,
                detail=f"No tracks found in MusicBrainz for query: {query}"
            )

        # 2. Use MusicBrainz data to find similar tracks on Jamendo
        logger.info(f"Finding similar tracks on Jamendo for: {track_info['title']}")
        similar_tracks = await jamendo_service.find_similar_tracks(
            title=track_info["title"],
            artist=track_info["artist"],
            tags=track_info.get("tags", []),
            mood=track_info.get("mood", "")
        )

        # No need to save the file just for the search, so no cleanup needed unless saved above
        # if temp_path and os.path.exists(temp_path):
        #     os.unlink(temp_path)

        return {
            "track": track_info, # Return the full track_info dict from search_track
            "similar_tracks": similar_tracks
        }

    except HTTPException as http_exc: # Re-raise HTTPExceptions
        raise http_exc
    except Exception as e:
        logger.error(f"Error processing file upload: {str(e)}")
        # Clean up temp file if it was created before an error
        # if temp_path and os.path.exists(temp_path):
        #     try:
        #         os.unlink(temp_path)
        #     except Exception as unlink_e:
        #         logger.error(f"Error cleaning up temp file {temp_path}: {unlink_e}")
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