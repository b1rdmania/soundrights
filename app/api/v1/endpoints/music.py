from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Dict, Any, List, Optional
import requests
from app.core.config import settings
from app.core.logging import logger
from app.services.metadata.musicbrainz import musicbrainz_client
from app.services.metadata.jamendo import jamendo_service
from app.services.metadata.musixmatch import musixmatch_service
from app.services.recognition.shazam import zyla_shazam_client
from app.services.ai.gemini_service import gemini_service
from app.core.exceptions import RecognitionAPIError, AIServiceError, MusixmatchAPIError
import tempfile
import os
import time
import asyncio

router = APIRouter()

@router.post("/search")
async def search_and_analyze(query: str = Form(...)) -> Dict[str, Any]:
    """
    Search Musixmatch for a track using the query, analyze with Gemini,
    find similar tracks on Jamendo.
    
    Args:
        query: Search query (song name, artist, etc.)
        
    Returns:
        Dictionary containing search result, analysis, and similar tracks
    """
    logger.info(f"Processing search query: {query}")
    
    musixmatch_metadata: Optional[Dict] = None
    gemini_analysis: Optional[Dict] = None
    jamendo_tracks: List[Dict] = []

    try:
        # 1. Search Musixmatch using the query
        logger.info("Searching Musixmatch...")
        musixmatch_metadata = await musixmatch_service.search_track_by_query(query)

        if not musixmatch_metadata:
            logger.warning(f"Musixmatch did not find a track for query: {query}")
            raise HTTPException(status_code=404, detail=f"Could not find track on Musixmatch for query: {query}")
        
        logger.info(f"Musixmatch found: {musixmatch_metadata.get('title')} by {musixmatch_metadata.get('artist')}")

        # 2. Analyze with Gemini and generate keywords
        # Use the data found by Musixmatch for analysis
        logger.info(f"Starting Gemini analysis for Musixmatch result: {musixmatch_metadata.get('title')}...")
        gemini_analysis = await gemini_service.analyze_song_and_generate_keywords(musixmatch_metadata)
        logger.info(f"Gemini analysis successful for {musixmatch_metadata.get('title', 'Unknown Title')} by {musixmatch_metadata.get('artist', 'Unknown Artist')}. Keywords: {gemini_analysis['keywords']}")
        keywords = gemini_analysis.get("keywords")

        if not keywords:
             logger.error("Gemini failed to generate keywords.")
             # Return Musixmatch result if Gemini fails
             return {
                 "source_track": musixmatch_metadata, # Rename for clarity
                 "analysis": gemini_analysis,
                 "similar_tracks": []
             }

        # 3. Find similar tracks on Jamendo using keywords
        logger.info(f"Searching Jamendo with keywords: {keywords}")
        jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=keywords, limit=10)
        
        logger.info("Search query processing complete.")

        return {
            "source_track": musixmatch_metadata, # Rename for clarity
            "analysis": gemini_analysis,
            "similar_tracks": jamendo_tracks
        }

    except MusixmatchAPIError as e:
        logger.error(f"Musixmatch search failed: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Metadata service failed: {str(e)}")
    except AIServiceError as e:
        logger.error(f"Gemini analysis failed: {str(e)}")
        raise HTTPException(status_code=502, detail=f"AI analysis service failed: {str(e)}")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.exception(f"Unexpected error processing search query: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process the search query due to an unexpected error."
        )

