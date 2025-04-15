import google.generativeai as genai
from typing import Dict, List, Optional
import json
from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import AIServiceError

class GeminiService:
    """Service for interacting with Google Gemini API."""

    def __init__(self):
        self.api_key = settings.GOOGLE_GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("Google Gemini API key not configured")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash') # Using a fast model

    async def analyze_song_and_generate_keywords(
        self, shazam_data: Dict
    ) -> Dict[str, Optional[str | List[str]]]:
        """Analyzes Shazam song data using Gemini and generates keywords for royalty-free search."""

        title = shazam_data.get('title', 'Unknown Title')
        artist = shazam_data.get('subtitle', 'Unknown Artist') # Shazam often puts artist in subtitle

        logger.info(f"Analyzing song with Gemini: {title} by {artist}")

        prompt = f"""
        Analyze the song "{title}" by "{artist}". 

        Based on the title and artist:
        1. Describe the likely mood, tempo, energy level, instrumentation, and overall vibe of the song. Focus on characteristics useful for finding similar *royalty-free* music (e.g., on Jamendo). Keep the description concise (2-3 sentences).
        2. Generate a list of 5-7 relevant keywords (tags) suitable for searching a royalty-free music library like Jamendo for similar tracks. These keywords should reflect the description. Output only the keywords as a JSON list of strings.

        Example Input (Shazam Data): {{ 'title': 'Uptown Funk', 'subtitle': 'Mark Ronson ft. Bruno Mars' }}
        Example Output (JSON):
        {{
          "description": "An upbeat, high-energy funk-pop track with a driving bassline, horns, and strong vocals. Likely has a fast tempo suitable for dancing or energetic scenes.",
          "keywords": ["funk", "pop", "upbeat", "energetic", "dance", "retro", "horns"]
        }}

        Input (Shazam Data): {{ 'title': '{title}', 'subtitle': '{artist}' }}
        Output (JSON):
        """

        try:
            response = await self.model.generate_content_async(prompt)
            
            if not response.candidates or not response.candidates[0].content.parts:
                logger.error("Gemini returned an empty or invalid response.")
                raise AIServiceError("Gemini returned an empty response")

            # Attempt to parse the JSON response from Gemini
            response_text = response.text.strip()
            logger.debug(f"Raw Gemini response: {response_text}")

            # Clean potential markdown code blocks
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()

            analysis_data = json.loads(response_text)
            
            description = analysis_data.get("description")
            keywords = analysis_data.get("keywords")

            if not description or not keywords or not isinstance(keywords, list):
                logger.error(f"Gemini response missing description or keywords: {analysis_data}")
                raise AIServiceError("Gemini response format incorrect")

            logger.info(f"Gemini analysis successful for {title} by {artist}. Keywords: {keywords}")
            return {
                "description": description,
                "keywords": keywords
            }

        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode Gemini JSON response: {response_text} - Error: {e}")
            raise AIServiceError(f"Failed to decode Gemini response: {e}")
        except Exception as e:
            logger.exception(f"Error during Gemini analysis for {title} by {artist}: {str(e)}")
            # Check for specific Gemini API errors if the SDK provides them
            raise AIServiceError(f"Gemini API request failed: {str(e)}")

# Create a global instance
gemini_service = GeminiService() 