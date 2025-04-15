import httpx
from typing import Dict, Any, Optional, List
import asyncio
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import MusixmatchAPIError

class MusixmatchService:
    """Service for interacting with the Musixmatch API."""
    
    BASE_URL = "https://api.musixmatch.com/ws/1.1/"
    
    def __init__(self):
        self.api_key = settings.MUSIXMATCH_API_KEY
        if not self.api_key:
            raise ValueError("Musixmatch API key not configured")
        self.async_client = httpx.AsyncClient()
        
    async def _parse_track_data(self, track_data: Dict) -> Optional[Dict]:
        """Helper to parse track data from Musixmatch response."""
        if not track_data:
            return None
        try:
            primary_genres = track_data.get('primary_genres', {}).get('music_genre_list', [])
            genre_names = [g['music_genre']['music_genre_name'] for g in primary_genres if g.get('music_genre')]
            
            return {
                "musixmatch_id": track_data.get('track_id'),
                "commontrack_id": track_data.get('commontrack_id'),
                "title": track_data.get('track_name'),
                "artist": track_data.get('artist_name'),
                "album": track_data.get('album_name'),
                "rating": track_data.get('track_rating'),
                "explicit": track_data.get('explicit') == 1,
                "instrumental": track_data.get('instrumental') == 1,
                "genres": genre_names,
                "updated_time": track_data.get('updated_time')
            }
        except Exception as e:
             logger.error(f"Error parsing Musixmatch track data: {e}", exc_info=True)
             return None

    async def get_track_metadata(self, title: str, artist: str) -> Optional[Dict[str, Any]]:
        """Get Musixmatch track metadata using matcher.track.get."""
        
        endpoint = "matcher.track.get"
        params = {
            "apikey": self.api_key,
            "q_track": title,
            "q_artist": artist
        }
        
        url = f"{self.BASE_URL}{endpoint}"
        logger.info(f"Matching Musixmatch track: {title} by {artist}")
        
        try:
            response = await self.async_client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            if data['message']['header']['status_code'] != 200:
                error_info = data['message']['header'].get('hint', 'Unknown Musixmatch error')
                logger.error(f"Musixmatch API returned error status: {data['message']['header']['status_code']} - {error_info}")
                raise MusixmatchAPIError(f"Musixmatch API error: {error_info}")
                
            track_data = data.get('message', {}).get('body', {}).get('track')
            parsed_metadata = self._parse_track_data(track_data)

            if not parsed_metadata:
                logger.warning(f"No track match found or failed to parse on Musixmatch for: {title} by {artist}")
                return None
            
            logger.info(f"Found Musixmatch metadata via matcher for: {title} by {artist}")
            return parsed_metadata

        except httpx.HTTPStatusError as e:
            logger.error(f"Musixmatch API HTTP error (matcher): {e.request.url} - Status {e.response.status_code}")
            raise MusixmatchAPIError(f"Musixmatch API request failed with status {e.response.status_code}")
        except httpx.TimeoutException:
             logger.error("Musixmatch API request timed out (matcher).")
             raise MusixmatchAPIError("Musixmatch API request timed out")
        except httpx.RequestError as e:
            logger.error(f"Musixmatch API request failed (matcher, httpx error): {str(e)}")
            raise MusixmatchAPIError(f"Musixmatch API request failed: {str(e)}")
        except Exception as e:
            logger.exception(f"Unexpected error getting Musixmatch metadata (matcher): {str(e)}")
            raise MusixmatchAPIError(f"Unexpected error getting Musixmatch metadata: {str(e)}")
            
    async def search_track_by_query(self, query: str) -> Optional[Dict[str, Any]]:
        """Search Musixmatch for a track using a general query string (track.search)."""
        
        endpoint = "track.search"
        params = {
            "apikey": self.api_key,
            "q": query, # General query parameter
            "page_size": 1, # Get only the top result
            "s_track_rating": "desc" # Sort by popularity
        }
        
        url = f"{self.BASE_URL}{endpoint}"
        logger.info(f"Searching Musixmatch track with query: {query}")
        
        try:
            response = await self.async_client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            if data['message']['header']['status_code'] != 200:
                error_info = data['message']['header'].get('hint', 'Unknown Musixmatch error')
                logger.error(f"Musixmatch API returned error status: {data['message']['header']['status_code']} - {error_info}")
                raise MusixmatchAPIError(f"Musixmatch API error: {error_info}")
                
            track_list = data.get('message', {}).get('body', {}).get('track_list', [])
            
            if not track_list:
                logger.warning(f"No track found on Musixmatch search for query: {query}")
                return None
            
            # Parse the first track from the search results
            track_data = track_list[0]['track']
            parsed_metadata = self._parse_track_data(track_data)
            
            if not parsed_metadata:
                logger.warning(f"Failed to parse track data from Musixmatch search for query: {query}")
                return None
            
            logger.info(f"Found Musixmatch metadata via search for: {query}")
            return parsed_metadata

        except httpx.HTTPStatusError as e:
            logger.error(f"Musixmatch API HTTP error (search): {e.request.url} - Status {e.response.status_code}")
            raise MusixmatchAPIError(f"Musixmatch API request failed with status {e.response.status_code}")
        except httpx.TimeoutException:
             logger.error("Musixmatch API request timed out (search).")
             raise MusixmatchAPIError("Musixmatch API request timed out")
        except httpx.RequestError as e:
            logger.error(f"Musixmatch API request failed (search, httpx error): {str(e)}")
            raise MusixmatchAPIError(f"Musixmatch API request failed: {str(e)}")
        except Exception as e:
            logger.exception(f"Unexpected error getting Musixmatch metadata (search): {str(e)}")
            raise MusixmatchAPIError(f"Unexpected error getting Musixmatch metadata: {str(e)}")

# Create a global instance
musixmatch_service = MusixmatchService() 