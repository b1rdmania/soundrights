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

        # Check for MusicBrainz tags
        musicbrainz_tags = track_metadata.get('musicbrainz_tags')
        musicbrainz_info = ""
        if musicbrainz_tags:
            musicbrainz_info = f" MusicBrainz tags suggest: {', '.join(musicbrainz_tags[:5])}."
            
        # Check for Discogs data (styles, year)
        discogs_styles = track_metadata.get('discogs_styles')
        discogs_year = track_metadata.get('discogs_year')
        discogs_info = ""
        if discogs_year:
             discogs_info += f" Released around {discogs_year}."
        if discogs_styles:
             discogs_info += f" Discogs styles include: {', '.join(discogs_styles[:3])}."

        prompt = f"""
        Analyze the song "{title}" by "{artist}" {genre_info} {instrumental_info} {rating_info}.{musicbrainz_info}{discogs_info}

        Based *only* on the provided metadata (Musixmatch primary, with potential MusicBrainz tags and Discogs styles/year):
        1.  Provide a detailed technical description (3-4 sentences) focusing on objective musical characteristics useful for finding similar *royalty-free* music (e.g., on Jamendo). 
            *   Base estimations primarily on Musixmatch data (Genre, Artist).
            *   Use MusicBrainz tags and Discogs styles/year (if provided) to refine the description (especially era and subgenre).
            *   Include: Estimated tempo range, likely instrumentation, vocal presence/style (NOT specific gender), mood/energy, approximate musical era (Refine using Discogs year if available).
            *   Avoid subjective opinions or external knowledge. Do NOT mention if the track is explicit.
        2.  Generate a list of **6-8 keywords** (tags) suitable for searching a royalty-free music library like Jamendo. Keywords MUST primarily reflect the **Genre(s) (prioritize Musixmatch, refine with Discogs Styles/Genres), Mood, and Estimated Tempo/Energy level**. 
            *   Use the MusicBrainz tags (if provided) to inspire 1-2 relevant keywords if they seem useful for search (e.g., a subgenre or instrument tag).
            *   Use the Discogs **Styles** (if provided) to add 1-2 specific subgenre or style keywords (e.g., 'Synth-pop', 'Deep House').
            *   Use the Discogs **Year** (if provided) to potentially add an era keyword (e.g., '80s', '2010s').
            *   Include 1 keyword for the most prominent **Instrumentation** if useful.
            *   Use terms like 'vocal' or 'instrumental' based on the input flag.
            *   Do NOT include keywords related to the track being explicit.
            *   Ensure keywords are common terms (e.g., 'upbeat pop', 'sad acoustic guitar', 'cinematic orchestral', 'fast 80s synthwave'). Output *only* the keywords as a JSON list of strings.

        Example Input Data: {{ 'title': 'Enjoy the Silence', 'artist': 'Depeche Mode', 'genres': ['Electronic'], 'instrumental': False, 'rating': 95, 'musicbrainz_tags': ['synthpop', 'electronic', '80s'], 'discogs_styles': ['Synth-pop', 'New Wave'], 'discogs_year': 1990 }}
        Example Output (JSON):
        {{
          "description": "An electronic track from 1990, likely Synth-pop or New Wave style. Expect synthesizers, drum machines, and vocals with a moderate to fast tempo. The mood is likely atmospheric, possibly melancholic or driving, typical of the era.",
          "keywords": ["Electronic", "Synth-pop", "New Wave", "80s", "90s", "atmospheric", "vocal", "synthesizer"]
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