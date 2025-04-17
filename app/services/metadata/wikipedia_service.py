import asyncio
import httpx
from typing import Optional, Dict, Any
from ...core.logging import logger

class WikipediaService:
    USER_AGENT = "SoundMatch/1.0 (Contact: andy@example.com)" # Replace with actual contact
    BASE_URL = "https://en.wikipedia.org/w/api.php"

    async def get_wikipedia_summary(self, search_term: str) -> Optional[str]:
        """Fetches the introductory summary of a Wikipedia page."""
        logger.info(f"Querying Wikipedia for summary of: {search_term}")
        
        params = {
            "action": "query",
            "format": "json",
            "titles": search_term,
            "prop": "extracts",
            "exintro": 1,       # Get only content before the first section
            "explaintext": 1,   # Get plain text extract
            "redirects": 1,     # Automatically follow redirects
            "origin": "*"       # Necessary for unauthenticated CORS requests if using browser JS, good practice
        }
        
        headers = {'User-Agent': self.USER_AGENT}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.BASE_URL, params=params, headers=headers, timeout=10.0)
                response.raise_for_status() # Raise exceptions for 4XX/5XX errors
                
            data = response.json()
            pages = data.get("query", {}).get("pages", {})
            
            if not pages:
                logger.warning(f"Wikipedia query returned no pages for: {search_term}")
                return None

            # Find the actual page data (API returns page ID as key)
            page_data = None
            for page_id, page_info in pages.items():
                # Ignore invalid pages (e.g., page ID -1 often means missing page)
                if int(page_id) > 0:
                    page_data = page_info
                    break 
            
            if not page_data:
                 logger.warning(f"Wikipedia query returned invalid page data for: {search_term}")
                 return None

            summary = page_data.get("extract")
            
            if summary:
                # Clean up potential "(listen)" text often found in intros
                summary = summary.replace("(listen)", "").strip()
                # Limit length slightly if needed?
                # MAX_SUMMARY_LEN = 500 
                # if len(summary) > MAX_SUMMARY_LEN:
                #    summary = summary[:MAX_SUMMARY_LEN] + "..."
                logger.info(f"Successfully extracted Wikipedia summary for: {search_term}")
                return summary
            else:
                logger.info(f"No Wikipedia summary (extract) found for page: {page_data.get('title', search_term)}")
                return None

        except httpx.HTTPStatusError as e:
            # Handle cases like 404 Not Found gracefully
            if e.response.status_code == 404:
                 logger.warning(f"Wikipedia page not found (404) for: {search_term}")
            else:
                 logger.error(f"Wikipedia API HTTP error: {e.response.status_code} - {e.request.url}")
            return None
        except httpx.RequestError as e:
            logger.error(f"Wikipedia API request failed: {e}")
            return None
        except Exception as e:
            logger.exception(f"Unexpected error fetching Wikipedia summary for {search_term}: {e}")
            return None

# Create a global instance
wikipedia_service = WikipediaService() 