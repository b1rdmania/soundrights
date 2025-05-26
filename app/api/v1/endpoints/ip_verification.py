from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any # Add Any and Dict
import structlog

from app.services.ip_verification.yakoa_service import YakoaService, YakoaError
from app.api import deps # Assuming you have a deps.py for dependencies like get_current_user

router = APIRouter()
logger = structlog.get_logger(__name__)

# Specific Pydantic Models for Yakoa Request Structure

class YakoaMediaItem(BaseModel):
    media_id: str # Required
    url: HttpUrl    # Required, and must be publicly accessible
    hash: Optional[str] = None # Required if URL content can change (e.g., not IPFS)
    trust_reason: Optional[str] = None

class YakoaRegistrationTx(BaseModel):
    # Structure needs to be confirmed with full Yakoa docs, this is an educated guess
    chain: str                # e.g., "story-mainnet", "story-aeneid" - Required by Yakoa conceptually
    contract_address: Optional[str] = None # Assuming this might be part of how Yakoa identifies the token on-chain
    token_id: Optional[str] = None         # Assuming this might be part of how Yakoa identifies the token on-chain
    transaction_hash: Optional[str] = None # TX hash of the Story Protocol registration or other relevant tx
    block_number: Optional[int] = None     # Block number of the registration transaction
    # Yakoa docs: "registration_tx (object, required): Transaction details."
    # The API docs screenshot shows it as `object`, so it could be flexible or have specific sub-fields.
    # For now, allowing extra fields to be safe until exact schema is known.
    class Config:
        extra = "allow"

class YakoaMetadata(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    description: Optional[str] = None
    # Add any other relevant metadata fields SoundRights collects or Yakoa supports
    # Yakoa docs: "metadata (object, required): Token metadata."
    # Allowing extra fields to be safe until exact schema is known.
    class Config:
        extra = "allow" 

class YakoaLicenseParent(BaseModel):
    parent_token_id: str # e.g., "0xParentContractAddress:ParentTokenId"
    license_terms_uri: Optional[HttpUrl | str] = None # URI to license terms

class YakoaAuthorizationItem(BaseModel):
    brand_id: str # Yakoa brand identifier
    authorization_details_uri: Optional[HttpUrl | str] = None # URI to authorization details

class YakoaTokenRegistrationRequest(BaseModel):
    id: str  # Required: Token identifier (e.g., contract_address:token_id)
    creator_id: str  # Required: Creator's identifier
    media: List[YakoaMediaItem]  # Required
    registration_tx: YakoaRegistrationTx  # Required
    metadata: YakoaMetadata  # Required
    license_parents: Optional[List[YakoaLicenseParent]] = None
    authorizations: Optional[List[YakoaAuthorizationItem]] = None

# More specific Pydantic Model for Yakoa Response (adapt as actual responses are observed)

class YakoaTokenInfringementInfo(BaseModel):
    # This is highly speculative, based on typical API patterns for infringement checks
    status: Optional[str] = None # e.g., "pending", "completed", "failed"
    has_infringements: Optional[bool] = None
    external_infringements_count: Optional[int] = None
    internal_infringements_count: Optional[int] = None
    details_url: Optional[HttpUrl] = None 
    # Allow other fields
    class Config:
        extra = "allow"

class YakoaTokenRegistrationResponse(BaseModel):
    # Based on generic successful registration patterns and potential Yakoa fields
    yakoa_token_id: Optional[str] = None # The ID Yakoa assigns to the token
    message: Optional[str] = None       # e.g., "Token registered successfully and infringement check initiated"
    infringement_check_status: Optional[str] = None # e.g., "PENDING", "IN_PROGRESS"
    # The actual infringement results might come from a different endpoint or webhook later.
    # The POST /token response might just confirm receipt and initiation.
    # The example response in Yakoa docs for POST /token is not shown.
    # The GET /token endpoint is mentioned to retrieve results.
    raw_response: Dict[str, Any] # Store the full response from Yakoa

@router.post("/yakoa/register-token", response_model=YakoaTokenRegistrationResponse)
async def register_yakoa_token(
    *, 
    token_request: YakoaTokenRegistrationRequest,
    yakoa_service: YakoaService = Depends(YakoaService),
    # current_user: models.User = Depends(deps.get_current_active_user) # Example: if auth is needed
):
    """
    Registers a token with the Yakoa IP API.
    
    Requires detailed information about the token, its creator, media, on-chain registration (if any),
    and descriptive metadata.
    """
    log = logger.bind(token_id=token_request.id, creator_id=token_request.creator_id)
    log.info("Received request to register token with Yakoa")

    try:
        token_data = token_request.model_dump(exclude_none=True)
        yakoa_api_response = yakoa_service.register_token(token_data)
        
        log.info("Successfully called Yakoa service for token registration")
        # Mapping the raw Yakoa API response to our response model.
        # This mapping is an assumption until actual Yakoa responses are tested.
        return YakoaTokenRegistrationResponse(
            yakoa_token_id=yakoa_api_response.get("id") or yakoa_api_response.get("token_id"), # Yakoa might return its own ID for the token
            message=yakoa_api_response.get("message", "Token processing initiated by Yakoa."),
            infringement_check_status=yakoa_api_response.get("infringement_status", "PENDING"), # Or similar field
            raw_response=yakoa_api_response
        )

    except YakoaError as e:
        log.error("YakoaError during token registration endpoint", status_code=e.status_code, details=e.details, exc_info=True)
        # Ensure detail is a string, as Pydantic might receive complex objects from YakoaError.details
        error_detail = str(e.details) if e.details else str(e)
        raise HTTPException(status_code=e.status_code or 500, detail=error_detail)
    except Exception as e:
        log.error("Unexpected error during Yakoa token registration endpoint", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}") 