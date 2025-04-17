import asyncio
import httpx
import json
import logging
import os
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ACOUSTID_API_URL = "https://api.acoustid.org/v2/lookup"
# Store API key in environment variable for security
ACOUSTID_CLIENT_API_KEY = os.getenv("ACOUSTID_APP_API_KEY", "ebvANUXBF8") # Use provided key as default

class AcoustIDError(Exception):
    """Custom exception for AcoustID client errors."""
    pass

class AcoustIDClient:
    """Client for interacting with fpcalc and the AcoustID API."""

    def __init__(self, api_key: str = ACOUSTID_CLIENT_API_KEY):
        if not api_key:
            raise ValueError("AcoustID Application API Key is required.")
        self.api_key = api_key
        self.base_params = {"client": self.api_key, "format": "json"}

    async def _run_fpcalc(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Runs fpcalc on the audio file to get duration and fingerprint."""
        try:
            # Use -json flag for easy parsing
            process = await asyncio.create_subprocess_exec(
                'fpcalc', '-json', file_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            if process.returncode != 0:
                stderr_str = stderr.decode().strip()
                logger.error(f"fpcalc failed for {file_path}. Exit code: {process.returncode}, Error: {stderr_str}")
                raise AcoustIDError(f"fpcalc error: {stderr_str}")

            result = json.loads(stdout.decode())
            logger.info(f"fpcalc successful for {file_path}. Duration: {result.get('duration')}")
            return {"duration": result.get('duration'), "fingerprint": result.get('fingerprint')}

        except FileNotFoundError:
            logger.error("fpcalc command not found. Ensure chromaprint is installed and in PATH.")
            raise AcoustIDError("fpcalc not found. Chromaprint might not be installed correctly.")
        except json.JSONDecodeError:
            logger.error(f"Failed to parse fpcalc JSON output: {stdout.decode()}")
            raise AcoustIDError("Failed to parse fpcalc output.")
        except Exception as e:
            logger.error(f"An unexpected error occurred while running fpcalc: {e}")
            raise AcoustIDError(f"An unexpected fpcalc error occurred: {e}")

    async def lookup_fingerprint(self, file_path: str, metadata: Optional[list[str]] = None) -> Optional[Dict[str, Any]]:
        """Gets fingerprint using fpcalc and looks it up via AcoustID API."""
        fpcalc_result = await self._run_fpcalc(file_path)
        if not fpcalc_result or not fpcalc_result.get('duration') or not fpcalc_result.get('fingerprint'):
            logger.warning(f"Could not get fingerprint/duration for {file_path}")
            return None

        params = {
            **self.base_params,
            "duration": str(int(fpcalc_result['duration'])), # Duration must be an integer string
            "fingerprint": fpcalc_result['fingerprint'],
        }
        if metadata:
            # e.g., ['recordings', 'releasegroups', 'compress']
            params["meta"] = '+'.join(metadata) 

        async with httpx.AsyncClient() as client:
            try:
                logger.info(f"Querying AcoustID API for fingerprint of {file_path}...")
                response = await client.get(ACOUSTID_API_URL, params=params, timeout=15.0)
                response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

                data = response.json()
                if data.get("status") == "ok" and data.get("results"):
                    # Return the first result (usually the highest score)
                    best_result = max(data["results"], key=lambda x: x.get('score', 0), default=None)
                    logger.info(f"AcoustID lookup successful for {file_path}. Score: {best_result.get('score') if best_result else 'N/A'}")
                    return best_result 
                else:
                    error_message = data.get("error", {}).get("message", "Unknown error")
                    logger.warning(f"AcoustID lookup failed for {file_path}. Status: {data.get('status')}, Error: {error_message}")
                    return None

            except httpx.HTTPStatusError as e:
                logger.error(f"AcoustID API request failed: {e.response.status_code} - {e.response.text}")
                raise AcoustIDError(f"AcoustID API error: {e.response.status_code}")
            except httpx.RequestError as e:
                logger.error(f"AcoustID API request error: {e}")
                raise AcoustIDError(f"AcoustID network error: {e}")
            except Exception as e:
                logger.error(f"An unexpected error occurred during AcoustID lookup: {e}")
                raise AcoustIDError(f"An unexpected AcoustID lookup error: {e}")

# Example Usage (for testing)
async def main():
    # Replace with a path to an actual audio file for testing
    test_file_path = "path/to/your/audiofile.mp3"  
    if not os.path.exists(test_file_path):
        print(f"Test file not found: {test_file_path}. Skipping example usage.")
        return

    client = AcoustIDClient()
    try:
        # Lookup basic info + recording IDs and release groups
        result = await client.lookup_fingerprint(
            test_file_path, 
            metadata=['recordings', 'releasegroups', 'compress']
        )
        if result:
            print("\nAcoustID Lookup Result:")
            print(json.dumps(result, indent=2))
        else:
            print("\nNo result found or lookup failed.")
    except AcoustIDError as e:
        print(f"\nError during AcoustID lookup: {e}")
    except ValueError as e:
         print(f"\nConfiguration Error: {e}")


if __name__ == "__main__":
    # Check if ACOUSTID_APP_API_KEY is set
    if not ACOUSTID_CLIENT_API_KEY:
         print("Warning: ACOUSTID_APP_API_KEY environment variable not set. Using default key.")
         print("Please set the environment variable for production use.")
    # asyncio.run(main()) # Commented out to prevent accidental execution
    pass 