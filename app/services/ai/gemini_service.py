import google.generativeai as genai
from typing import Dict, List, Optional, Any
import json
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import AIServiceError
import asyncio
import re

class GeminiService:
    """Service for interacting with Google Gemini API."""

    def __init__(self):
        self.api_key = settings.GOOGLE_GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("Google Gemini API key not configured")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash') # Use a faster model if possible

    async def analyze_song_and_generate_keywords(self, track_metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes track metadata using Gemini to generate a description and keywords
        suitable for finding similar royalty-free tracks.

        Args:
            track_metadata: Dictionary containing track info (title, artist, genres, etc.)

        Returns:
            Dictionary with 'description' and 'keywords' (list of strings).

        Raises:
            AIServiceError: If the Gemini API call fails or returns unexpected data.
        """
        title = track_metadata.get("title", "Unknown Title")
        artist = track_metadata.get("artist", "Unknown Artist")
        genres = track_metadata.get("genres", [])
        rating = track_metadata.get("rating")
        instrumental = track_metadata.get("instrumental")

        # Construct conditional parts of the prompt
        genre_info = f"with genre(s) {', '.join(genres)}" if genres else ""
        instrumental_info = "which is instrumental" if instrumental else ""
        rating_info = f"and has a rating of {rating}" if rating is not None else ""

        # Add info about AcousticBrainz data if present
        bpm = track_metadata.get('bpm')
        key = track_metadata.get('key')
        scale = track_metadata.get('scale')
        acousticbrainz_info = ""
        if bpm:
            acousticbrainz_info += f" with an estimated BPM of {bpm}."
        if key and scale:
            acousticbrainz_info += f" The key is likely {key} {scale}."
            

        prompt = f"""
        Analyze the song "{title}" by "{artist}" {genre_info} {instrumental_info} {rating_info}.{acousticbrainz_info}

        Based *only* on the provided metadata (including BPM/Key if available):
        1.  Provide a detailed technical description (3-4 sentences) focusing on objective musical characteristics useful for finding similar *royalty-free* music (e.g., on Jamendo). 
            *   **If BPM/Key/Scale data is provided:** Incorporate it into the description (e.g., "fast tempo, 140 BPM", "key of C Major").
            *   **If BPM/Key/Scale data is NOT provided:** Make reasonable estimations based on Genre/Artist/Era.
            *   Include: Tempo range, likely instrumentation, vocal presence/style (NOT specific gender), mood/energy, approximate musical era.
            *   Avoid subjective opinions or external knowledge. Do NOT mention if the track is explicit.
        2.  Generate a list of **6-8 keywords** (tags) suitable for searching a royalty-free music library like Jamendo. Keywords MUST primarily reflect the **Genre(s), Mood, and Tempo/Energy level**. 
            *   **If BPM/Key/Scale data is provided:** Consider adding a keyword reflecting the specific BPM or Key (e.g., '140 bpm', 'C Major') if highly characteristic.
            *   Include 1-2 keywords for the most prominent **Instrumentation or Era** if useful.
            *   Use terms like 'vocal' or 'instrumental' based on the input flag.
            *   Do NOT include keywords related to the track being explicit.
            *   Ensure keywords are common terms (e.g., 'upbeat pop', 'sad acoustic guitar', 'cinematic orchestral', 'fast 80s synthwave'). Output *only* the keywords as a JSON list of strings.

        Example Input Data: {{ 'title': 'Uptown Funk', 'artist': 'Mark Ronson ft. Bruno Mars', 'genres': ['Funk', 'Pop'], 'instrumental': False, 'rating': 90, 'bpm': 115, 'key': 'D', 'scale': 'Minor'}}
        Example Output (JSON):
        {{
          "description": "A high-energy (fast tempo, 115 BPM) funk-pop track from the 2010s, likely in D Minor. Instrumentation features prominent bass guitar, horns, drums, and synthesizers, with a strong male lead vocal. The mood is upbeat, groovy, and suitable for dancing.",
          "keywords": ["funk", "pop", "upbeat", "dance", "fast tempo", "115 bpm", "D Minor", "horns", "male vocal"]
        }}

        Input Data: {json.dumps(track_metadata)}
        Output (JSON):
        """
        
        logger.debug(f"Sending prompt to Gemini: \n{prompt}")

        try:
            # Use asyncio.to_thread for the synchronous SDK call
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt
            )
            
            # Debug: Log raw response text
            logger.debug(f"Raw Gemini response: {response.text}")
            
            # Attempt to extract JSON from the response text
            # Handle potential markdown code fences (```json ... ```)
            match = re.search(r"```json\n(.*?)\n```", response.text, re.DOTALL)
            if match:
                json_text = match.group(1).strip()
            else:
                # Assume the whole text might be JSON if no fences found
                json_text = response.text.strip()
                
            analysis_result = json.loads(json_text)

            if not isinstance(analysis_result, dict) or \
               "description" not in analysis_result or \
               "keywords" not in analysis_result or \
               not isinstance(analysis_result["keywords"], list):
                raise AIServiceError("Invalid format in Gemini response.")
            
            # Basic validation for keywords list elements
            if not all(isinstance(kw, str) for kw in analysis_result["keywords"]):
                 raise AIServiceError("Invalid keyword format in Gemini response keywords list.")

            return analysis_result
        
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON from Gemini response: {e}\nResponse text: {response.text}")
            raise AIServiceError(f"Failed to parse JSON from AI service: {e}")
        except Exception as e:
            # Catch potential errors from the SDK call or other issues
            logger.error(f"Error during Gemini API call or processing: {str(e)}", exc_info=True)
            raise AIServiceError(f"AI service request failed: {str(e)}")

# Create a global instance
# Consider making this configurable or using dependency injection
gemini_service = GeminiService() 