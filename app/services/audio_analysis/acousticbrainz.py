import httpx
from typing import Dict, Any, Optional
from app.core.logging import logger
from app.core.exceptions import AudioAnalysisError
import asyncio

# Map AcousticBrainz key names to standard musical notation
KEY_MAP = {
    "A": "A", "A#": "A#", "Bb": "Bb", "B": "B", "C": "C", "C#": "C#", 
    "Db": "Db", "D": "D", "D#": "D#", "Eb": "Eb", "E": "E", "F": "F", 
    "F#": "F#", "Gb": "Gb", "G": "G", "G#": "G#", "Ab": "Ab"
}
SCALE_MAP = {
    "major": "Major",
    "minor": "Minor"
}

class AcousticBrainzService:
    """Service for interacting with the AcousticBrainz API."""

    BASE_URL = "https://acousticbrainz.org/api/v1/"
    # API_KEY = "YOUR_ACOUSTICBRAINZ_API_KEY" # Store securely if needed, often not required for read access

    def __init__(self):
        # Consider storing the API key in settings if required for rate limits/specific access
        # self.api_key = settings.ACOUSTICBRAINZ_API_KEY 
        self.async_client = httpx.AsyncClient()

    async def get_audio_features(self, mbid: str) -> Optional[Dict[str, Any]]:
        """Get audio features (high-level) from AcousticBrainz using MBID."""
        if not mbid:
            return None

        # Using the high-level endpoint as it usually contains key/bpm
        endpoint = f"{mbid}/high-level"
        url = f"{self.BASE_URL}{endpoint}"
        logger.info(f"Querying AcousticBrainz for MBID: {mbid}")

        try:
            response = await self.async_client.get(url, timeout=15.0)
            response.raise_for_status() # Raise exception for 4xx/5xx errors
            data = response.json()

            # Extract relevant features
            tonal = data.get('tonal', {})
            rhythm = data.get('rhythm', {})
            
            features = {}
            
            # BPM
            if rhythm.get('bpm') is not None:
                features['bpm'] = round(rhythm['bpm'])
            
            # Key and Scale
            key_name = tonal.get('key_key')
            key_scale = tonal.get('key_scale')
            key_confidence = tonal.get('key_strength', 0) # Use key_strength as confidence proxy

            # Only include key/scale if confidence is reasonably high (e.g., > 0.4)
            # and the values are in our expected map
            if key_confidence > 0.4 and key_name in KEY_MAP and key_scale in SCALE_MAP:
                features['key'] = KEY_MAP[key_name]
                features['scale'] = SCALE_MAP[key_scale]
                features['key_confidence'] = round(key_confidence, 2)
            
            # Add other potentially useful high-level features if needed
            # features['danceability'] = data.get('danceability')
            # features['mood_acoustic'] = data.get('mood_acoustic')
            # ... etc

            if not features:
                logger.warning(f"AcousticBrainz returned no usable high-level features for MBID: {mbid}")
                return None
                
            logger.info(f"Successfully retrieved features from AcousticBrainz for MBID: {mbid}")
            return features

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                logger.warning(f"AcousticBrainz returned 404 (Not Found) for MBID: {mbid}")
            else:
                logger.error(f"AcousticBrainz API HTTP error: {e.request.url} - Status {e.response.status_code}")
            return None # Return None on HTTP errors, especially 404
        except httpx.TimeoutException:
            logger.error(f"AcousticBrainz API request timed out for MBID: {mbid}")
            return None # Return None on timeout
        except httpx.RequestError as e:
            logger.error(f"AcousticBrainz API request failed (httpx error): {str(e)}")
            return None # Return None on other request errors
        except Exception as e:
            logger.exception(f"Unexpected error getting AcousticBrainz data for MBID {mbid}: {str(e)}")
            return None # Return None on parsing or other errors

# Create a global instance (consider dependency injection later)
acousticbrainz_service = AcousticBrainzService() 