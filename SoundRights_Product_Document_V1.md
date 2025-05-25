# SoundRights - Product Document (V1 Focus)

**Version:** 1.1
**Date:** October 26, 2023 (Updated)

## 1. Introduction

SoundRights is a platform for registering, licensing, and verifying sound-based Intellectual Property (IP) using Story Protocol. This document outlines the V1 product, focusing on a B2B model for music rights holders and professional licensees (e.g., filmmakers, ad agencies, content creators). The goal is to create a transparent, efficient, and secure marketplace.

**Guiding Principles for V1:**
*   **B2B Focus:** Solve real-world problems for professional users.
*   **Simplicity & Usability:** Abstract Web3 complexities for mainstream adoption.
*   **Core Value Proposition:** Secure IP registration, clear licensing, reliable verification.
*   **Lean MVP:** Deliver essential features to validate the model and gather feedback.
*   **Operational Excellence:** Build in monitoring and admin tools from the start.

## 2. Target Users & Personas

*   **Rights Holder (RH) - "Indie Label Owner / Music Producer":**
    *   **Needs:** Securely register their catalog, define clear licensing terms, reach a professional audience, track usage, get paid reliably. Wants to avoid complex legal and technical hurdles.
    *   **Pain Points:** Piracy, unclear licensing paths, difficulty reaching licensees, administrative overhead of managing rights.
*   **Licensee (L) - "Video Producer / Marketing Agency Manager":**
    *   **Needs:** Quickly find and license quality music for commercial projects, clear and unambiguous license terms, proof of license, simple payment process.
    *   **Pain Points:** Time-consuming music searches, complex license negotiations, fear of copyright infringement, opaque pricing.
*   **Admin (Internal Platform Operator):**
    *   **Needs:** Monitor platform health, manage users, resolve issues, ensure smooth operation of fingerprinting and Story Protocol interactions.

## 3. V1 Features & User Stories

### 3.1. User Authentication & Account Management
*   **Description:** Secure user registration, login, and basic profile management.
*   **User Stories:**
    *   RH/L: "As a new user, I want to easily sign up for an account using my email and password."
    *   RH/L: "As an existing user, I want to securely log in to my account."
    *   RH/L: "As a user, I want to be able to reset my password if I forget it."
    *   RH/L: "As a user, I want to be able to update my basic profile information (e.g., name, email)."
*   **Acceptance Criteria:** Standard email/password auth, password complexity, secure storage. JWT for session management.
*   **UX/UI Considerations:** Clear forms, intuitive flow. Web3 abstraction: no wallet connection required for basic account creation/login.
*   **Technical Dependencies:** Backend auth module, database schema for users.

### 3.2. Rights Holder: Audio Upload & IP Registration
*   **Description:** Allow Rights Holders to upload audio files, provide metadata (AI-assisted), define licensing terms (PIL), and register their sound as an IP Asset on Story Protocol.
*   **User Stories (RH):**
    *   RH: "As a Rights Holder, I want to upload my audio track (WAV, MP3)."
    *   RH: "As a Rights Holder, I want the system to help me generate relevant metadata (title, artist, genre, mood, keywords) using AI, which I can then review and edit."
    *   RH: "As a Rights Holder, I want to define specific licensing terms for my track by selecting or creating a Programmable IP License (PIL) template (e.g., price, usage rights, duration)."
    *   RH: "As a Rights Holder, after submitting my track and terms, I want it to be fingerprinted and registered as an IP Asset on Story Protocol."
    *   RH: "As a Rights Holder, I want to see the status of my uploaded tracks (e.g., pending, registered, error)."
*   **Acceptance Criteria:**
    *   Audio upload supports common formats.
    *   AI metadata suggestions are relevant and editable.
    *   Clear interface for selecting/defining PIL terms (price, basic usage).
    *   Successful registration results in a Story Protocol IP Asset ID stored.
    *   Fingerprint generated and stored.
    *   User notified of success/failure.
*   **UX/UI Considerations:** Multi-step wizard for upload/registration. Clear progress indicators. Easy editing of AI suggestions. Simple PIL template selection.
*   **Technical Dependencies:** File storage, audio fingerprinting service, AI metadata service, Story Protocol SDK integration, database schema for tracks/IPAs/PILs.

### 3.3. Rights Holder: Dashboard & Track Management
*   **Description:** Provide Rights Holders with a dashboard to view their registered tracks, licenses sold, and earnings.
*   **User Stories (RH):**
    *   RH: "As a Rights Holder, I want a dashboard overview of my activity (total tracks, licenses sold, earnings)."
    *   RH: "As a Rights Holder, I want to view a list of all my registered tracks and their status."
    *   RH: "As a Rights Holder, I want to view details of licenses sold for each of my tracks."
    *   RH: "As a Rights Holder, I want to see my earnings and request payouts (V1 may be manual payout, UI shows balance)."
