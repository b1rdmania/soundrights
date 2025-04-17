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
from app.services.metadata.discogs_service import discogs_service
from app.services.metadata.wikipedia_service import wikipedia_service
from app.core.exceptions import RecognitionAPIError, AIServiceError, MusixmatchAPIError, MetadataAPIError
import tempfile
import os
import time
import asyncio
from fastapi import status
import subprocess

router = APIRouter()

@router.get("/test-fpcalc", tags=["Testing"], summary="Test if fpcalc command is available")
async def test_fpcalc_availability():
    """Attempts to run 'fpcalc --version' to check its availability."""
    command = ["fpcalc", "--version"]
    result_data = {
        "command_checked": " ".join(command),
        "found": False,
        "output": None,
        "error": None,
        "exception": None
    }
    try:
        process = subprocess.run(command, capture_output=True, text=True, check=False, timeout=5)
        result_data["output"] = process.stdout.strip() if process.stdout else None
        result_data["error"] = process.stderr.strip() if process.stderr else None
        
        if process.returncode == 0:
            result_data["found"] = True
            logger.info(f"fpcalc check successful: {result_data['output']}")
        else:
            logger.warning(f"fpcalc check failed. Return code: {process.returncode}. Error: {result_data['error']}")
            
    except FileNotFoundError:
        error_msg = "'fpcalc' command not found. Is libchromaprint-tools installed?"
        result_data["exception"] = error_msg
        logger.error(error_msg)
    except subprocess.TimeoutExpired:
        error_msg = "'fpcalc' command timed out."
        result_data["exception"] = error_msg
        logger.error(error_msg)
    except Exception as e:
        error_msg = f"Unexpected error running fpcalc: {str(e)}"
        result_data["exception"] = error_msg
        logger.exception(error_msg)
        
    return result_data

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
    musicbrainz_data: Optional[Dict] = None
    discogs_data: Optional[Dict] = None
    wikipedia_summary: Optional[str] = None
    gemini_analysis: Optional[Dict] = None
    jamendo_tracks: List[Dict] = []

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
                logger.info(f"Musixmatch fallback metadata received: {musixmatch_metadata}")
            else:
                # If fallback also finds nothing, raise 404 with better message
                logger.warning(f"Musixmatch fallback search also found no track for query: {fallback_query}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Track not found: '{title}' by '{artist}'. Please check spelling or try again."
                )
        except MusixmatchAPIError as fallback_e:
            # If fallback search itself fails with an API error
            logger.error(f"Musixmatch fallback search also failed: {fallback_e}")
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Metadata service failed during fallback search: {fallback_e}")
        except Exception as fallback_exc: # Catch any other unexpected error during fallback
            logger.exception(f"Unexpected error during Musixmatch fallback search: {fallback_exc}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An unexpected error occurred during the metadata fallback search.")

    # Ensure metadata was found either by primary or fallback method
    if not musixmatch_metadata:
        # This case should technically be covered by the exceptions above, but as a safeguard:
        logger.error(f"Logic error: No Musixmatch metadata found after primary and fallback attempts for '{title}' '{artist}'")
        raise HTTPException(status_code=500, detail="Failed to retrieve metadata after fallback attempts.")

    # Determine best title/artist AFTER Musixmatch step
    lookup_title = musixmatch_metadata.get('title', title)
    lookup_artist = musixmatch_metadata.get('artist', artist)
    
    # --- 2. Get MusicBrainz Data (Tags, MBID) --- 
    try:
        musicbrainz_data = await musicbrainz_client.get_musicbrainz_data(title=lookup_title, artist=lookup_artist)
        if musicbrainz_data:
            logger.info(f"Successfully retrieved MusicBrainz data: {musicbrainz_data}")
        else:
            logger.info(f"No suitable MusicBrainz data found for {lookup_title} by {lookup_artist}.")
    except MetadataAPIError as e: 
        logger.error(f"Error searching MusicBrainz for data: {e}. Proceeding without it.")
        musicbrainz_data = None 
    except Exception as e: 
         logger.exception(f"Unexpected error searching MusicBrainz: {e}. Proceeding without it.")
         musicbrainz_data = None

    # --- 3. Get Discogs Data --- 
    try:
        discogs_data = await discogs_service.get_release_data(title=lookup_title, artist=lookup_artist)
        if discogs_data:
            logger.info(f"Successfully retrieved Discogs data: {discogs_data}")
        else:
            logger.info(f"No suitable Discogs data found for {lookup_title} by {lookup_artist}.")
    except MetadataAPIError as e: # Discogs client might raise this on error
        logger.error(f"Error searching Discogs for data: {e}. Proceeding without it.")
        discogs_data = None 
    except Exception as e: 
         logger.exception(f"Unexpected error searching Discogs: {e}. Proceeding without it.")
         discogs_data = None

    # --- 4. Get Wikipedia Summary --- 
    try:
        # Construct a search term - maybe try song title first?
        # Or combine title and artist
        wiki_search_term = f"{lookup_artist} {lookup_title}" # Or f"{lookup_title} (song)" ? Test needed.
        wikipedia_summary = await wikipedia_service.get_wikipedia_summary(wiki_search_term)
        if wikipedia_summary:
             logger.info(f"Successfully retrieved Wikipedia summary for: {wiki_search_term}")
        else:
             logger.info(f"No Wikipedia summary found for: {wiki_search_term}")
    except Exception as e:
         logger.exception(f"Unexpected error fetching Wikipedia summary: {e}. Proceeding without it.")
         wikipedia_summary = None

    # --- Analyze with Gemini (using only Musixmatch data) --- 
    try:
        # Combine data for Gemini analysis
        analysis_input = {**musixmatch_metadata} # Start with Musixmatch data
        if musicbrainz_data and musicbrainz_data.get("tags"):
            # Add MB tags under a specific key to avoid collision
            analysis_input["musicbrainz_tags"] = musicbrainz_data["tags"]
            logger.info("Including MusicBrainz tags in Gemini prompt.")
        else:
            logger.info("No MusicBrainz tags to include in Gemini prompt.")
        
        if discogs_data: # ADD Discogs data if available
            if discogs_data.get("styles"):
                 analysis_input["discogs_styles"] = discogs_data["styles"]
                 logger.info("Including Discogs styles in Gemini prompt.")
            if discogs_data.get("year"):
                 analysis_input["discogs_year"] = discogs_data["year"]
                 logger.info("Including Discogs year in Gemini prompt.")
        
        logger.info(f"Starting Gemini analysis with combined data: {analysis_input.get('title')}...")
        gemini_analysis = await gemini_service.analyze_song_and_generate_keywords(analysis_input)
        logger.info(f"Gemini analysis successful for {analysis_input.get('title', 'Unknown Title')} by {analysis_input.get('artist', 'Unknown Artist')}. Keywords: {gemini_analysis['keywords']}")
        keywords = gemini_analysis.get("keywords")

        if not keywords:
             logger.error("Gemini failed to generate keywords.")
             return {
                 "source_track": musixmatch_metadata, 
                 "musicbrainz_data": musicbrainz_data,
                 "discogs_data": discogs_data,
                 "wikipedia_summary": wikipedia_summary,
                 "analysis": gemini_analysis, 
                 "similar_tracks": []
             }

        # --- 5. Find similar tracks on Jamendo --- 
        logger.info(f"Original Gemini keywords: {keywords}")
        
        # Prepend Musixmatch genres to the keywords for Jamendo search priority
        jamendo_search_keywords = list(keywords) # Create a copy
        musixmatch_genres = musixmatch_metadata.get("genres", [])
        if musixmatch_genres: 
            # Add genres at the beginning of the list
            jamendo_search_keywords = musixmatch_genres + jamendo_search_keywords 
            logger.info(f"Prepending Musixmatch genres. Keywords for Jamendo: {jamendo_search_keywords}")
        else:
            logger.info("No Musixmatch genres to prepend.")
        
        # Limit the total number of keywords if it gets too long? Optional.
        # MAX_JAMENDO_KEYWORDS = 10 
        # jamendo_search_keywords = jamendo_search_keywords[:MAX_JAMENDO_KEYWORDS]
            
        logger.info(f"Searching Jamendo with keywords: {jamendo_search_keywords}")
        # jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=keywords, limit=10) # OLD
        jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=jamendo_search_keywords, limit=10) # NEW
        
        logger.info("Search query processing complete.")

        return {
            "source_track": musixmatch_metadata, 
            "musicbrainz_data": musicbrainz_data,
            "discogs_data": discogs_data,
            "wikipedia_summary": wikipedia_summary,
            "analysis": gemini_analysis,
            "similar_tracks": jamendo_tracks
        }

    except AIServiceError as e:
        logger.error(f"Gemini analysis failed: {str(e)}")
        # Return partial results if Gemini fails
        return {
            "source_track": musixmatch_metadata, 
            "musicbrainz_data": musicbrainz_data,
            "discogs_data": discogs_data,
            "wikipedia_summary": wikipedia_summary,
            "analysis": {"description": "AI analysis failed.", "keywords": []}, 
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
    musicbrainz_data: Optional[Dict] = None
    discogs_data: Optional[Dict] = None
    wikipedia_summary: Optional[str] = None
    gemini_analysis: Optional[Dict] = None
    jamendo_tracks: List[Dict] = []
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
                    logger.info(f"Musixmatch metadata received (process-file): {musixmatch_metadata}")
                else:
                    logger.info("No additional metadata found on Musixmatch.")
            except MusixmatchAPIError as e:
                logger.warning(f"Musixmatch API error, proceeding without enrichment: {e}")
                musixmatch_metadata = None # Continue without Musixmatch data if it fails
            except Exception as e:
                logger.error(f"Unexpected error during Musixmatch fetch: {e}", exc_info=True)
                musixmatch_metadata = None # Continue without Musixmatch data

        # Determine best title/artist for MB lookup
        lookup_title = musixmatch_metadata.get('title') if musixmatch_metadata else shazam_result.get('title')
        lookup_artist = musixmatch_metadata.get('artist') if musixmatch_metadata else shazam_result.get('subtitle')

        # 3. Get MusicBrainz Data
        if lookup_title and lookup_artist:
            try:
                musicbrainz_data = await musicbrainz_client.get_musicbrainz_data(title=lookup_title, artist=lookup_artist)
                if musicbrainz_data:
                    logger.info(f"Successfully retrieved MusicBrainz data for {lookup_title}")
                else:
                    logger.info(f"No suitable MusicBrainz data found for {lookup_title}.")
            except Exception as e:
                 logger.exception(f"Unexpected error searching MusicBrainz: {e}. Proceeding without it.")
                 musicbrainz_data = None
        else:
             logger.warning("Insufficient title/artist info to search MusicBrainz.")
             musicbrainz_data = None
             
        # 4. Get Discogs Data 
        if lookup_title and lookup_artist:
            try:
                discogs_data = await discogs_service.get_release_data(title=lookup_title, artist=lookup_artist)
                if discogs_data:
                    logger.info(f"Successfully retrieved Discogs data for {lookup_title}")
                else:
                    logger.info(f"No suitable Discogs data found for {lookup_title}.")
            except Exception as e:
                 logger.exception(f"Unexpected error searching Discogs: {e}. Proceeding without it.")
                 discogs_data = None
        else:
             logger.warning("Insufficient title/artist info to search Discogs.")
             discogs_data = None

        # 5. Get Wikipedia Summary
        try:
            # Construct a search term - maybe try song title first?
            # Or combine title and artist
            wiki_search_term = f"{lookup_artist} {lookup_title}" # Or f"{lookup_title} (song)" ? Test needed.
            wikipedia_summary = await wikipedia_service.get_wikipedia_summary(wiki_search_term)
            if wikipedia_summary:
                 logger.info(f"Successfully retrieved Wikipedia summary for: {wiki_search_term}")
            else:
                 logger.info(f"No Wikipedia summary found for: {wiki_search_term}")
        except Exception as e:
             logger.exception(f"Unexpected error fetching Wikipedia summary: {e}. Proceeding without it.")
             wikipedia_summary = None

        # 6. Analyze with Gemini 
        analysis_input = None
        if musixmatch_metadata:
            analysis_input = {**musixmatch_metadata}
            logger.info("Using Musixmatch data for Gemini analysis.")
        elif lookup_title and lookup_artist: # Use Shazam info if no Musixmatch
            analysis_input = {"title": lookup_title, "artist": lookup_artist}
            logger.info("Using only Shazam title/artist for Gemini analysis.")
        else:
            # Handle case where even Shazam failed to provide basic info
            logger.error("Cannot perform Gemini analysis: Insufficient track info.")
            return { 
                 "recognized_track": shazam_result, # May be None or partial
                 "metadata": None,
                 "musicbrainz_data": None,
                 "discogs_data": None,
                 "wikipedia_summary": wikipedia_summary,
                 "analysis": {"description": "Analysis skipped: Insufficient info.", "keywords": []},
                 "similar_tracks": []
             }
            
        if musicbrainz_data and musicbrainz_data.get("tags"):
            analysis_input["musicbrainz_tags"] = musicbrainz_data["tags"]
            logger.info("Including MusicBrainz tags in Gemini prompt.")

        if discogs_data: # ADD Discogs data
            if discogs_data.get("styles"):
                 analysis_input["discogs_styles"] = discogs_data["styles"]
            if discogs_data.get("year"):
                 analysis_input["discogs_year"] = discogs_data["year"]

        logger.info(f"Starting Gemini analysis with data: {analysis_input.get('title')}...")
        try:
            gemini_analysis = await gemini_service.analyze_song_and_generate_keywords(analysis_input)
            logger.info(f"Gemini analysis successful. Keywords: {gemini_analysis['keywords']}")
            keywords = gemini_analysis.get("keywords")

            if not keywords:
                logger.error("Gemini failed to generate keywords.")
                return {
                    "recognized_track": shazam_result,
                    "metadata": musixmatch_metadata,
                    "musicbrainz_data": musicbrainz_data,
                    "discogs_data": discogs_data,
                    "wikipedia_summary": wikipedia_summary,
                    "analysis": gemini_analysis, 
                    "similar_tracks": []
                }
        except AIServiceError as e:
             logger.error(f"Gemini analysis failed: {str(e)}")
             return {
                 "recognized_track": shazam_result,
                 "metadata": musixmatch_metadata,
                 "musicbrainz_data": musicbrainz_data,
                 "discogs_data": discogs_data,
                 "wikipedia_summary": wikipedia_summary,
                 "analysis": {"description": "AI analysis failed.", "keywords": []}, 
                 "similar_tracks": []
             }

        # 7. Find similar tracks on Jamendo
        logger.info(f"Original Gemini keywords: {keywords}")
        
        # Prepend Musixmatch genres (if available) for Jamendo search priority
        jamendo_search_keywords = list(keywords) # Create a copy
        if musixmatch_metadata and musixmatch_metadata.get("genres"):
             musixmatch_genres = musixmatch_metadata.get("genres", [])
             jamendo_search_keywords = musixmatch_genres + jamendo_search_keywords
             logger.info(f"Prepending Musixmatch genres. Keywords for Jamendo: {jamendo_search_keywords}")
        else:
             logger.info("No Musixmatch genres found to prepend for Jamendo search.")
             
        logger.info(f"Searching Jamendo with keywords: {jamendo_search_keywords}")
        # jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=keywords, limit=10) # OLD
        jamendo_tracks = await jamendo_service.find_similar_tracks_by_keywords(keywords=jamendo_search_keywords, limit=10) # NEW
        
        logger.info("File processing complete.")

        return {
            "recognized_track": shazam_result,
            "metadata": musixmatch_metadata,
            "musicbrainz_data": musicbrainz_data,
            "discogs_data": discogs_data,
            "wikipedia_summary": wikipedia_summary,
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