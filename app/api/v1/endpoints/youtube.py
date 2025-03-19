from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from app.core.exceptions import InvalidURLError
from app.services.youtube.client import youtube_client
from app.core.logging import logger
from pydantic import BaseModel

router = APIRouter()

class YouTubeURLRequest(BaseModel):
    url: str

@router.post("/process")
async def process_youtube_url(request: YouTubeURLRequest = Body(...)) -> Dict[str, Any]:
    """Process a YouTube URL and return video information."""
    try:
        # Extract video ID from URL
        video_id = youtube_client.extract_video_id(request.url)
        
        # Get video info
        video_info = youtube_client.get_video_info(video_id)
        
        logger.info(f"Successfully processed YouTube video: {video_info['title']}")
        return video_info
        
    except InvalidURLError as e:
        logger.error(f"Invalid YouTube URL: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing YouTube URL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 