*   **Acceptance Criteria:** Dashboard displays accurate summaries. Track list is sortable/filterable. License sales data is linked to tracks.
*   **UX/UI Considerations:** Clean, informative dashboard. Easy navigation.
*   **Technical Dependencies:** Database queries, API endpoints for RH data.

### 3.4. Licensee: Music Discovery (Search, Browse, Filter)
*   **Description:** Enable Licensees to find suitable music for their projects through a searchable and filterable catalog.
*   **User Stories (L):**
    *   L: "As a Licensee, I want to browse a catalog of available music."
    *   L: "As a Licensee, I want to search for music using keywords (e.g., track title, artist, genre, mood)."
    *   L: "As a Licensee, I want to filter music by genre, mood, or other relevant tags."
    *   L: "As a Licensee, I want to be able to preview tracks (e.g., listen to a watermarked or lower-quality version) before deciding to license."
    *   L: "As a Licensee, I want to see clear information about a track, including its title, artist, description, and available licensing options/prices, on a dedicated track detail page."
*   **Acceptance Criteria:**
    *   Search functionality returns relevant results.
    *   Filters are applied correctly.
    *   Audio previews are available for all catalog tracks.
    *   Track detail page displays comprehensive information.
*   **UX/UI Considerations:** Intuitive search bar, easy-to-use filters, clear track listings, prominent preview button.
*   **Technical Dependencies:** Backend search/filter logic, API endpoints for catalog, audio streaming for previews.

### 3.5. Licensee: License Purchase & Acquisition
*   **Description:** Allow Licensees to select a license, pay for it (fiat), and receive the licensed content and proof of license.
*   **User Stories (L):**
    *   L: "As a Licensee, after finding a track I like, I want to clearly see the available license types and their prices/terms."
    *   L: "As a Licensee, I want to be able to select a license and proceed to a simple checkout process."
    *   L: "As a Licensee, I want to pay for the license using my credit card (fiat currency)."
    *   L: "As a Licensee, after successful payment, I want to immediately receive a download link for the high-quality audio file."
    *   L: "As a Licensee, I want to receive a formal PDF license receipt for my records."
    *   L: "As a Licensee, I want my purchased license to be recorded on Story Protocol as proof of rights."
*   **Acceptance Criteria:**
    *   Clear display of license options and pricing on track detail page.
    *   Secure payment processing via integrated gateway (e.g., Stripe).
    *   Successful payment triggers license issuance.
    *   High-quality audio download link provided.
    *   PDF license receipt generated and made available.
    *   Story Protocol license transaction initiated by backend.
*   **UX/UI Considerations:** Seamless checkout flow. Clear confirmation messages. Easy access to downloads and receipts. Web3 abstracted: user pays fiat, backend handles on-chain.
*   **Technical Dependencies:** Payment gateway integration, PDF generation library, Story Protocol SDK, secure file delivery.

### 3.6. Licensee: Dashboard & License Management
*   **Description:** Provide Licensees with a dashboard to view their purchased licenses and access related assets.
*   **User Stories (L):**
    *   L: "As a Licensee, I want a dashboard where I can see all the licenses I've purchased."
    *   L: "As a Licensee, for each purchased license, I want to be able to re-download the audio file and the PDF receipt."
    *   L: "As a Licensee, I want to be able to view the on-chain record of my license on Story Protocol (e.g., via a link)."
    *   L: "As a Licensee, I (or someone I'm working with) want to be able to verify the validity of my license via a public link or identifier."
*   **Acceptance Criteria:** Dashboard lists all purchased licenses. Links for download, receipt, and Story Protocol record are functional. Public verification feature available.
*   **UX/UI Considerations:** Clear list of licenses with key details. Easy access to actions.
*   **Technical Dependencies:** Database queries, API endpoints for Licensee data.

### 3.7. Public: License Verification
*   **Description:** A publicly accessible tool to verify the authenticity of a SoundRights license.
*   **User Stories (Public/L/RH):**
    *   User: "As anyone, I want to be able to enter a SoundRights License ID or Story Protocol License ID into a public page and verify if the license is valid and see its basic, non-sensitive terms."
*   **Acceptance Criteria:** Verification page returns correct status (Valid/Invalid/Not Found) and key license details for valid IDs.
*   **UX/UI Considerations:** Simple input field, clear results display.
*   **Technical Dependencies:** API endpoint for verification, querying DB and/or Story Protocol.

