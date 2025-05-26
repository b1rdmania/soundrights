# SoundRights: Technical Whitepaper (V1)

**Version:** 1.0
**Date:** October 26, 2023 (Updated)

## Abstract

SoundRights is a B2B-focused, web3-native platform designed to streamline the registration, licensing, and verification of sound assets. Leveraging Story Protocol for on-chain IP management, advanced audio fingerprinting for identification, and AI for metadata enrichment, SoundRights aims to provide a transparent, efficient, and secure marketplace for music rights holders and licensees. This document outlines the V1 technical architecture, core components, and key implementation considerations. The primary goal is to address the complexities of music licensing in the B2B space, including sync and commercial use, by providing robust tools for rights holders and a simplified acquisition process for licensees, while abstracting Web3 complexities for mainstream adoption.

## 1. System Architecture Overview

- **Backend:** FastAPI (Python), PostgreSQL, Redis, Celery
- **Frontend:** React (TypeScript), Vite, Tailwind
- **Blockchain:** Story Protocol (Testnet)
- **Audio Processing:** Chromaprint, pyacoustid
- **AI/Metadata:** Google Gemini, Mutagen, MusicBrainz
- **Partner Integrations:** Tomo, Yakoa, Zapper

## 2. Key Integrations (V1)

### 2.1 Tomo (Social Login & Wallet Aggregation)
- **Purpose:** Simplifies onboarding for B2B users and rights holders by enabling social login and seamless wallet creation/aggregation.
- **Integration:**
  - Use Tomo SDK in the React frontend for OAuth/social login flows.
  - On successful login, retrieve wallet address and associate with user profile in backend.
  - Use Tomo's wallet aggregation for multi-wallet management (future-proofing for advanced users).
- **Security:** All wallet operations are non-custodial; private keys are never stored by SoundRights.

### 2.2 Yakoa (Audio Originality & Authentication API)
- **Purpose:** Verifies the originality and authenticity of uploaded audio assets, providing an additional layer of IP protection.
- **Integration:**
  - On audio upload, backend calls Yakoa's REST API with the file hash or audio sample.
  - Store Yakoa's originality/authentication result in the track metadata.
  - Display originality status in the UI and use for admin review/flagging.
- **Security:** API keys are stored securely in backend; results are not exposed to public endpoints.

### 2.3 Zapper (Onchain Analytics & License Transparency)
- **Purpose:** Provides onchain analytics and transparency for IP assets and licenses, enhancing trust for B2B clients.
- **Integration:**
  - Use Zapper's API to fetch onchain data (ownership, license status, transaction history) for registered IP assets.
  - Display analytics in user dashboards and public verification pages.
- **Security:** Only public onchain data is displayed; no sensitive user data is shared with Zapper.

## 3. Core Modules
- User Management (Tomo integration)
- Audio Upload & Metadata (Yakoa integration)
- Licensing & Verification (Story Protocol, Zapper integration)
- Admin/Operational Dashboard

## 4. Security & Privacy
- All partner API keys are stored in environment variables and never exposed to the frontend.
- Wallets are managed non-custodially via Tomo.
- All originality/authentication checks are performed server-side.

## 5. Future/Stretch Integrations
- Crossmint (walletless onboarding, NFT minting)
- Advanced AI agents (Fleek, Holoworld)
- Custom smart contracts (thirdweb)

**See also:** [Development Roadmap](./SoundRights_Development_Roadmap_V1.md), [Product Document](./SoundRights_Product_Document_V1.md), [Site Plan](./SoundRights_Site_Plan_V1.md)

## 1. Introduction & Vision

The current music licensing landscape is fragmented, often opaque, and fraught with inefficiencies. SoundRights envisions a future where sound IP is easily registered, its usage rights are clearly defined and programmable, and licenses can be acquired and verified with minimal friction. By building on Story Protocol, SoundRights provides an immutable, globally accessible ledger for sound IP assets and their associated licenses (PILs - Programmable IP Licenses).

