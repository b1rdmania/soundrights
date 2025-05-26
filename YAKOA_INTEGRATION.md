# Yakoa IP API Integration Plan for SoundRights

This document outlines the plan for integrating Yakoa's IP (Intellectual Property) API into the SoundRights platform.

## 1. Overview of Yakoa

Yakoa provides a digital rights protection layer, leveraging its "Creative Codex" (an AI model of the internet's creative landscape) to authenticate content, detect IP infringements, and manage digital rights. Their services are particularly relevant for AI-native content and include brand protection and platform protection.

Key services relevant to SoundRights:
-   **Content Authentication:** Verifying the originality of content.
-   **Infringement Detection:** Checking content against known public IP ("Brands") and other content within Yakoa's network.
-   **IP Management:** Tools for managing assets, takedowns, and potentially facilitating licensing.

## 2. Relevance to SoundRights

Integrating Yakoa can enhance SoundRights by:
-   **Pre-Registration Checks:** Scanning user-uploaded audio for potential IP infringements *before* registering it as an IP Asset on Story Protocol. This adds a layer of due diligence.
-   **Originality Verification:** Ensuring that audio submitted to SoundRights is original or properly licensed.
-   **Post-Registration Monitoring (Potentially):** Leveraging Yakoa to monitor how SoundRights-managed IP (Story Protocol IP Assets) is being used or misused across the web.
-   **Retroactive Licensing:** If Yakoa detects unauthorized use of a sound asset that *should* be licensed, SoundRights could be positioned as the platform to obtain such a license.

## 3. Key Yakoa API Concepts

Based on their API documentation (around `https://docs.yakoa.io/reference/`):

-   **Brand:** Represents an external IP owner (company, organization, individual). Tokens are checked against these for `external_infringements`.
-   **Creator:** An entity (e.g., identified by blockchain address or platform user ID) responsible for producing Tokens. Tracks provenance.
-   **Token:** The primary entity for IP analysis. It's a tokenized media asset (supports **audio**) with provenance metadata (e.g., NFTs, content credentials). Media URLs for Tokens **must be publicly accessible**.
-   **Authorization:** A formal record that a Brand has permitted a Creator or a specific Token to use its IP. Helps distinguish legitimate use from infringement.
-   **License:** A formal agreement allowing a Token to use IP from another "parent" Token (for legitimate derivative works).
-   **Trust:** Allows a Token's media to be marked as trusted (e.g., from a trusted platform), potentially bypassing some checks.

## 4. Core API Endpoints & Integration Points

### 4.1. Registering Content with Yakoa (`POST /token`)

This is the primary interaction for SoundRights. When a user uploads audio to SoundRights and intends to register it:

-   **Action:** SoundRights will make a `POST` request to Yakoa's `/token` endpoint.
-   **Request Data Mapping:**
    -   `id`: SoundRights can generate a unique internal ID or use a preliminary identifier related to the upcoming Story Protocol IP Asset.
    -   `creator_id`: The SoundRights user's ID or their wallet address.
    -   `media`: An array containing information about the audio file.
        -   `url`: A **publicly accessible URL** where Yakoa can fetch the audio file (e.g., from SoundRights' S3 bucket or IPFS).
        -   `hash`: (Optional, but recommended) Hash of the audio file.
        -   `type`: (Likely) "audio".
    -   `registration_tx`:
        -   This can be populated with details of the Story Protocol IP Asset registration transaction once available. If Yakoa check is done *before* Story registration, this might be partially filled or updated later.
        -   Supported `chain` values include Story Protocol chains (e.g., `story-mainnet`, `story-aeneid`).
    -   `metadata`: Relevant metadata from SoundRights (e.g., title, artist if provided by user).
-   **Response Handling:**
    -   The response will confirm token registration and include an `infringements` object (`PendingTokenInfringements`, `FailedTokenInfringements`, `SucceededTokenInfringements`).
    -   SoundRights will store the Yakoa `token_id` and `media_id` for future reference.
    -   The infringement status will be crucial:
        -   If major infringements are detected, SoundRights might flag the content, notify the user, or prevent/delay Story Protocol registration until resolved.

### 4.2. Managing Token Media (Hypothetical - details were placeholders)

-   `GET /token/{token_id}/media/{media_id}`
-   `PATCH /token/{token_id}/media/{media_id}`
-   **Use Case:** Potentially for updating media URLs if they change, or re-triggering fetches if Yakoa initially failed.

### 4.3. Managing Token Authorizations (Hypothetical - details were placeholders)

-   `GET /token/{token_id}/authorization/{brand_id}`
-   `POST /token/{token_id}/authorization/{brand_id}`
-   `DELETE /token/{token_id}/authorization/{brand_id}`
-   **Use Case:** If SoundRights facilitates a license for a track (Token A) to be used by another creator (Creator B) in a new work (Token B), and Token A's IP is owned by a Yakoa-recognized Brand, an authorization might be registered here. This is a more advanced scenario.

## 5. Authentication

-   The exact mechanism needs to be confirmed by exploring the main Yakoa platform and its "Docs" or by contacting them.
-   It is typically an API key (bearer token) passed in the HTTP request headers.
-   SoundRights will need to securely store and manage its Yakoa API key.

## 6. Supported Chains

Yakoa's API documentation explicitly mentions support for Story Protocol chains, including:
-   `story-mainnet`
-   `story-aeneid`
-   `story-illiad`
-   `story-odyssey`

This direct support is highly beneficial.

## 7. Prerequisites & Setup for SoundRights

1.  **Yakoa Account & API Key:** Sign up for a Yakoa account and obtain an API key for their IP API.
2.  **Publicly Accessible Audio URLs:** Ensure that audio files uploaded to SoundRights are stored in a location (e.g., S3, IPFS) that provides stable, publicly accessible HTTP(S) URLs for Yakoa's ingestion.
3.  **Environment Configuration:** Store the Yakoa API key securely in SoundRights' environment configuration.
4.  **Service Module:** Develop a new service module in SoundRights (`app/services/ip_verification/yakoa_service.py` or similar) to encapsulate all interactions with the Yakoa API.
5.  **Database Model Updates (Potentially):**
    -   Consider adding fields to the `Track` model (or a related model) to store the Yakoa `token_id`, `media_id`, and the latest infringement check status/report URL from Yakoa.
6.  **Error Handling & Logging:** Implement robust error handling and logging for all API calls to Yakoa.

## 8. Workflow Integration Ideas

### Scenario 1: New Audio Upload & Registration

1.  User uploads audio to SoundRights.
2.  SoundRights stores the audio (making it publicly accessible) and gathers initial metadata.
3.  **Before** initiating Story Protocol IP Asset registration, SoundRights calls Yakoa's `POST /token` endpoint.
4.  SoundRights analyzes the `infringements` part of Yakoa's response:
    *   **No/Minor Infringements:** Proceed with Story Protocol registration. Update the Yakoa token later if more `registration_tx` details are needed.
    *   **Significant Infringements:** Notify the user. Potentially block or hold Story Protocol registration. Provide information from Yakoa to the user.
5.  Store Yakoa token details and infringement status with the SoundRights track record.

### Scenario 2: Ongoing Monitoring (Future)

-   If Yakoa offers webhooks or a way to poll for updated infringement statuses, SoundRights could periodically check for new issues related to its registered tokens.

## 9. Open Questions & Further Investigation

-   Confirm the exact authentication method and obtain API keys.
-   Get detailed schemas for `Token Media` and `Token Authorization` endpoints if needed.
-   Understand rate limits and pricing for the Yakoa API.
-   Clarify if Yakoa provides distinct APIs for "Brand Protection" vs. "Platform Protection" or if the `/token` API serves both.
-   Investigate if Yakoa offers specific SDKs or if direct HTTP requests are the standard.

This document will be updated as more information is gathered during the integration process. 