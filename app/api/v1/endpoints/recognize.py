from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any, Optional, List

from app.services.recognition.shazam import zyla_shazam_client
from app.services.ai.llm import gemini_service
from app.core.logging import logger
from app.core.exceptions import RecognitionAPIError

router = APIRouter()

@router.post("/audio")
async def recognize_audio_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Recognize a song from an uploaded audio file using Shazam.
    
    Args:
        file: The uploaded audio file (MP3 recommended).
        
    Returns:
        Dictionary containing the recognized track information from Shazam.
    """
    logger.info(f"Received audio file for recognition: {file.filename}")
    
    # Basic validation (optional, can add more checks)
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty.")
        
    # Read file content
    try:
        audio_data = await file.read()
    except Exception as e:
        logger.error(f"Error reading uploaded file: {str(e)}")
        raise HTTPException(status_code=400, detail="Could not read the uploaded file.")
        
    if not audio_data:
         raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Send to Shazam service
    try:
        recognized_track = await zyla_shazam_client.recognize_audio(audio_data, file.filename)
        
        if recognized_track:
            logger.info(f"Successfully recognized track: {recognized_track.get('title')} by {recognized_track.get('subtitle')}")
            return recognized_track
        else:
            logger.warning(f"Could not recognize track from file: {file.filename}")
            raise HTTPException(status_code=404, detail="Could not recognize the track from the provided audio.")
            
    except RecognitionAPIError as e:
        logger.error(f"Shazam recognition failed for {file.filename}: {str(e)}")
        # Provide a generic error or map specific errors if needed
        raise HTTPException(status_code=503, detail=f"Audio recognition service failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error during Shazam recognition for {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during audio recognition.") 

@router.post("/identify-and-generate-keywords")
async def identify_and_generate_keywords_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Recognize a song using Shazam, generate keywords using Gemini,
    and return both.
    
    Args:
        file: The uploaded audio file (MP3 recommended).
        
    Returns:
        Dictionary containing recognized track info and generated keywords.
    """
    logger.info(f"Received audio file for identify-and-generate: {file.filename}")

    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty.")

    # Read file content
    try:
        audio_data = await file.read()
    except Exception as e:
        logger.error(f"Error reading uploaded file: {str(e)}")
        raise HTTPException(status_code=400, detail="Could not read the uploaded file.")

    if not audio_data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 1. Recognize with Shazam
    recognized_track: Optional[Dict[str, Any]] = None
    try:
        recognized_track = await zyla_shazam_client.recognize_audio(audio_data, file.filename)
        if not recognized_track:
            raise HTTPException(status_code=404, detail="Shazam could not recognize the track.")
        
        logger.info(f"Shazam identified: {recognized_track.get('title')} by {recognized_track.get('subtitle')}")
        
    except RecognitionAPIError as e:
        logger.error(f"Shazam recognition failed for {file.filename}: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Audio recognition service failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error during Shazam recognition for {file.filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during audio recognition.")

    # 2. Generate Keywords with Gemini
    track_title = recognized_track.get('title', 'Unknown Title')
    track_artist = recognized_track.get('subtitle', 'Unknown Artist') # Zyla seems to use subtitle for artist
    generated_keywords: Optional[List[str]] = None
    try:
        generated_keywords = await gemini_service.generate_keywords_for_track(track_title, track_artist)
        if not generated_keywords:
             logger.warning(f"Gemini failed to generate keywords for {track_title}")
             # Proceed without keywords, or raise an error? Decide based on desired behavior.
             # For now, we'll return the track info anyway.

    except Exception as e:
        # Log the error but don't fail the whole request if Gemini fails
        logger.error(f"Gemini keyword generation failed for {track_title}: {str(e)}")
        # generated_keywords remains None

    # 3. Combine and Return Results
    return {
        "recognized_track": recognized_track,
        "generated_keywords": generated_keywords or [] # Return empty list if generation failed
    } 