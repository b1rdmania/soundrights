from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Dict, Any, List, Optional
import requests
from app.core.config import settings
from app.core.logging import logger
from app.services.metadata.musicbrainz import musicbrainz_client
from app.services.metadata.jamendo import jamendo_service
from app.services.recognition.shazam import zyla_shazam_client
from app.services.ai.gemini_service import gemini_service
from app.core.exceptions import RecognitionAPIError, AIServiceError
import tempfile
import os
import time
import asyncio

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
    Recognize uploaded audio with Shazam, analyze with Gemini for keywords,
    find similar tracks on Jamendo using keywords.

    Args:
        file: The uploaded audio file

    Returns:
        Dictionary containing recognition result and similar tracks
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing from upload")

    logger.info(f"Processing uploaded file: {file.filename}")
    audio_data = await file.read() # Read file content into memory

    shazam_result: Optional[Dict] = None
    gemini_analysis: Optional[Dict] = None
    jamendo_tracks: List[Dict] = []

    try:
        # 1. Recognize with Shazam
        logger.info("Starting Shazam recognition...")
        shazam_result = await zyla_shazam_client.recognize_audio(audio_data, file.filename)

        if not shazam_result or not shazam_result.get('title'):
            logger.warning("Shazam did not recognize the track.")
            raise HTTPException(status_code=404, detail="Could not recognize track using Shazam")
        
        logger.info(f"Shazam recognized: {shazam_result.get('title')} by {shazam_result.get('subtitle')}")

        # 2. Analyze with Gemini and generate keywords
        logger.info("Starting Gemini analysis...")
        gemini_analysis = await gemini_service.analyze_song_and_generate_keywords(shazam_result)
        keywords = gemini_analysis.get("keywords")

        if not keywords:
             logger.error("Gemini failed to generate keywords.")
             # Proceed without Jamendo search, or raise error?
             # For now, return Shazam result only
             return {
                 "recognized_track": shazam_result,
                 "analysis": gemini_analysis, # Include Gemini description
                 "similar_tracks": []
             }

        # 3. Find similar tracks on Jamendo using keywords
        logger.info(f"Searching Jamendo with keywords: {keywords}")
        jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=keywords, limit=10)
        
        logger.info("File processing complete.")
        # --- Optional: Enrich with MusicBrainz --- 
        # Could add a step here to search MusicBrainz using shazam_result title/artist
        # and merge the data if desired.
        # ----------------------------------------

        return {
            "recognized_track": shazam_result,
            "analysis": gemini_analysis, # Include description + keywords
            "similar_tracks": jamendo_tracks
        }

    except RecognitionAPIError as e:
        logger.error(f"Shazam recognition failed: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Audio recognition service failed: {str(e)}")
    except AIServiceError as e:
        logger.error(f"Gemini analysis failed: {str(e)}")
        # If AI fails, maybe return just Shazam + Jamendo (if keywords were generated before failure?)
        # Or just return the Shazam result if AI is critical path
        # Current: Fail the request if AI fails after successful Shazam
        raise HTTPException(status_code=502, detail=f"AI analysis service failed: {str(e)}")
    except HTTPException as http_exc: # Re-raise specific HTTP exceptions
        raise http_exc
    except Exception as e:
        logger.exception(f"Unexpected error processing file upload: {str(e)}") # Use exception for full trace
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process the audio file due to an unexpected error."
        )

# Remove the old /process-link implementation if not needed, or update it similarly
# @router.post("/process-link") ... 