import requests
from typing import Optional, Dict, Any
from ...core.config import settings
from ...core.logging import logger
from ...core.exceptions import SpotifyAPIError

class SpotifyClient:
    """Client for interacting with Spotify API."""
    
    BASE_URL = "https://api.spotify.com/v1"
    
    def __init__(self):
        self.access_token = None
        self.refresh_token = None
        self.client_token = None
    
    def set_tokens(self, access_token: str, refresh_token: str):
        """Set the access and refresh tokens."""
        self.access_token = access_token
        self.refresh_token = refresh_token
        logger.info("Successfully set Spotify tokens")
    
    def set_client_token(self, token: str):
        """Set the client credentials token."""
        self.client_token = token
        logger.info("Successfully set Spotify client token")
    
    def _get_headers(self, use_client_token: bool = False) -> Dict[str, str]:
        """Get headers for API requests."""
        if use_client_token:
            if not self.client_token:
                raise SpotifyAPIError("No client token available")
            return {
                "Authorization": f"Bearer {self.client_token}",
                "Content-Type": "application/json"
            }
        else:
            if not self.access_token:
                raise SpotifyAPIError("No access token available")
            return {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
            }
    
    def _make_request(self, method: str, endpoint: str, use_client_token: bool = False, **kwargs) -> Dict[str, Any]:
        """Make a request to the Spotify API."""
        url = f"{self.BASE_URL}/{endpoint}"
        try:
            response = requests.request(
                method,
                url,
                headers=self._get_headers(use_client_token),
                **kwargs
            )
            
            if not use_client_token and response.status_code == 401 and self.refresh_token:
                # Token expired, try to refresh
                logger.info("Token expired, attempting to refresh")
                self._refresh_token()
                # Retry the request with new token
                response = requests.request(
                    method,
                    url,
                    headers=self._get_headers(use_client_token),
                    **kwargs
                )
            
            if response.status_code == 403:
                error_msg = response.json().get('error', {}).get('message', 'Access denied')
                logger.error(f"Access denied to {endpoint}: {error_msg}")
                raise SpotifyAPIError(f"Access denied to {endpoint}: {error_msg}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Spotify API request failed: {str(e)}")
            raise SpotifyAPIError(f"Spotify API request failed: {str(e)}")
    
    def _refresh_token(self):
        """Refresh the access token using the refresh token."""
        try:
            response = requests.post(
                "https://accounts.spotify.com/api/token",
                data={
                    "grant_type": "refresh_token",
                    "refresh_token": self.refresh_token,
                    "client_id": settings.SPOTIFY_CLIENT_ID,
                    "client_secret": settings.SPOTIFY_CLIENT_SECRET
                }
            )
            response.raise_for_status()
            data = response.json()
            self.access_token = data["access_token"]
            if "refresh_token" in data:
                self.refresh_token = data["refresh_token"]
            logger.info("Successfully refreshed Spotify access token")
        except Exception as e:
            logger.error(f"Failed to refresh token: {str(e)}")
            raise SpotifyAPIError(f"Failed to refresh token: {str(e)}")
    
    def get_track_info(self, track_id: str) -> Dict[str, Any]:
        """Get track information."""
        try:
            data = self._make_request("GET", f"tracks/{track_id}")
            logger.info(f"Successfully retrieved track info for: {data.get('name', track_id)}")
            return data
        except Exception as e:
            logger.error(f"Error getting track info: {str(e)}")
            raise
    
    def get_track_features(self, track_id: str) -> Dict[str, Any]:
        """Get track audio features."""
        try:
            logger.info(f"Requesting audio features for track {track_id}")
            if not self.access_token:
                raise SpotifyAPIError("No access token available for audio features")
            
            response = requests.get(
                f"{self.BASE_URL}/audio-features/{track_id}",
                headers={
                    "Authorization": f"Bearer {self.access_token}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code == 403:
                error_msg = response.json().get('error', {}).get('message', 'Access denied')
                logger.error(f"Access denied to audio features: {error_msg}")
                raise SpotifyAPIError(f"Access denied to audio features: {error_msg}")
            
            response.raise_for_status()
            data = response.json()
            
            if not data:
                raise SpotifyAPIError("No audio features data returned")
                
            logger.info("Successfully retrieved audio features")
            
            # Transform the response into our expected format
            return {
                "tempo": data.get("tempo", 120.0),
                "key": data.get("key", 0),
                "energy": data.get("energy", 0.5),
                "danceability": data.get("danceability", 0.5),
                "valence": data.get("valence", 0.5),
                "acousticness": data.get("acousticness", 0.5),
                "instrumentalness": data.get("instrumentalness", 0.5)
            }
        except Exception as e:
            logger.error(f"Error getting track features: {str(e)}")
            raise
    
    def search_track(self, query: str) -> Dict[str, Any]:
        """Search for a track by name or artist."""
        try:
            return self._make_request(
                "GET",
                "search",
                params={
                    "q": query,
                    "type": "track",
                    "limit": 1
                }
            )
        except Exception as e:
            logger.error(f"Error searching track: {str(e)}")
            raise

# Create a global instance
spotify_client = SpotifyClient() 