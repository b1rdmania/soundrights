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
        Analyze the song "{title}" by "{artist}". You have the following metadata:
        - Musixmatch Data: {{'title': '{title}', 'artist': '{artist}', 'genres': {genres}, 'instrumental': {instrumental}, 'rating': {rating}}}
        - MusicBrainz Data: {musicbrainz_info if musicbrainz_info else 'Not Available'}
        - Discogs Data: {discogs_info if discogs_info else 'Not Available'}

        Synthesize insights *from all available data sources* to perform the following tasks:

        1.  **Provide a SPECIFIC technical description (3-4 sentences)** focusing on objective musical characteristics useful for finding similar *royalty-free* music. 
            *   Synthesize information from Musixmatch genres, Discogs genres/styles, and MusicBrainz tags to determine the most likely subgenre(s) and overall sound.
            *   Use the Discogs year for era context.
            *   Infer distinctive instrumentation (beyond basic drums/bass/guitar) and vocal styles (e.g., falsetto, rap, male/female lead, harmonies) if implied by the combined metadata (artist, genre, styles, era).
            *   Estimate tempo range and primary mood/energy based on the synthesized understanding.
            *   Example: Instead of 'Pop song with vocals', aim for 'Upbeat 80s synth-pop with prominent synthesizers, electronic drums, and a clear male lead vocal'. Instead of 'Funk track', aim for 'Minimalist mid-80s funk with a distinctive falsetto vocal, syncopated drum machine beat, and funky guitar riff'.
            *   Avoid generic descriptions. Focus on what makes the track potentially unique based *only* on the provided metadata.
            *   Do NOT mention if the track is explicit.

        2.  **Generate a list of 6-8 SPECIFIC keywords** (tags) suitable for searching a royalty-free music library. Keywords MUST reflect the synthesized understanding of the track.
            *   **Prioritize Specificity:** Start with the most specific Genre/Style terms available (Discogs Styles first, then Musixmatch Genres, then Discogs Genres, then relevant MusicBrainz tags).
            *   Add 1-2 keywords reflecting the primary Mood/Energy (e.g., 'upbeat', 'melancholic', 'driving', 'chill').
            *   Add 1 keyword reflecting the Era (using Discogs Year if available, e.g., '80s', '2010s').
            *   Add 1 keyword for distinctive Instrumentation if identifiable (e.g., 'synthesizer', 'acoustic guitar', 'orchestral', '808s').
            *   Add 'vocal' or 'instrumental' based on the input flag.
            *   Ensure keywords are common search terms. Output *only* the keywords as a JSON list of strings.

        Example Input Data (Depeche Mode): {{...}} # Keep existing example
        Example Input Data (Prince - Kiss): {{ 'title': 'Kiss', 'artist': 'Prince', 'genres': [], 'instrumental': False, 'rating': 63, 'discogs_styles': ['Funk'], 'discogs_year': 1986, 'discogs_genres': ['Funk / Soul', 'Pop'] }}
        Example Output (Prince - Kiss): 
        {{
          "description": "A minimalist mid-80s funk track (1986) featuring a distinctive falsetto vocal. The arrangement likely relies heavily on a syncopated drum machine beat and a signature funky guitar riff, with less emphasis on bass compared to traditional funk. The mood is upbeat, confident, and danceable.",
          "keywords": ["Funk", "Minimal Funk", "80s", "Falsetto", "Upbeat", "Danceable", "Vocal", "Drum Machine"]
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