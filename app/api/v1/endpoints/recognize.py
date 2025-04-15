from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any, Optional

from app.services.recognition.shazam import zyla_shazam_client
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