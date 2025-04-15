import google.generativeai as genai
from app.core.config import settings
from app.core.logging import logger
from typing import List, Optional

class GeminiService:
    """Service for interacting with Google Gemini API."""
    
    def __init__(self):
        if not settings.GOOGLE_GEMINI_API_KEY:
            raise ValueError("Google Gemini API key not configured")
        
        genai.configure(api_key=settings.GOOGLE_GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash') # Or choose another suitable model
        logger.info("Gemini Service Initialized")

    async def generate_keywords_for_track(self, title: str, artist: str) -> Optional[List[str]]:
        """Generates descriptive keywords for a track using Gemini."""
        try:
            prompt = (
                f"Analyze the song titled '{title}' by '{artist}'. "
                f"Generate a comma-separated list of 10-15 descriptive keywords, genres, moods, instruments, "
                f"and use cases suitable for searching for *other* similar copyright-free music. "
                f"Focus on terms useful for music library searches. Examples: upbeat, corporate, cinematic, piano, acoustic guitar, happy, background music, vlog music, indie pop, ambient, electronic. "
                f"Output only the comma-separated list."
            )
            
            logger.info(f"Sending prompt to Gemini for '{title}' by '{artist}'")
            response = await self.model.generate_content_async(prompt)
            
            # Basic response validation (needs refinement based on actual API response structure)
            if response and hasattr(response, 'text') and response.text:
                keywords_text = response.text.strip()
                keywords = [kw.strip() for kw in keywords_text.split(',') if kw.strip()]
                logger.info(f"Gemini generated keywords: {keywords}")
                return keywords
            else:
                 logger.warning(f"Gemini did not return valid text response for '{title}'. Response: {response}")
                 return None

        except Exception as e:
            logger.error(f"Error generating keywords with Gemini for '{title}' by '{artist}': {str(e)}")
            # Depending on the exception type, you might want to raise it or return None
            return None

# Create a global instance
gemini_service = GeminiService() 