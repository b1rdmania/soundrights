# NOTE: All endpoints in this file should have automated, detailed tests and ongoing debugging.
# TODO: Create automated tests for all endpoints in this file (no test directory found yet).
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any

from app.services.audio_identification.audd_service import AudDService
from app.core.logging import logger
import tempfile
import os

router = APIRouter()

@router.post("/audio/audd")
async def recognize_audio_audd_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Recognize a song from an uploaded audio file using the AudD API.
    Args:
        file: The uploaded audio file (MP3 recommended).
    Returns:
        Dictionary containing the recognized track information from AudD.
    """
    logger.info(f"Received audio file for AudD recognition: {file.filename}")

    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty.")

    # Save uploaded file to a temporary location
    try:
        audio_data = await file.read()
        if not audio_data:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[-1]) as tmp:
            tmp.write(audio_data)
            tmp_path = tmp.name
    except Exception as e:
        logger.error(f"Error handling uploaded file: {str(e)}")
        raise HTTPException(status_code=400, detail="Could not process the uploaded file.")

    # Call AudDService
    try:
        result = AudDService.recognize_by_file(tmp_path, return_metadata="apple_music,spotify")
        logger.info(f"AudD recognition result: {result}")
        return result
    except Exception as e:
        logger.error(f"AudD recognition failed: {str(e)}")
        raise HTTPException(status_code=503, detail=f"AudD recognition failed: {str(e)}")
    finally:
        # Clean up temp file
        try:
            os.remove(tmp_path)
        except Exception:
            pass 