**V1 Focus:** Deliver a Minimum Viable Product (MVP) that validates the core B2B licensing workflow:
*   Secure registration of sound IP by Rights Holders.
*   Clear definition of licensing terms (PILs).
*   Efficient discovery and acquisition of licenses by professional Licensees (e.g., content creators, filmmakers, agencies).
*   Robust verification of license authenticity.
*   Seamless fiat payment on-ramp with abstracted Web3 interactions.
*   Operational dashboard for platform monitoring and admin oversight.

## 2. Core Platform Components

### 2.1. Web Application (Frontend)
*   **Technology:** React (TypeScript), Vite, Tailwind CSS.
*   **Responsibilities:**
    *   User interface for Rights Holders, Licensees, and Admins.
    *   Handles user authentication (e.g., JWT-based).
    *   Communicates with the Backend API for all dynamic data and actions.
    *   Integrates with payment gateways (e.g., Stripe).
    *   Provides a user-friendly interface for searching, filtering, and previewing tracks.
    *   Abstracts Web3 interactions (e.g., Story Protocol transactions initiated via backend).

### 2.2. Backend API (FastAPI)
*   **Technology:** Python 3.10+, FastAPI, PostgreSQL (or SQLite for lean V1).
*   **Responsibilities:**
    *   Exposes RESTful APIs for the frontend.
    *   Manages user accounts, authentication, and authorization.
    *   Handles audio file uploads and storage (e.g., S3-compatible object storage).
    *   Orchestrates audio fingerprinting (Chromaprint/AcoustID).
    *   Manages metadata (AI-generated and user-provided).
    *   Integrates with Story Protocol SDK for IP Asset registration and PIL management.
    *   Manages license transactions and records.
    *   Payment gateway integration (server-side).
    *   Serves data for the admin operational dashboard.
    *   Implements search and filtering logic for the music catalog.

### 2.3. Audio Processing & Fingerprinting Service
*   **Technology:** Chromaprint (via `fpcalc`), AcoustID. Potentially a message queue (e.g., Redis/Celery or RabbitMQ) for asynchronous job processing.
*   **Responsibilities:**
    *   Generates unique audio fingerprints from uploaded tracks.
    *   Stores fingerprints for matching and verification.
    *   (V2+) Potential for duplicate detection during upload.
    *   (V1 Previews) Prepares lower-quality, potentially watermarked audio previews if full watermarking is deferred.

### 2.4. Database
*   **Technology:** PostgreSQL (recommended for V1 for scalability and features like JSONB) or SQLite (for faster initial setup, with migration path).
*   **Responsibilities:**
    *   Stores user data, track metadata, fingerprints, license information, Story Protocol transaction details, and application state.
    *   (Schema details in Product Document).

### 2.5. Story Protocol Integration
*   **Technology:** Story Protocol SDK (JavaScript/TypeScript, potentially via a Node.js microservice or direct Python integration if available/stable).
*   **Responsibilities:**
    *   Registering uploaded sound assets as IP Assets on Story Protocol.
    *   Attaching Programmable IP Licenses (PILs) to these IP Assets, reflecting terms defined by the Rights Holder.
    *   Recording license purchases on-chain.
    *   Querying Story Protocol for IP Asset and license verification.
    *   **Web3 Abstraction:** The backend will manage a pool of wallets or use a custodial wallet solution to pay for gas fees and interact with Story Protocol on behalf of users, especially those paying with fiat.

### 2.6. AI Metadata Generation Service
*   **Technology:** Google Gemini API (or other suitable LLM).
*   **Responsibilities:**
    *   Analyzes uploaded audio (or its characteristics) to suggest metadata: genre, mood, keywords, instrumentation.
    *   Rights Holders review and confirm/edit suggestions.

### 2.7. Payment Gateway Integration
*   **Technology:** Stripe (or similar).
*   **Responsibilities:**
    *   Securely process fiat payments from Licensees.
    *   Handle subscriptions or one-time purchase models.
    *   Trigger backend processes upon successful payment (e.g., license issuance).

### 2.8. Monitoring & Alerting
*   **Technology (Basic V1):** Sentry (for error tracking), Grafana/Prometheus (optional, for metrics dashboarding), application logging (ELK stack or CloudWatch Logs if on AWS).
*   **Responsibilities:**
    *   Track application errors and performance.
    *   Monitor key operational metrics for the admin dashboard.
    *   Alert admins to critical system issues.

