import requests
import structlog
from app.core.config import settings

logger = structlog.get_logger(__name__)

class YakoaError(Exception):
    """Custom exception for Yakoa service errors."""
    def __init__(self, message, status_code=None, details=None):
        super().__init__(message)
        self.status_code = status_code
        self.details = details

class YakoaService:
    def __init__(self):
        self.base_url = f"https://{settings.YAKOA_API_SUBDOMAIN}.ip-api.yakoa.io/{settings.YAKOA_NETWORK}"
        self.headers = {
            "accept": "application/json",
            "content-type": "application/json",
        }
        if settings.YAKOA_API_KEY:
            self.headers["Authorization"] = f"Bearer {settings.YAKOA_API_KEY}"
        else:
            logger.warning("YAKOA_API_KEY is not set. YakoaService will make unauthenticated calls.")

    def register_token(self, token_data: dict):
        """
        Registers a new Token or registers new metadata for an existing Token with Yakoa.
        """
        log = logger.bind(token_id=token_data.get("id"))
        log.info("Attempting to register token with Yakoa")
        try:
            response = requests.post(
                f"{self.base_url}/token",
                json=token_data,
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)
            log.info("Token registered successfully with Yakoa")
            return response.json()
        except requests.exceptions.HTTPError as e:
            log.error(
                "HTTPError calling Yakoa API for token registration", 
                status_code=e.response.status_code, 
                response_text=e.response.text,
                exc_info=True
            )
            raise YakoaError(
                message=f"Yakoa API HTTP error: {e.response.status_code}",
                status_code=e.response.status_code,
                details=e.response.text
            ) from e
        except requests.exceptions.RequestException as e:
            log.error("RequestException calling Yakoa API for token registration", exc_info=True)
            raise YakoaError(message=f"Yakoa API request failed: {str(e)}") from e

# Example usage (for testing purposes, remove later)
if __name__ == "__main__":
    # This part would require settings to be loaded,
    # which is typically handled by the FastAPI app startup.
    # For direct script execution, you might need to load .env manually
    # or ensure your environment variables are set.
    
    # Mock settings for standalone execution if needed
    class MockSettings:
        YAKOA_API_KEY = "your_test_api_key"
        YAKOA_API_SUBDOMAIN = "docs-demo"
        YAKOA_NETWORK = "story-mainnet"

    #settings = MockSettings() # Uncomment and adjust if running standalone

    service = YakoaService()
    
    # Example token data structure based on Yakoa docs
    # Replace with actual data relevant to your application
    sample_token_data = {
        "id": "0xYourContractAddress:YourTokenId",  # Required: Token identifier (e.g., contract_address:token_id)
        "creator_id": "your_creator_platform_id_or_wallet_address",  # Required: Creator's identifier
        "media": [  # Required: Media items associated with the Token
            {
                "media_id": "generated_unique_media_id_for_item_1",  # Required within media object
                "url": "https://your_public_storage.com/path/to/audio.mp3",  # Required within media object: Must be a public URL
                # "hash": "sha256_hash_of_audio_if_url_can_change", # Required if URL can change (e.g. not IPFS)
                # "trust_reason": "e.g., verified_on_soundrights_platform" # Optional
            }
            # You can add more media items here if the token has multiple (e.g., cover art, video)
        ],
        "registration_tx": {  # Required: Transaction details
            # The exact structure of this object needs to be confirmed with Yakoa's full documentation.
            # Based on common patterns and Story Protocol context:
            "chain": settings.YAKOA_NETWORK, # e.g., "story-mainnet", "story-aeneid"
            "contract_address": "0xYourContractAddress", # Address of the IP Asset on Story Protocol
            "token_id": "YourTokenId", # Token ID of the IP Asset on Story Protocol
            "transaction_hash": "0xActualStoryProtocolRegistrationTxHash", # TX hash of the Story Protocol registration
            "block_number": 1234567, # Block number of the registration transaction
            # "timestamp": "ISO_8601_timestamp_of_registration" # Potentially useful
        },
        "metadata": {  # Required: Token metadata
            "title": "My Awesome SoundRights Track",
            "artist": "DJ Creative Commons",
            "description": "An original track uploaded via SoundRights.",
            "genre": "Electronic",
            "duration_ms": 180000, # Example: 3 minutes
            # Any other relevant metadata SoundRights collects
        },
        "license_parents": [ # Optional: Parent license information
            # {
            #     "parent_token_id": "0xParentContractAddress:ParentTokenId",
            #     "license_terms_uri": "ipfs://your_license_terms_cid_or_url"
            # }
        ],
        "authorizations": [ # Optional: Direct brand authorizations for this token
            # {
            #     "brand_id": "yakoa_brand_identifier",
            #     "authorization_details_uri": "ipfs://your_auth_details_cid_or_url"
            # }
        ]
    }
    
    # print("Attempting to register token with Yakoa...")
    # result = service.register_token(sample_token_data)
    # if result:
    #     print("Yakoa API call successful:")
    #     print(result)
    # else:
    #     print("Yakoa API call failed.") 