import requests
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import RecognitionAPIError

class ZylaShazamClient:
    """Client for interacting with the Zyla Labs Shazam API."""
    
    BASE_URL = "https://zylalabs.com/api/2219/shazam+api"
    RECOGNIZE_ENDPOINT = "/2068/recognize+song"
    
    def __init__(self):
        if not settings.ZYLA_SHAZAM_API_KEY:
            raise ValueError("Zyla Shazam API key not configured")
        self.api_key = settings.ZYLA_SHAZAM_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}"
            # Content-Type will be set by requests for multipart/form-data
        }
        
    async def recognize_audio(self, audio_data: bytes, filename: str) -> Optional[Dict[str, Any]]:
        """Recognize a song from audio data."""
        try:
            url = f"{self.BASE_URL}{self.RECOGNIZE_ENDPOINT}"
            files = {
                'image': (filename, audio_data, 'audio/mpeg') # Assuming MP3, adjust if needed
            }
            
            response = requests.post(url, headers=self.headers, files=files)
            response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
            
            data = response.json()
            logger.info(f"Shazam recognition successful for {filename}")
            
            # Basic check for track data in response
            if data and "track" in data:
                return data["track"]
            else:
                logger.warning("Shazam recognition response did not contain track data.")
                return None

        except requests.exceptions.RequestException as e:
            logger.error(f"Zyla Shazam API request failed: {str(e)}")
            # Check for specific status codes if needed (e.g., 401 Unauthorized)
            if e.response is not None:
                logger.error(f"Response status: {e.response.status_code}")
                logger.error(f"Response body: {e.response.text}")
                if e.response.status_code == 401:
                     raise RecognitionAPIError("Zyla Shazam API Unauthorized - Check API Key")
            raise RecognitionAPIError(f"Zyla Shazam API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Error recognizing audio with Shazam: {str(e)}")
            raise RecognitionAPIError(f"Error recognizing audio: {str(e)}")

# Create a global instance
zyla_shazam_client = ZylaShazamClient() 