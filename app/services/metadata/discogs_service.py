import discogs_client
from typing import Dict, Any, Optional, List
from ...core.config import settings
from ...core.logging import logger
from ...core.exceptions import MetadataAPIError
import asyncio
import time
import requests # Add requests import

class DiscogsService:
    """Client for interacting with the Discogs API."""
    
    USER_AGENT = "SoundMatch/1.0 (andy@example.com)" 

    def __init__(self):
        self.client = None
        token = settings.DISCOGS_PERSONAL_ACCESS_TOKEN
        
        if token:
            try:
                self.client = discogs_client.Client(
                    self.USER_AGENT,
                    user_token=token
                )
                logger.info("Discogs client initialized successfully using Personal Access Token.")
            except Exception as e:
                logger.error(f"Failed to initialize Discogs client using token: {e}", exc_info=True)
        else:
            logger.warning("Discogs Personal Access Token not found in settings. Discogs service will be disabled.")

    async def _search_release_async(self, query: str, search_type: str = 'master', limit: int = 1):
        """Internal async wrapper for discogs_client search."""
        if not self.client:
            return None
        try:
            # Use to_thread as discogs_client is synchronous
            # Add a small delay to respect rate limits (Discogs is strict)
            await asyncio.sleep(1.0) # 1 second delay before each search
            
            logger.debug(f"Searching Discogs ({search_type}): {query}")
            results = await asyncio.to_thread(
                self.client.search,
                query,
                type=search_type,
                limit=limit
            )
            return results
        except discogs_client.exceptions.HTTPError as e:
            # Handle specific Discogs errors (like 404 Not Found, 429 Rate Limit)
            if e.status_code == 404:
                 logger.warning(f"Discogs search returned 404 (Not Found) for query: {query}")
            elif e.status_code == 429:
                 logger.error(f"Discogs rate limit hit! Status: {e.status_code}")
                 # Consider implementing backoff or circuit breaker here
            else:
                 logger.error(f"Discogs API HTTP error: {e.status_code} - {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during Discogs search: {e}", exc_info=True)
            return None

    async def get_release_data(self, artist: str, title: str) -> Optional[Dict[str, Any]]:
        """Search Discogs for a master release and return styles and year."""
        if not self.client:
             logger.warning("Discogs client not initialized, skipping search.")
             return None

        logger.info(f"Searching Discogs for release data: '{title}' by '{artist}'")
        search_query = f"{artist} {title}"
        
        # Prioritize searching for 'master' releases (Using discogs-client)
        results = await self._search_release_async(search_query, search_type='master', limit=1)
        
        # Fallback to general release search if no master found
        if not results:
             logger.info("No 'master' release found on Discogs, trying general 'release' search...")
             results = await self._search_release_async(search_query, search_type='release', limit=1)

        if not results or len(results) == 0:
            logger.warning(f"Discogs found no releases for query: {search_query}")
            return None

        best_match = results[0] 
        
        try: 
            release_to_fetch = getattr(best_match, 'main_release', best_match)
            if release_to_fetch:
                logger.debug(f"Refreshing Discogs release ID: {release_to_fetch.id}")
                await asyncio.to_thread(release_to_fetch.refresh)
                await asyncio.sleep(0.5) 
            else:
                 logger.warning("Could not determine release object to refresh.")
                 return None 
        
            discogs_data = {"discogs_id": best_match.id}
        
            styles = getattr(release_to_fetch, 'styles', [])
            if styles:
                discogs_data["styles"] = styles
                logger.info(f"Extracted Discogs styles: {styles}")
        
            year = getattr(release_to_fetch, 'year', None)
            if year and year > 0: 
                discogs_data["year"] = year
                logger.info(f"Extracted Discogs year: {year}")
                
            # Get primary genre(s)
            genres = getattr(release_to_fetch, 'genres', [])
            if genres:
                 discogs_data["genres"] = genres 
                 
            # Get primary image URL
            images = getattr(release_to_fetch, 'images', [])
            if images and isinstance(images, list) and len(images) > 0:
                primary_image = images[0]
                if isinstance(primary_image, dict) and primary_image.get('uri'):
                     discogs_data["image_url"] = primary_image['uri']
                     logger.info(f"Extracted Discogs image URL: {primary_image['uri']}")

            return discogs_data
            
        except AttributeError as e:
             logger.error(f"Attribute error accessing Discogs data for ID {best_match.id}: {e}")
             return None
        except discogs_client.exceptions.HTTPError as e:
             logger.error(f"Discogs API HTTP error during refresh: {e.status_code} - {e}") 
             if e.status_code == 401:
                  logger.error("Authentication failed specifically during Discogs refresh call!")
             return None
        except Exception as e:
             logger.exception(f"Unexpected error processing Discogs result ID {best_match.id}: {e}")
             return None

# Create a global instance
discogs_service = DiscogsService() 