### 3.8. Admin Tools (Enhanced for V1)
*   **Description:** Internal tools for platform support, management, and **operational monitoring**.
*   **User Stories (Admin):**
    *   Admin: "As an Admin, I need to view and manage user accounts (e.g., basic CRUD, role changes)."
    *   Admin: "As an Admin, I need to view all registered tracks and their status, and be able to flag content if necessary (basic V1: internal flag, manual review process)."
    *   Admin: "As an Admin, I need an operational dashboard to monitor key system metrics in near real-time, including upload errors, fingerprinting job status (queue, failures), Story Protocol transaction queues, and failed Story Protocol transactions, so I can proactively identify and address issues."
    *   Admin: "As an Admin, I need to view logs or details for failed jobs (fingerprinting, Story Protocol) to help troubleshoot."
    *   Admin: "As an Admin, I need basic tools to manually override or retry certain failed processes if necessary (e.g., resubmit a Story Protocol transaction)."
*   **Acceptance Criteria:**
    *   Admin dashboard displays key operational metrics with ability to drill down into error logs/lists.
    *   User and content management functions are operational.
    *   Monitoring tools provide visibility into critical background processes.
    *   Integration with Sentry (or similar) for automated error reporting. Basic Grafana dashboards (or similar) for visualizing metrics.
*   **UX/UI Considerations:** Secure admin login. Clear, actionable dashboard. Easy access to logs and error details.
*   **Technical Dependencies:** Admin authentication/authorization. API endpoints for admin functions. Metrics collection, Sentry SDK, Grafana setup (optional but recommended). Logging infrastructure.

## 4. V1 Non-Functional Requirements

*   **4.1. Performance:**
    *   Page load times: < 3 seconds for key pages.
    *   API response times: < 500ms for most read operations.
    *   Audio fingerprinting and Story Protocol registration: Asynchronous, user not blocked; status updates provided.
*   **4.2. Scalability (Basic V1):**
    *   Handle an initial load of 100s of concurrent users and 1000s of tracks.
    *   Architecture should allow for future scaling of individual components.
*   **4.3. Security:**
    *   OWASP Top 10 addressed.
    *   Data encryption at rest and in transit.
    *   Secure handling of API keys (Story Protocol, payment gateway).
    *   Role-based access control.
    *   Regular security audits (post-V1).
    *   **Audio Previews:** For V1, audio previews for non-licensees will be streamed and may be of reduced quality. Download of full quality, non-watermarked audio is restricted to licensed users. (Explicit audio watermarking for previews is a V2 consideration).
*   **4.4. Usability:**
    *   Intuitive navigation and user flows.
    *   Clear error messaging and user feedback.
    *   Responsive design for web (desktop-first for B2B V1).
    *   Web3 complexity fully abstracted for Rights Holders and Licensees engaging in standard fiat transactions.
*   **4.5. Reliability/Availability:**
    *   Target uptime: 99.5% for V1.
    *   Robust error handling and retry mechanisms for critical backend processes (fingerprinting, Story Protocol tx).
    *   Basic backup and disaster recovery (BDR) plan for database and critical application data.
*   **4.6. Maintainability:**
    *   Well-structured, documented code.
    *   Modular design.
    *   Use of established frameworks and libraries.

## 5. Success Metrics for V1

*   Number of registered Rights Holders.
*   Number of registered Licensees.
*   Number of tracks successfully registered on SoundRights and Story Protocol.
*   Number of licenses sold.
*   Total transaction value processed.
*   Average time to register a track.
*   Average time to license a track.
*   User satisfaction scores (e.g., via surveys post-V1).
*   Admin dashboard successfully identifies X number of operational issues proactively.
*   System uptime and error rates within NFR targets.

## 6. Out of Scope for V1 (Examples from Roadmap)

*   Advanced AI-driven music recommendation/discovery.
*   Complex royalty splitting or co-ownership models on Story Protocol.
*   Secondary marketplace for licenses.
*   User-to-user messaging or negotiation.
*   Mobile-native applications.
*   Server-side audio watermarking for public preview streams (V1 focuses on lower quality/simpler methods).
*   Formal user-facing dispute resolution system (V1 relies on admin flagging/manual review).
*   Internationalization/Localization beyond English.

## 7. Legal & Compliance Considerations (V1)

*   **Terms of Service & Privacy Policy:** Must be clearly defined and accessible.
*   **Platform Role:** SoundRights acts as a technology facilitator. Rights Holders are responsible for the legality and ownership of the IP they register.
*   **Payment Processing:** Compliance with PCI DSS if handling card data directly (mitigated by using Stripe.js/Elements).
*   **Data Privacy:** Adherence to relevant data privacy regulations (e.g., GDPR, CCPA) for any user data processed.

This document provides the product foundation for SoundRights V1. It will be a living document, updated as the product evolves based on development progress and user feedback. 