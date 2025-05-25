# SoundRights - Site Plan (V1)

This document outlines the key pages, sections, and user flows for the SoundRights V1 platform.

## I. Public-Facing Pages (No Authentication Required)

1.  **Homepage (`/`)**
    *   **Purpose:** Introduce SoundRights, its value proposition (secure sound IP registration & licensing on Story Protocol), and direct users to key actions.
    *   **Key Elements:**
        *   Hero section with a clear headline and CTA (e.g., "Register Your Sound IP" or "License Music").
        *   Brief explanation of "How it Works" (for Rights Holders and Licensees).
        *   Benefits of using SoundRights (security, transparency, Story Protocol integration).
        *   Featured tracks or collections (if applicable and curated).
        *   CTAs to Sign Up/Log In, Browse Music Catalog, or Learn More.
        *   Footer: Links to About, FAQ, Contact, Terms of Service, Privacy Policy.

2.  **Browse Music Catalog (`/music` or `/catalog`)**
    *   **Purpose:** Allow potential licensees to discover, search, filter, and preview music.
    *   **Key Elements:**
        *   Search bar (keywords, title, artist).
        *   Filtering options (genre, mood, tempo, license type - if applicable in V1).
        *   Sort options (newest, popular, etc.).
        *   Grid/list view of tracks, each showing:
            *   Track title, artist name.
            *   Cover art/thumbnail.
            *   Short description/tags.
            *   Preview button (plays watermarked/low-fi audio).
            *   Indication of license availability/price (or link to view details).
        *   Pagination.

3.  **Track Detail Page (`/music/{trackId}`)**
    *   **Purpose:** Provide detailed information about a specific track and options to license.
    *   **Key Elements (Public View):**
        *   Track title, artist name, uploader/label.
        *   Larger cover art.
        *   Full description.
        *   Audio preview (watermarked/low-fi).
        *   Available license types and their key terms/prices (clearly displayed).
        *   Link to Story Protocol IP Asset (if desired for public view).
        *   CTA to "License this Track" (leads to login/signup if not authenticated, then to purchase flow).
        *   Information about the Rights Holder (brief profile link if available).

4.  **About Us (`/about`)**
    *   **Purpose:** Explain the mission and vision of SoundRights.
    *   **Key Elements:** Company story, team (optional), technology overview (Story Protocol, AI).

5.  **FAQ (`/faq`)**
    *   **Purpose:** Answer common questions for both Rights Holders and Licensees.
    *   **Key Elements:** Categorized questions about registration, licensing, fees, Story Protocol, security, etc.

6.  **Contact Us (`/contact`)**
    *   **Purpose:** Provide a way for users to get in touch.
    *   **Key Elements:** Contact form or email address.

7.  **Terms of Service (`/terms`)**
    *   **Purpose:** Legal terms governing the use of the platform.

8.  **Privacy Policy (`/privacy`)**
    *   **Purpose:** How user data is collected, used, and protected.

9.  **Public License Verification Page (`/verify-license` or `/licenses/verify/{licenseId}`)**
    *   **Purpose:** Allow anyone to input a SoundRights License ID or Story Protocol License ID to verify its authenticity and basic terms.
    *   **Key Elements:**
        *   Input field for License ID.
        *   Display of verification status (Valid/Invalid/Not Found).
        *   If valid, display key (non-sensitive) license details: Track Title, Artist, Licensee Identifier (anonymized/hashed), basic terms summary, purchase date.

## II. Authenticated User Pages (Rights Holder - RH)

1.  **RH Dashboard (`/dashboard/rh`)**
    *   **Purpose:** Main landing page for Rights Holders after login.
    *   **Key Elements:**
        *   Overview/summary: Total registered tracks, total licenses sold, recent earnings.
        *   Quick actions: "Upload New Track," "View My Tracks."
        *   Recent activity feed (new licenses, etc.).
        *   Navigation to other RH sections.

2.  **Upload & Register New Track (`/dashboard/rh/upload`)**
    *   **Purpose:** Multi-step form for uploading audio and providing metadata for IP registration.
    *   **User Flow:**
        *   Step 1: Upload audio file.
        *   Step 2: AI-assisted metadata generation (title, artist, genre, mood, keywords) - user review & edit.
        *   Step 3: Define licensing terms (select PIL, set price, usage rights).
        *   Step 4: Review and confirm -> Submit for fingerprinting and Story Protocol registration.
    *   **Key Elements:** File dropzone, metadata input fields, licensing options, progress indicator.

3.  **My Tracks (`/dashboard/rh/tracks`)**
    *   **Purpose:** View and manage all registered tracks.
    *   **Key Elements:**
        *   List of tracks with status (Pending, Registered, Active, Flagged).
        *   For each track: Title, Artist, Date Registered, Licenses Sold.
        *   Actions: Edit metadata (if allowed post-registration), View on Story Protocol, View Licenses Sold.