## 3. Key Technical Considerations & Challenges (V1)

*   **Scalability:** Design database schema and API endpoints for potential growth. Asynchronous processing for fingerprinting and Story Protocol interactions is crucial.
*   **Security:**
    *   Standard web application security practices (OWASP Top 10).
    *   Secure handling of audio files and user data.
    *   Protection against unauthorized access and common attack vectors.
    *   Admin access controls.
    *   Secure management of Story Protocol wallet keys.
    *   **Audio Previews:** For V1, audio previews for non-licensees will be streamed and may be of reduced quality. Download of full quality, non-watermarked audio is restricted to licensed users.
*   **Story Protocol Interaction & Gas Fees:**
    *   Efficient batching of transactions if possible.
    *   Reliable gas fee estimation and management (potentially via a relayer or internal gas tank).
    *   Robust error handling and retry mechanisms for on-chain transactions.
*   **Audio Fingerprinting Accuracy & Speed:** Optimize fingerprinting process. Consider trade-offs between speed and accuracy for V1.
*   **Operational Monitoring & Alerting (V1 Admin):**
    *   Implement an internal admin dashboard for real-time (or near real-time) visibility into key system states (uploads, fingerprinting, Story Protocol tx, payments).
    *   Integrate basic error tracking (Sentry) and consider metrics visualization (Grafana).
*   **Data Integrity & Backup:** Implement regular database backups and a basic disaster recovery plan.
*   **Web3 Abstraction:** Ensuring a smooth UX for non-Web3 native users is paramount. This includes "gasless" transactions from their perspective and no direct wallet management for basic B2B fiat transactions.
*   **Legal & Compliance:** Platform to operate as a technology facilitator. Users responsible for IP legality. Adherence to data privacy norms.

## 4. Architecture Diagram (High-Level V1)

```
+-------------------+      +---------------------+      +------------------------+
|   Frontend (React)|----->|   Backend API       |<---->|   PostgreSQL DB        |
|  (Web App/Mobile) |      |   (FastAPI, Python) |      +------------------------+
+-------------------+      +----------^----------+
                             |          |
                             |          |  +------------------------+
                             |          +->| Audio Fingerprinting   |
                             |          |  | (Chromaprint/Celery)   |
                             |          |  +------------------------+
                             |          |
                             |          |  +------------------------+
                             |          +->| Story Protocol SDK     |
                             |          |  | (JS/TS or Python Int.) |
                             |          |  +------------------------+
                             |          |
                             |          |  +------------------------+
                             |          +->| AI Metadata Service    |
                             |          |  | (Google Gemini)        |
                             |          |  +------------------------+
                             |          |
                             |          |  +------------------------+
                             |          +->| Payment Gateway        |
                             |             | (Stripe)               |
                             |             +------------------------+
                             |
                             |  +------------------------+
                             +->|   Monitoring/Alerting  |
                                | (Sentry, Grafana Opt.) |
                                +------------------------+
```

## 5. Data Flow Examples

### 5.1. Rights Holder: Track Registration
1.  RH uploads audio file via Frontend.
2.  Frontend sends file to Backend API.
3.  Backend stores raw file (e.g., S3), queues fingerprinting job.
4.  Audio Fingerprinting Service processes, generates fingerprint, stores it in DB.
5.  Backend calls AI Metadata Service; RH reviews/edits metadata.
6.  RH defines licensing terms (PIL) via Frontend.
7.  Backend, using Story Protocol SDK, registers IP Asset and attaches PIL on-chain.
8.  Backend stores Story Protocol transaction details and IP Asset ID in DB.

### 5.2. Licensee: Music License Acquisition
1.  Licensee searches/browses catalog on Frontend.
2.  Frontend fetches track data from Backend API.
3.  Licensee selects track & license type, proceeds to checkout.
4.  Frontend integrates with Payment Gateway for fiat payment.
5.  Payment Gateway confirms payment to Backend.
6.  Backend:
    *   Records the license transaction in DB.
    *   Uses Story Protocol SDK to register the license transfer/instance on-chain (associating Licensee with the PIL).
    *   Generates PDF license receipt.
    *   Provides download link for high-quality audio.
7.  Frontend updates Licensee dashboard with purchased license details.

