import requests
from typing import Dict, Any, Optional
from ...core.logging import logger
from ...core.exceptions import MetadataAPIError

class MusicBrainzClient:
    """Client for interacting with MusicBrainz API."""
    
    BASE_URL = "https://musicbrainz.org/ws/2"
    USER_AGENT = "SoundMatch/1.0 (andy@example.com)"
    
    def __init__(self):
        self.headers = {
            "User-Agent": self.USER_AGENT,
            "Accept": "application/json"
        }
    
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