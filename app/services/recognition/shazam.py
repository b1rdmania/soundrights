import httpx
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import RecognitionAPIError
import asyncio

class ZylaShazamClient:
    """Client for interacting with the Zyla Labs Shazam API."""
    
    BASE_URL = "https://zylalabs.com/api/2219/shazam+api"
    RECOGNIZE_ENDPOINT = "/2068/recognize+song"
    REQUEST_TIMEOUT = 30.0
    
    def __init__(self):
        if not settings.ZYLA_SHAZAM_API_KEY:
            raise ValueError("Zyla Shazam API key not configured")
        self.api_key = settings.ZYLA_SHAZAM_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        self.async_client = httpx.AsyncClient(timeout=self.REQUEST_TIMEOUT)
        
    async def recognize_audio(self, audio_data: bytes, filename: str) -> Optional[Dict[str, Any]]:
        """Recognize a song from audio data using httpx."""
        try:
            url = f"{self.BASE_URL}{self.RECOGNIZE_ENDPOINT}"
            files = {
                'image': (filename, audio_data, 'audio/mpeg')
            }
            
            logger.info(f"Sending request to Zyla Shazam API at {url} with file {filename}")
            logger.info(f"Audio data size: {len(audio_data)} bytes")
            response = await self.async_client.post(url, headers=self.headers, files=files)
            
            logger.info(f"Received response from Zyla Shazam API. Status: {response.status_code}")
            response.raise_for_status()
            
            data = response.json()
            logger.info(f"Shazam recognition successful for {filename}")
            
            if data and "track" in data:
                return data["track"]
            else:
                logger.warning(f"Shazam recognition response did not contain track data: {data}")
                return None

        except httpx.HTTPStatusError as e:
            logger.error(f"Zyla Shazam API HTTP error: {e.request.url} - Status {e.response.status_code}")
            logger.error(f"Response body: {e.response.text}")
            if e.response.status_code == 401:
                 raise RecognitionAPIError("Zyla Shazam API Unauthorized - Check API Key")
            elif e.response.status_code == 429:
                 raise RecognitionAPIError("Zyla Shazam API rate limit exceeded")
            else:
                 raise RecognitionAPIError(f"Zyla Shazam API request failed with status {e.response.status_code}")
        except httpx.TimeoutException:
             logger.error(f"Zyla Shazam API request timed out after {self.REQUEST_TIMEOUT} seconds.")
             raise RecognitionAPIError("Audio recognition service timed out")
        except httpx.RequestError as e:
            logger.error(f"Zyla Shazam API request failed (httpx error): {str(e)}")
            raise RecognitionAPIError(f"Zyla Shazam API request failed: {str(e)}")
        except Exception as e:
            logger.exception(f"Unexpected error recognizing audio with Shazam: {str(e)}")
            raise RecognitionAPIError(f"Unexpected error recognizing audio: {str(e)}")

# Create a global instance
zyla_shazam_client = ZylaShazamClient() 