### 5.3. Public: License Verification
1.  User enters License ID (SoundRights or Story Protocol) on verification page (Frontend).
2.  Frontend calls Backend API.
3.  Backend queries its DB and/or Story Protocol to verify license status and terms.
4.  Backend returns verification result to Frontend for display.

## 6. Suggested Database Schema (Draft - PostgreSQL - Key Tables)

*   **users:** `id, email, password_hash, role (rh, licensee, admin), created_at, updated_at, stripe_customer_id (nullable)`
*   **tracks:** `id, rh_user_id, title, artist_name, description, genre, mood_tags, keywords, fingerprint (bytea or text), audio_file_url, preview_url, cover_art_url, duration, status (pending, active, flagged, archived), created_at, updated_at, ai_metadata_json`
*   **ipa_registrations:** `id, track_id, story_protocol_ipa_id, story_protocol_tx_hash, registration_status (pending, success, failed), error_message, created_at, updated_at`
*   **pil_templates:** `id, rh_user_id, name, description, terms_json (defining usage rights, price, duration, etc.), story_protocol_pil_address (nullable, if pre-registered)`
*   **track_pils:** `id, track_id, pil_template_id, price, currency, is_active`
*   **licenses_sold:** `id, track_pil_id, licensee_user_id, purchase_price, currency, purchase_date, story_protocol_license_tx_hash, license_status (active, expired, revoked), pdf_receipt_url, created_at`
*   **admin_system_status_logs:** `id, component (e.g., fingerprinting, story_tx), status, message, details_json, timestamp`
*   **(Other tables for payment transactions, notifications, etc.)**

## 7. Suggested API Contracts (FastAPI - examples)

*   **Authentication:**
    *   `POST /v1/auth/register`
    *   `POST /v1/auth/login`
    *   `POST /v1/auth/refresh-token`
*   **Rights Holder - Tracks & IP:**
    *   `POST /v1/rh/tracks` (Upload audio, metadata, define PIL)
    *   `GET /v1/rh/tracks` (List user's tracks)
    *   `GET /v1/rh/tracks/{trackId}`
    *   `PUT /v1/rh/tracks/{trackId}` (Edit metadata if allowed)
*   **Licensee - Catalog & Licensing:**
    *   `GET /v1/catalog/tracks` (Search/filter tracks)
    *   `GET /v1/catalog/tracks/{trackId}` (View track details, public PIL info)
    *   `POST /v1/licenses/purchase` (Body: track_pil_id, payment_token)
    *   `GET /v1/l/licenses` (List user's purchased licenses)
    *   `GET /v1/l/licenses/{licenseId}/download`
    *   `GET /v1/l/licenses/{licenseId}/receipt`
*   **Public Verification:**
    *   `GET /v1/licenses/verify/{license_identifier}`
*   **Admin - Operational Monitoring:**
    *   `GET /v1/admin/dashboard/overview`
    *   `GET /v1/admin/jobs/fingerprinting`
    *   `GET /v1/admin/transactions/story-protocol`
    *   `GET /v1/admin/users`
    *   `POST /v1/admin/tracks/{trackId}/flag`
*   **(Webhooks for payment gateway, Story Protocol events if applicable)**

## 8. Out of Scope for V1 (Future Considerations)

*   Advanced duplicate detection based on fingerprinting.
*   Full server-side audio watermarking for public previews (V1 may use simpler methods).
*   Secondary market for licenses (complex, requires careful legal/Story Protocol planning).
*   Decentralized autonomous organizations (DAOs) for IP management.
*   Sophisticated royalty splitting mechanisms directly on Story Protocol (V1 focuses on direct licensing).
*   User-facing dispute resolution system (V1 admin handles flagged content).
*   Mobile applications (V1 is web-focused).

## 9. Conclusion

SoundRights V1 aims to deliver a focused, B2B-centric platform that significantly improves the process of registering, licensing, and verifying sound IP. By thoughtfully integrating Story Protocol, audio fingerprinting, AI, and user-friendly design with robust Web3 abstraction, SoundRights is poised to offer tangible value to music rights holders and professional licensees. The technical architecture prioritizes security, scalability for core functions, and operational manageability from day one.

--- 