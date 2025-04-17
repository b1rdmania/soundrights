from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Dict, Any, List, Optional
import requests
from app.core.config import settings
from app.core.logging import logger
from app.services.metadata.musicbrainz import musicbrainz_client
from app.services.metadata.jamendo import jamendo_service
from app.services.metadata.musixmatch import musixmatch_service
from app.services.recognition.shazam import zyla_shazam_client
from app.services.audio_analysis.acousticbrainz import acousticbrainz_service
from app.services.ai.gemini_service import gemini_service
from app.core.exceptions import RecognitionAPIError, AIServiceError, MusixmatchAPIError, MetadataAPIError, AudioAnalysisError
import tempfile
import os
import time
import asyncio

router = APIRouter()

@router.post("/search")
async def search_and_analyze(title: str = Form(...), artist: str = Form(...)) -> Dict[str, Any]:
    """
    Search Musixmatch for a track using title and artist, analyze with Gemini,
    find similar tracks on Jamendo.
    
    Args:
        title: Song title
        artist: Artist name
        
    Returns:
        Dictionary containing search result, analysis, and similar tracks
    """
    logger.info(f"Processing search for title: '{title}', artist: '{artist}'")
    
    musixmatch_metadata: Optional[Dict] = None
    acousticbrainz_features: Optional[Dict] = None
    gemini_analysis: Optional[Dict] = None
    jamendo_tracks: List[Dict] = []
    mbid: Optional[str] = None

    try:
        # 1. Try searching Musixmatch using the precise matcher.track.get
        logger.info("Attempting Musixmatch search with matcher.track.get...")
        musixmatch_metadata = await musixmatch_service.get_track_metadata(title=title, artist=artist)
        logger.info(f"Musixmatch matcher.track.get succeeded for: {title} by {artist}")

    except MusixmatchAPIError as e:
        logger.warning(f"Musixmatch matcher.track.get failed: {e}. Falling back to track.search...")
        # Fallback: Try using the general track.search endpoint
        try:
            fallback_query = f"{title} {artist}"
            musixmatch_metadata = await musixmatch_service.search_track_by_query(fallback_query)
            if musixmatch_metadata:
                logger.info(f"Musixmatch fallback search succeeded for query: {fallback_query}")
            else:
                # If fallback also finds nothing, raise 404
                logger.warning(f"Musixmatch fallback search also found no track for query: {fallback_query}")
                raise HTTPException(status_code=404, detail=f"Could not find track on Musixmatch using title/artist or fallback search for: '{title}', '{artist}'")
        except MusixmatchAPIError as fallback_e:
            # If fallback search itself fails with an API error
            logger.error(f"Musixmatch fallback search also failed: {fallback_e}")
            raise HTTPException(status_code=502, detail=f"Metadata service failed during fallback search: {fallback_e}")
        except Exception as fallback_exc: # Catch any other unexpected error during fallback
            logger.exception(f"Unexpected error during Musixmatch fallback search: {fallback_exc}")
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred during the metadata fallback search.")

    # Ensure metadata was found either by primary or fallback method
    if not musixmatch_metadata:
        # This case should technically be covered by the exceptions above, but as a safeguard:
        logger.error(f"Logic error: No Musixmatch metadata found after primary and fallback attempts for '{title}' '{artist}'")
        raise HTTPException(status_code=500, detail="Failed to retrieve metadata after fallback attempts.")

    # --- 2. Get MusicBrainz Recording ID (MBID) --- 
    try:
        mbid = await musicbrainz_client.get_recording_mbid(title=title, artist=artist)
        if mbid:
            logger.info(f"Found MBID: {mbid}")
        else:
            logger.info(f"No suitable MBID found for {title} by {artist}. Proceeding without AcousticBrainz.")
    except MetadataAPIError as e: # Catch potential errors from MB search
        logger.error(f"Error searching MusicBrainz for MBID: {e}. Proceeding without AcousticBrainz.")
        mbid = None # Ensure mbid is None if search fails
    except Exception as e: # Catch unexpected errors
         logger.exception(f"Unexpected error searching MusicBrainz: {e}. Proceeding without AcousticBrainz.")
         mbid = None
         
    # --- 3. Get AcousticBrainz Features (if MBID found) --- 
    if mbid:
        try:
            acousticbrainz_features = await acousticbrainz_service.get_audio_features(mbid)
            if acousticbrainz_features:
                logger.info(f"Successfully retrieved AcousticBrainz features for MBID {mbid}.")
            else:
                logger.info(f"No significant features found on AcousticBrainz for MBID {mbid}.")
        except Exception as e: # Catch potential errors from AB service
            logger.exception(f"Error retrieving AcousticBrainz data for MBID {mbid}: {e}")
            acousticbrainz_features = None # Ensure features are None if AB fails

    # --- 4. Prepare data and Analyze with Gemini --- 
    try:
        # Combine data for Gemini analysis
        analysis_input = {**musixmatch_metadata}
        if acousticbrainz_features:
            analysis_input.update(acousticbrainz_features) # Add AB features if available
            logger.info("Including AcousticBrainz features in Gemini prompt.")
        else:
            logger.info("No AcousticBrainz features to include in Gemini prompt.")
            
        logger.info(f"Starting Gemini analysis with combined data: {analysis_input.get('title')}...")
        gemini_analysis = await gemini_service.analyze_song_and_generate_keywords(analysis_input)
        logger.info(f"Gemini analysis successful for {analysis_input.get('title', 'Unknown Title')} by {analysis_input.get('artist', 'Unknown Artist')}. Keywords: {gemini_analysis['keywords']}")
        keywords = gemini_analysis.get("keywords")

        if not keywords:
             logger.error("Gemini failed to generate keywords.")
             # Return metadata + AB features + description if Gemini keywords fail
             return {
                 "source_track": musixmatch_metadata, 
                 "audio_features": acousticbrainz_features, # Include AB features
                 "analysis": gemini_analysis, # Include description
                 "similar_tracks": []
             }

        # 5. Find similar tracks on Jamendo using keywords
        logger.info(f"Searching Jamendo with keywords: {keywords}")
        jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=keywords, limit=10)
        
        logger.info("Search query processing complete.")

        return {
            "source_track": musixmatch_metadata, 
            "audio_features": acousticbrainz_features, # Include AB features
            "analysis": gemini_analysis,
            "similar_tracks": jamendo_tracks
        }

    except AIServiceError as e:
        logger.error(f"Gemini analysis failed: {str(e)}")
        # Return partial results if Gemini fails
        return {
            "source_track": musixmatch_metadata, 
            "audio_features": acousticbrainz_features,
            "analysis": {"description": "AI analysis failed.", "keywords": []}, # Indicate failure
            "similar_tracks": []
        }
    except HTTPException as http_exc: # Re-raise HTTP exceptions from Musixmatch step
        raise http_exc
    except Exception as e:
        logger.exception(f"Unexpected error during analysis or Jamendo search: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during AI analysis or similarity search."
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
    acousticbrainz_features: Optional[Dict] = None
    gemini_analysis: Optional[Dict] = None
    jamendo_tracks: List[Dict] = []
    mbid: Optional[str] = None
    shazam_title: Optional[str] = None
    shazam_artist: Optional[str] = None

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

        # Determine best title/artist for MBID lookup
        lookup_title = musixmatch_metadata.get('title') if musixmatch_metadata else shazam_title
        lookup_artist = musixmatch_metadata.get('artist') if musixmatch_metadata else shazam_artist

        # 3. Get MusicBrainz Recording ID (MBID)
        if lookup_title and lookup_artist:
            try:
                mbid = await musicbrainz_client.get_recording_mbid(title=lookup_title, artist=lookup_artist)
                if mbid:
                    logger.info(f"Found MBID: {mbid}")
                else:
                    logger.info(f"No suitable MBID found for {lookup_title} by {lookup_artist}.")
            except Exception as e:
                 logger.exception(f"Unexpected error searching MusicBrainz: {e}. Proceeding without AcousticBrainz.")
                 mbid = None
        else:
             logger.warning("Insufficient title/artist info to search MusicBrainz.")
             mbid = None
             
        # 4. Get AcousticBrainz Features (if MBID found)
        if mbid:
            try:
                acousticbrainz_features = await acousticbrainz_service.get_audio_features(mbid)
                if acousticbrainz_features:
                    logger.info(f"Successfully retrieved AcousticBrainz features for MBID {mbid}.")
            except Exception as e:
                logger.exception(f"Error retrieving AcousticBrainz data for MBID {mbid}: {e}")
                acousticbrainz_features = None

        # 5. Analyze with Gemini and generate keywords
        # Prepare combined data for Gemini 
        analysis_input = { # Start with best available info
            "title": lookup_title,
            "artist": lookup_artist,
        }
        if musixmatch_metadata: # Add Musixmatch data if we got it
            analysis_input.update(musixmatch_metadata)
        else: # Add basic Shazam info if no Musixmatch
            analysis_input['title'] = shazam_title
            analysis_input['artist'] = shazam_artist
            
        if acousticbrainz_features: # Add AB features if available
            analysis_input.update(acousticbrainz_features)

        logger.info(f"Starting Gemini analysis with combined data: {analysis_input.get('title')}...")
        try:
            gemini_analysis = await gemini_service.analyze_song_and_generate_keywords(analysis_input)
            logger.info(f"Gemini analysis successful. Keywords: {gemini_analysis['keywords']}")
            keywords = gemini_analysis.get("keywords")

            if not keywords:
                logger.error("Gemini failed to generate keywords.")
                # Return partial if Gemini keywords fail
                return {
                    "recognized_track": shazam_result,
                    "metadata": musixmatch_metadata,
                    "audio_features": acousticbrainz_features,
                    "analysis": gemini_analysis, # Include description
                    "similar_tracks": []
                }
        except AIServiceError as e:
             logger.error(f"Gemini analysis failed: {str(e)}")
             # Return partial results if Gemini fails
             return {
                 "recognized_track": shazam_result,
                 "metadata": musixmatch_metadata,
                 "audio_features": acousticbrainz_features,
                 "analysis": {"description": "AI analysis failed.", "keywords": []}, 
                 "similar_tracks": []
             }

        # 6. Find similar tracks on Jamendo using keywords
        logger.info(f"Searching Jamendo with keywords: {keywords}")
        jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=keywords, limit=10)
        
        logger.info("File processing complete.")

        return {
            "recognized_track": shazam_result,
            "metadata": musixmatch_metadata,
            "audio_features": acousticbrainz_features, # Added
            "analysis": gemini_analysis,
            "similar_tracks": jamendo_tracks
        }

    except RecognitionAPIError as e:
        logger.error(f"Shazam recognition failed: {str(e)}")
        raise HTTPException(status_code=502, detail=f"Audio recognition service failed: {str(e)}")
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