4.  **Licenses Sold (`/dashboard/rh/licenses-sold` or `dashboard/rh/tracks/{trackId}/licenses`)**
    *   **Purpose:** View details of licenses sold for their tracks.
    *   **Key Elements:** List of licenses: Licensee (anonymized ID), Track, License Type, Date, Earnings.

5.  **Earnings/Payouts (`/dashboard/rh/earnings`)**
    *   **Purpose:** View earnings summary and manage payout settings.
    *   **Key Elements:** Total earnings, available for payout, transaction history, payout method setup.

6.  **RH Account Settings (`/dashboard/rh/settings`)**
    *   **Purpose:** Manage profile, notification preferences, API keys (if applicable V2+).
    *   **Key Elements:** Update email, password, public profile info.

## III. Authenticated User Pages (Licensee - L)

1.  **Licensee Dashboard (`/dashboard/l`)**
    *   **Purpose:** Main landing page for Licensees after login.
    *   **Key Elements:**
        *   Overview/summary: Total licenses purchased, recently licensed tracks.
        *   Quick actions: "Browse Music Catalog," "View My Licenses."
        *   Navigation to other Licensee sections.

2.  **License Purchase Flow (Modal or separate page accessed from Track Detail Page)**
    *   **Purpose:** Enable a user to select a license type and complete payment.
    *   **Key Elements:**
        *   Confirm track and selected license type.
        *   Price display.
        *   Payment gateway integration (Stripe/equivalent for fiat).
        *   Confirmation of purchase.
        *   (Behind the scenes: Story Protocol license registration is triggered).

3.  **My Licenses (`/dashboard/l/licenses`)**
    *   **Purpose:** View and manage all purchased licenses.
    *   **Key Elements:**
        *   List of licenses: Track Title, Artist, License Type, Purchase Date.
        *   Actions: Download Audio File (high-quality), Download PDF License Receipt, View on Story Protocol, Verify License.

4.  **Licensee Account Settings (`/dashboard/l/settings`)**
    *   **Purpose:** Manage profile, notification preferences.
    *   **Key Elements:** Update email, password.

## IV. Admin Pages (Internal - `/admin`)

1.  **Admin Dashboard (`/admin/dashboard`) - Operational Focus**
    *   **Purpose:** Overview of system health and key operational metrics.
    *   **Key Elements:**
        *   Upload success/error rates & details.
        *   Fingerprinting job queue, processing times, failure rates.
        *   Story Protocol transaction submission queue, confirmation times, failure rates (with errors).
        *   Payment gateway transaction successes/failures.
        *   User registration numbers, active users.

2.  **User Management (`/admin/users`)**
    *   **Purpose:** View and manage users (activate, deactivate, roles).

3.  **Content Management / Moderation (`/admin/tracks`)**
    *   **Purpose:** View all registered tracks, flag content, manage disputes (basic V1).
    *   **Key Elements:** Search/filter tracks, view track details, view associated Story IP.

4.  **Job Monitoring (`/admin/jobs`)**
    *   **Purpose:** Detailed view of background job queues.
    *   **Key Elements:**
        *   Fingerprinting jobs (status, logs).
        *   Story Protocol transaction jobs (status, logs, retry mechanisms).

5.  **System Settings (`/admin/settings`)**
    *   **Purpose:** Configure platform-wide settings (e.g., fee percentages, API keys for integrations).

6.  **Error Logs & Reporting (`/admin/logs` or integration with Sentry/Grafana)**
    *   **Purpose:** Access detailed error logs for troubleshooting.

## V. User Flows (High-Level)

1.  **Rights Holder - Track Registration:**
    *   Signup/Login -> Dashboard -> Upload New Track -> Provide Metadata -> Define License -> Submit -> Track Fingerprinted & Registered on Story Protocol -> Appears in Catalog.

2.  **Licensee - Music Licensing:**
    *   Browse Catalog/Search -> View Track Detail -> Select License -> Signup/Login (if needed) -> Pay -> Receive Download, PDF Receipt, On-Chain License -> View in Licensee Dashboard.

3.  **Public - License Verification:**
    *   Access Verification Page -> Enter ID -> View Status & Details.

4.  **Admin - Monitoring & Issue Resolution:**
    *   Login -> Admin Dashboard -> Identify issue (e.g., failed Story Protocol tx) -> Investigate via Job Monitoring/Logs -> Take corrective action (e.g., retry tx, contact user).

This site plan provides a foundational structure. Details within each page will be further refined during UI/UX design and development. 