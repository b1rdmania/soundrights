import requests
from typing import Dict, Any, Optional
from ...core.logging import logger
from ...core.exceptions import MetadataAPIError
import asyncio
import musicbrainzngs # Import the library

class MusicBrainzClient:
    """Client for interacting with MusicBrainz API."""
    
    BASE_URL = "https://musicbrainz.org/ws/2"
    USER_AGENT = "SoundMatch/1.0 (andy@example.com)"
    
    def __init__(self):
        # No headers needed for musicbrainzngs library
        # Setup musicbrainzngs user agent
        musicbrainzngs.set_useragent(app="SoundMatch", version="1.0", contact="andy@example.com") # Replace with actual contact

    async def _search_recordings_async(self, title: str, artist: str, limit: int = 5):
        """Internal async wrapper for musicbrainzngs search."""
        try:
            # Use to_thread as musicbrainzngs is synchronous
            result = await asyncio.to_thread(
                musicbrainzngs.search_recordings,
                query=f'recording:"{title}" AND artist:"{artist}"', 
                limit=limit,
                strict=True # Use strict search for potentially better matches
            )
            return result
        except musicbrainzngs.WebServiceError as exc:
            logger.error(f"MusicBrainz API error during recording search: {exc}")
            raise MetadataAPIError(f"MusicBrainz API error: {exc}")
        except Exception as e:
            logger.error(f"Unexpected error during MusicBrainz search: {e}", exc_info=True)
            raise MetadataAPIError(f"Unexpected error during MusicBrainz search: {e}")

    async def get_recording_mbid(self, title: str, artist: str) -> Optional[str]:
        """Search MusicBrainz for a recording and return the best match MBID."""
        logger.info(f"Searching MusicBrainz for MBID for: '{title}' by '{artist}'")
        try:
            results = await self._search_recordings_async(title=title, artist=artist)
            
            recordings = results.get('recording-list', [])
            if not recordings:
                logger.warning(f"MusicBrainz found no recordings for: '{title}' by '{artist}'")
                return None

            # Select the best match (often the first one with high score)
            # We could add more sophisticated matching logic here if needed
            # For now, trust the first result if score is high enough
            best_match = recordings[0]
            score = int(best_match.get('ext:score', '0'))
            mbid = best_match.get('id')

            if score > 85 and mbid: # Use a score threshold 
                 logger.info(f"Found potential MBID: {mbid} with score {score} for '{title}'")
                 return mbid
            else:
                logger.warning(f"MusicBrainz top match score ({score}) too low or no MBID for: '{title}' by '{artist}'. Match: {best_match}")
                return None

        except MetadataAPIError:
             # Error already logged in _search_recordings_async
             return None # Return None if search fails
        except Exception as e:
            logger.exception(f"Unexpected error getting MBID for '{title}' by '{artist}': {e}")
            return None
            
    async def search_track(self, query: str) -> Optional[Dict[str, Any]]:
        """Search for a track in MusicBrainz."""
        try:
            search_url = f"{self.BASE_URL}/recording"
            params = {
                "query": query,
                "fmt": "json",
                "limit": 1
            }
            
            response = requests.get(search_url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            if not data.get("recordings"):
                return None
            
            recording = data["recordings"][0]
            
            # Get additional metadata
            recording_id = recording["id"]
            recording_url = f"{self.BASE_URL}/recording/{recording_id}"
            params = {
                "inc": "releases+artists+tags+ratings+genres",
                "fmt": "json"
            }
            
            response = requests.get(recording_url, headers=self.headers, params=params)
            response.raise_for_status()
            recording_data = response.json()
            
            # Extract features
            features = self._extract_features(
                recording_data.get("tags", []),
                recording_data.get("ratings", []),
                recording_data.get("genres", [])
            )
            
            return {
                "title": recording["title"],
                "artist": recording["artist-credit"][0]["name"] if recording.get("artist-credit") else "Unknown Artist",
                "duration": recording.get("length", 0),
                "tags": [tag["name"] for tag in recording_data.get("tags", [])],
                "mood": self._extract_mood(recording_data.get("tags", [])),
                "url": f"https://musicbrainz.org/recording/{recording_id}",
                "features": features
            }
            
        except requests.exceptions.RequestException as e:
            logger.error(f"MusicBrainz API request failed: {str(e)}")
            raise MetadataAPIError(f"MusicBrainz API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Error searching track: {str(e)}")
            raise
    
    def _extract_mood(self, tags: list) -> str:
        """Extract mood from tags."""
        mood_tags = {
            "happy": "Happy",
            "sad": "Sad",
            "energetic": "Energetic",
            "calm": "Calm",
            "romantic": "Romantic",
            "melancholic": "Melancholic",
            "upbeat": "Upbeat",
            "dark": "Dark",
            "peaceful": "Peaceful",
            "angry": "Angry"
        }
        
        for tag in tags:
            tag_name = tag["name"].lower()
            for mood, display in mood_tags.items():
                if mood in tag_name:
                    return display
        
        return "Neutral"
    
    def get_track_features(self, track_name: str, artist_name: str) -> Dict[str, Any]:
        """Get track audio features from MusicBrainz."""
        try:
            # First, search for the recording
            search_url = f"{self.BASE_URL}/recording"
            params = {
                "query": f'recording:"{track_name}" AND artist:"{artist_name}"',
                "fmt": "json",
                "limit": 1
            }
            
            response = requests.get(search_url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            if not data.get("recordings"):
                raise MetadataAPIError("No recording found")
            
            recording = data["recordings"][0]
            
            # Get additional metadata including audio features
            recording_id = recording["id"]
            recording_url = f"{self.BASE_URL}/recording/{recording_id}"
            params = {
                "inc": "releases+artists+tags+ratings+genres",
                "fmt": "json"
            }
            
            response = requests.get(recording_url, headers=self.headers, params=params)
            response.raise_for_status()
            recording_data = response.json()
            
            # Extract audio features from tags, ratings, and genres
            tags = recording_data.get("tags", [])
            ratings = recording_data.get("ratings", [])
            genres = recording_data.get("genres", [])
            
            # Calculate features based on tags, ratings, and genres
            features = self._extract_features(tags, ratings, genres)
            
            logger.info(f"Successfully retrieved audio features for {track_name}")
            return features
            
        except requests.exceptions.RequestException as e:
            logger.error(f"MusicBrainz API request failed: {str(e)}")
            raise MetadataAPIError(f"MusicBrainz API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Error getting track features: {str(e)}")
            raise
    
    def _extract_features(self, tags: list, ratings: list, genres: list) -> Dict[str, Any]:
        """Extract audio features from MusicBrainz tags, ratings, and genres."""
        # Default values
        features = {
            "tempo": 120.0,
            "key": 0,
            "energy": 0.5,
            "danceability": 0.5,
            "valence": 0.5,
            "acousticness": 0.5,
            "instrumentalness": 0.5
        }
        
        # Extract features from tags and genres
        tag_features = {
            "tempo": {
                "fast": 140.0,
                "slow": 80.0,
                "medium": 120.0,
                "upbeat": 130.0,
                "downtempo": 90.0
            },
            "energy": {
                "energetic": 0.8,
                "calm": 0.3,
                "mellow": 0.4,
                "intense": 0.9,
                "soft": 0.2,
                "powerful": 0.8
            },
            "danceability": {
                "danceable": 0.8,
                "dance": 0.7,
                "groovy": 0.7,
                "upbeat": 0.8,
                "rhythmic": 0.7
            },
            "valence": {
                "happy": 0.8,
                "sad": 0.2,
                "dark": 0.3,
                "upbeat": 0.7,
                "melancholic": 0.3,
                "cheerful": 0.8
            },
            "acousticness": {
                "acoustic": 0.8,
                "electronic": 0.2,
                "electric": 0.3,
                "unplugged": 0.9,
                "synthetic": 0.2
            },
            "instrumentalness": {
                "instrumental": 0.8,
                "vocal": 0.2,
                "solo": 0.7,
                "orchestral": 0.9,
                "a cappella": 0.1
            }
        }
        
        # Process tags
        for tag in tags:
            tag_name = tag["name"].lower()
            for feature, values in tag_features.items():
                for keyword, value in values.items():
                    if keyword in tag_name:
                        features[feature] = value
        
        # Process genres
        for genre in genres:
            genre_name = genre["name"].lower()
            for feature, values in tag_features.items():
                for keyword, value in values.items():
                    if keyword in genre_name:
                        features[feature] = value
        
        # Adjust based on ratings if available
        if ratings:
            avg_rating = sum(r["value"] for r in ratings) / len(ratings)
            # Use rating to adjust energy and valence
            features["energy"] = min(1.0, features["energy"] * (avg_rating / 5.0))
            features["valence"] = min(1.0, features["valence"] * (avg_rating / 5.0))
        
        # Normalize features to ensure they're within valid ranges
        features["energy"] = max(0.0, min(1.0, features["energy"]))
        features["danceability"] = max(0.0, min(1.0, features["danceability"]))
        features["valence"] = max(0.0, min(1.0, features["valence"]))
        features["acousticness"] = max(0.0, min(1.0, features["acousticness"]))
        features["instrumentalness"] = max(0.0, min(1.0, features["instrumentalness"]))
        features["tempo"] = max(60.0, min(200.0, features["tempo"]))
        features["key"] = max(0, min(11, features["key"]))
        
        return features

# Create a global instance
musicbrainz_client = MusicBrainzClient() 