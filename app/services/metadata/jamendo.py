from typing import Dict, List, Optional, Any
import requests
from ...core.config import settings
from ...core.logging import logger

class JamendoService:
    """Service for interacting with Jamendo API to find similar tracks."""
    
    BASE_URL = "https://api.jamendo.com/v3.0"
    CLIENT_ID = "b553314a"
    
    def __init__(self):
        self.api_key = settings.JAMENDO_API_KEY
        self.base_url = "https://api.jamendo.com/v3.0"
    
    @staticmethod
    def _map_spotify_mood(valence: float, energy: float) -> str:
        """Map Spotify's valence and energy values to Jamendo mood tags."""
        if valence >= 0.6 and energy >= 0.6:
            return "happy"
        elif valence <= 0.4 and energy <= 0.4:
            return "sad"
        elif energy >= 0.7:
            return "energetic"
        elif valence <= 0.3:
            return "melancholic"
        else:
            return "calm"
    
    @staticmethod
    def _is_instrumental(instrumentalness: float, danceability: float) -> bool:
        """Determine if track is likely instrumental based on Spotify features."""
        return instrumentalness > 0.5 and danceability < 0.5
    
    @staticmethod
    def _estimate_bpm(duration_seconds: int) -> float:
        """Estimate BPM based on track duration."""
        # Most songs are between 90-130 BPM
        # Longer songs tend to be slower
        if duration_seconds > 300:  # > 5 minutes
            return 90
        elif duration_seconds < 180:  # < 3 minutes
            return 130
        else:
            return 120
    
    @staticmethod
    def _matches_energy(track_name: str, track_tags: List[str], target_energy: float) -> bool:
        """Check if track name and tags suggest matching energy level."""
        track_name = track_name.lower()
        track_tags = [tag.lower() for tag in track_tags]
        
        high_energy_keywords = ["rock", "metal", "dance", "party", "fast", "upbeat", "high", "loud", "electronic", "techno", "trance"]
        low_energy_keywords = ["slow", "quiet", "soft", "gentle", "ambient", "acoustic", "piano", "classical"]
        
        if target_energy >= 0.7:
            return any(word in track_name or word in track_tags for word in high_energy_keywords)
        elif target_energy <= 0.3:
            return any(word in track_name or word in track_tags for word in low_energy_keywords)
        return True
    
    @staticmethod
    def _matches_mood(track_name: str, track_tags: List[str], target_mood: str) -> bool:
        """Check if track name and tags suggest matching mood."""
        track_name = track_name.lower()
        track_tags = [tag.lower() for tag in track_tags]
        
        mood_keywords = {
            "happy": ["happy", "joy", "love", "smile", "good", "great", "wonderful", "positive", "cheerful"],
            "sad": ["sad", "hate", "angry", "dark", "bad", "evil", "death", "negative", "depressive"],
            "energetic": ["rock", "metal", "dance", "party", "fast", "upbeat", "electronic", "techno"],
            "melancholic": ["sad", "dark", "slow", "quiet", "ambient", "piano", "classical"]
        }
        
        return any(word in track_name or word in track_tags for word in mood_keywords.get(target_mood, []))
    
    def search_similar_tracks(
        self,
        spotify_features: Dict[str, Any],
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Search for similar tracks on Jamendo based on Spotify audio features.
        
        Args:
            spotify_features: Dictionary containing Spotify audio features
            limit: Maximum number of tracks to return
            
        Returns:
            List of matching tracks with their details
        """
        try:
            # Extract relevant features
            target_bpm = spotify_features.get("bpm", 120)
            target_energy = spotify_features.get("energy", 0.5)
            target_valence = spotify_features.get("valence", 0.5)
            
            # Calculate search parameters
            target_mood = self._map_spotify_mood(target_valence, target_energy)
            
            # Build query parameters
            params = {
                "client_id": self.CLIENT_ID,
                "format": "json",
                "limit": limit * 2,  # Request more tracks to filter later
                "include": "musicinfo stats",
                "fuzzytags": 1,  # Enable fuzzy tag matching
                "boost": "popularity_total",  # Boost by popularity
                "orderby": "popularity_total",  # Order by popularity
                "audioformat": "mp32",  # Request MP3 format
                "include": "musicinfo stats",  # Include music info and stats
                "audio": 1,  # Only return tracks with audio
            }
            
            # Add mood-based tags to search
            mood_tags = {
                "happy": ["happy", "joy", "love", "positive", "pop", "dance"],
                "sad": ["sad", "melancholic", "dark", "ambient"],
                "energetic": ["rock", "metal", "dance", "electronic", "pop"],
                "melancholic": ["sad", "dark", "ambient", "piano", "acoustic"]
            }
            
            if target_mood in mood_tags:
                params["tags"] = mood_tags[target_mood]
            
            # Make API request
            response = requests.get(
                f"{self.BASE_URL}/tracks/",
                params=params
            )
            response.raise_for_status()
            
            # Process response
            data = response.json()
            tracks = data.get("results", [])
            
            # Format tracks
            formatted_tracks = []
            for track in tracks:
                # Skip tracks without audio
                if not track.get("audio"):
                    continue
                    
                # Estimate BPM from duration
                estimated_bpm = self._estimate_bpm(track["duration"])
                bpm_diff = abs(estimated_bpm - target_bpm)
                
                # Calculate similarity score based on BPM difference
                # Max difference of 60 BPM = 0% similarity
                similarity = max(0, 1 - (bpm_diff / 60))
                
                # Only include tracks with reasonable similarity
                if similarity < 0.3:
                    continue
                
                formatted_track = {
                    "id": track["id"],
                    "name": track["name"],
                    "artist_name": track["artist_name"],
                    "image_url": track.get("image", ""),
                    "audio_url": track.get("audio", ""),
                    "download_url": track.get("audiodownload", ""),
                    "license_type": track.get("license_ccurl", "Unknown License"),
                    "bpm": estimated_bpm,
                    "tags": track.get("tags", []),
                    "mood": target_mood,
                    "similarity": similarity
                }
                formatted_tracks.append(formatted_track)
            
            # Sort by similarity and take top N
            formatted_tracks.sort(key=lambda x: x["similarity"], reverse=True)
            formatted_tracks = formatted_tracks[:limit]
            
            logger.info(f"Found {len(formatted_tracks)} similar tracks on Jamendo")
            return formatted_tracks
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error searching Jamendo tracks: {str(e)}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error in Jamendo search: {str(e)}")
            return []

    async def find_similar_tracks(
        self,
        title: str,
        artist: str,
        tags: List[str],
        mood: str
    ) -> List[Dict[str, Any]]:
        """
        Find similar tracks on Jamendo based on metadata.
        
        Args:
            title: Track title
            artist: Artist name
            tags: List of tags/genres
            mood: Track mood
            
        Returns:
            List of similar tracks with metadata
        """
        try:
            # Build search query using tags and mood
            search_tags = tags[:3]  # Use up to 3 tags
            if mood:
                search_tags.append(mood)
                
            # Search for tracks with similar tags
            response = requests.get(
                f"{self.base_url}/tracks/",
                params={
                    "client_id": self.api_key,
                    "format": "json",
                    "limit": 10,
                    "tags": ",".join(search_tags),
                    "include": "musicinfo stats",
                    "fuzzytags": 1,
                    "boost": "popularity_total"
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Process and format results
            similar_tracks = []
            for track in data.get("results", []):
                similar_tracks.append({
                    "id": track["id"],
                    "title": track["name"],
                    "artist": track["artist_name"],
                    "duration": str(track["duration"]),
                    "audio_url": track["audio"],
                    "download_url": track["audio"],
                    "license": track["license_ccurl"],
                    "tags": track.get("tags", []),
                    "mood": mood,
                    "similarity": self._calculate_similarity(
                        title, artist, track["name"], track["artist_name"]
                    )
                })
            
            # Sort by similarity and return top 5
            similar_tracks.sort(key=lambda x: x["similarity"], reverse=True)
            return similar_tracks[:5]
            
        except Exception as e:
            logger.error(f"Error finding similar tracks: {str(e)}")
            return []
            
    def _calculate_similarity(
        self,
        title1: str,
        artist1: str,
        title2: str,
        artist2: str
    ) -> float:
        """
        Calculate similarity score between two tracks.
        This is a simple implementation that can be improved.
        """
        # Convert to lowercase for comparison
        title1 = title1.lower()
        title2 = title2.lower()
        artist1 = artist1.lower()
        artist2 = artist2.lower()
        
        # Calculate title similarity
        title_words1 = set(title1.split())
        title_words2 = set(title2.split())
        title_similarity = len(title_words1.intersection(title_words2)) / max(len(title_words1), len(title_words2))
        
        # Calculate artist similarity
        artist_words1 = set(artist1.split())
        artist_words2 = set(artist2.split())
        artist_similarity = len(artist_words1.intersection(artist_words2)) / max(len(artist_words1), len(artist_words2))
        
        # Combine similarities with weights
        return 0.7 * title_similarity + 0.3 * artist_similarity

# Create a global instance
jamendo_service = JamendoService() 