@router.post("/process-file")
async def process_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Recognize uploaded audio with Shazam, enrich with Musixmatch, analyze with Gemini,
    find similar tracks on Jamendo.

    Args:
        file: The uploaded audio file

    Returns:
        Dictionary containing recognition result, analysis, and similar tracks
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing from upload")

    logger.info(f"Processing uploaded file: {file.filename}")
    audio_data = await file.read()

    shazam_result: Optional[Dict] = None
    musixmatch_metadata: Optional[Dict] = None
    gemini_analysis: Optional[Dict] = None
    jamendo_tracks: List[Dict] = []

    try:
        # 1. Recognize with Shazam
        logger.info("Starting Shazam recognition...")
        shazam_result = await zyla_shazam_client.recognize_audio(audio_data, file.filename)

        if not shazam_result or not shazam_result.get('title'):
            logger.warning("Shazam did not recognize the track.")
            raise HTTPException(status_code=404, detail="Could not recognize track using Shazam")
        
        shazam_title = shazam_result.get('title')
        shazam_artist = shazam_result.get('subtitle') # Shazam often puts artist in subtitle
        logger.info(f"Shazam recognized: {shazam_title} by {shazam_artist}")

        # 2. Enrich with Musixmatch
        if shazam_title and shazam_artist:
            try:
                logger.info("Fetching metadata from Musixmatch...")
                musixmatch_metadata = await musixmatch_service.get_track_metadata(title=shazam_title, artist=shazam_artist)
                if musixmatch_metadata:
                    logger.info(f"Found Musixmatch metadata: {musixmatch_metadata}")
                else:
                    logger.info("No additional metadata found on Musixmatch.")
            except MusixmatchAPIError as e:
                logger.warning(f"Musixmatch API error, proceeding without enrichment: {e}")
                musixmatch_metadata = None # Continue without Musixmatch data if it fails
            except Exception as e:
                logger.error(f"Unexpected error during Musixmatch fetch: {e}", exc_info=True)
                musixmatch_metadata = None # Continue without Musixmatch data

        # 3. Analyze with Gemini and generate keywords
        # Prepare combined data for Gemini (prioritize Musixmatch if available)
        analysis_input = {
            "title": musixmatch_metadata.get('title') if musixmatch_metadata else shazam_title,
            "artist": musixmatch_metadata.get('artist') if musixmatch_metadata else shazam_artist,
            "genres": musixmatch_metadata.get('genres') if musixmatch_metadata else [],
            "explicit": musixmatch_metadata.get('explicit') if musixmatch_metadata else None,
            "instrumental": musixmatch_metadata.get('instrumental') if musixmatch_metadata else None,
            "rating": musixmatch_metadata.get('rating') if musixmatch_metadata else None,
            # Can add more fields if needed for the Gemini prompt
        }
        
        logger.info(f"Starting Gemini analysis with combined data: {analysis_input['title']}...")
        # Modify Gemini prompt if needed to utilize the new fields (genres, etc.)
        gemini_analysis = await gemini_service.analyze_song_and_generate_keywords(analysis_input)
        logger.info(f"Gemini analysis successful for {musixmatch_metadata.get('title', 'Unknown Title')} by {musixmatch_metadata.get('artist', 'Unknown Artist')}. Keywords: {gemini_analysis['keywords']}")
        keywords = gemini_analysis.get("keywords")

        if not keywords:
             logger.error("Gemini failed to generate keywords.")
             # Return Shazam + Musixmatch if Gemini fails
             return {
                 "recognized_track": shazam_result,
                 "metadata": musixmatch_metadata,
                 "analysis": gemini_analysis, # Include description even if keywords failed
                 "similar_tracks": []
             }

        # 4. Find similar tracks on Jamendo using keywords
        logger.info(f"Searching Jamendo with keywords: {keywords}")
        jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=keywords, limit=10)
        
        logger.info("File processing complete.")

        return {
            "recognized_track": shazam_result,
            "metadata": musixmatch_metadata,
            "analysis": gemini_analysis,
            "similar_tracks": jamendo_tracks
        }

    except RecognitionAPIError as e:
        logger.error(f"Shazam recognition failed: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Audio recognition service failed: {str(e)}")
    # Removed specific MusixmatchAPIError catch block here as we handle it inline and proceed
    except AIServiceError as e:
        logger.error(f"Gemini analysis failed: {str(e)}")
        raise HTTPException(status_code=502, detail=f"AI analysis service failed: {str(e)}")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.exception(f"Unexpected error processing file upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process the audio file due to an unexpected error."
        )

# Remove the old /process-link implementation if not needed, or update it similarly
# @router.post("/process-link") ... 