# SoundRights - Refined Development Roadmap (V1)

**Objective:** Launch a B2B-focused MVP for sound IP registration and licensing on Story Protocol within 8-12 weeks with a lean development team. This roadmap prioritizes core functionality for Rights Holders (RH) and Licensees (L), emphasizing Web3 abstraction and operational stability.

---

**🧱 Key Features (V1 Overall)**

1.  **User Authentication & Accounts:** (RH & L: Email/Pass, Profile)
2.  **RH Workflow: IP Registration:**
    *   Audio Upload (WAV, MP3).
    *   AI-Assisted Metadata Generation (review/edit by RH).
    *   Define Licensing Terms (PIL: price, basic usage).
    *   Backend: Audio Fingerprinting (Chromaprint).
    *   Backend: Story Protocol IP Asset Registration.
3.  **RH Dashboard:** View registered tracks, status, licenses sold (summary), earnings (summary).
4.  **Licensee Workflow: Music Discovery (Core V1):**
    *   Browse Music Catalog.
    *   Search by keywords (title, artist, genre, mood).
    *   Filter by genre, mood.
    *   Preview tracks (watermarked/low-fi stream).
    *   View Track Detail Page (public info, license options).
5.  **Licensee Workflow: License Acquisition:**
    *   Select License from Track Detail Page.
    *   Fiat Payment (Stripe Integration).
    *   Receive: Download link (HQ audio), On-chain license (Story Protocol - backend initiated), PDF license receipt.
6.  **Licensee Dashboard:** View purchased licenses, re-download assets, view Story Protocol record link.
7.  **Public License Verification Page:** Verify license authenticity via ID.
8.  **Admin Tools (Enhanced Operational Focus):**
    *   User Management (basic).
    *   Content Management (view tracks, flag content - internal process).
    *   **Operational Dashboard:** Monitoring for fingerprinting job status, Story Protocol queue/failures, upload errors, payment gateway issues.
    *   View logs/details for failed jobs.
    *   Basic Sentry/Grafana integration for visibility.
9.  **Basic Legal Pages:** Terms, Privacy.

---

**🧰 Tech Stack (V1 - Confirmed)**

*   **Frontend:** React (TypeScript), Vite, Tailwind CSS
*   **Backend:** FastAPI (Python 3.10+), Uvicorn/Gunicorn
*   **Database:** PostgreSQL (preferred) or SQLite
*   **Audio Fingerprinting:** Chromaprint (`fpcalc`)
*   **Story Protocol:** SDK (JavaScript/TypeScript via Node.js microservice or Python if suitable bindings mature)
*   **AI Metadata:** Google Gemini API
*   **Payment:** Stripe SDK
*   **Async Tasks:** Celery with Redis/RabbitMQ (for fingerprinting, Story Protocol tx)
*   **File Storage:** S3-compatible (e.g., AWS S3, MinIO)
*   **Monitoring/Alerting (Basic V1):** Sentry (error tracking), Optional: Grafana/Prometheus (metrics), application logging.
*   **Containerization:** Docker, Docker Compose

---

**🗓️ Timeline: 8–12 Weeks (Lean Dev Team - Agile Sprints Recommended)**

**Phase 1: Foundation & Core Backend (Weeks 1-3)**
*   **Week 1: Setup & Core Models**
    *   Project setup (Git, Docker, CI/CD basics).
    *   Define detailed DB schema (users, tracks, licenses, etc.).
    *   Basic FastAPI setup, auth endpoints (register, login).
    *   User model and basic profile management APIs.
    *   Initial Story Protocol SDK exploration & setup (wallet management strategy).
*   **Week 2: RH - Audio Upload & Fingerprinting**
    *   API for audio upload and storage (S3).
    *   Integrate Chromaprint for fingerprint generation (asynchronous task via Celery).
    *   API for RH to input basic track metadata.
    *   DB storage for track info and fingerprints.
*   **Week 3: RH - Story Protocol IP Registration & AI Metadata**
    *   Backend logic for IP Asset registration on Story Protocol (async task).
    *   Integrate AI Metadata service (Gemini) to suggest metadata from audio/RH input.
    *   API for RH to define basic PIL terms (price, store in DB).
    *   Link PIL terms to the Story Protocol IP Asset registration.

**Phase 2: Frontend Skeletons & Licensee Core (Weeks 4-6)**
*   **Week 4: Basic Frontend & RH Dashboard Shell**
    *   Basic React app structure, routing.
    *   Login/Registration UI, connect to backend.
    *   RH Dashboard skeleton: UI for uploading tracks, viewing track list (mock data or basic API).
    *   Implement RH track upload UI, metadata input, PIL definition UI.
*   **Week 5: Licensee - Music Discovery & Catalog View**
    *   Backend: API endpoints for public track catalog (search, filter by genre/mood).
    *   Frontend: UI for browsing music catalog (grid/list view).
    *   Frontend: Implement search and filter functionality.
    *   Frontend: Track detail page UI (displaying info from API).
    *   Frontend: Audio preview streaming for tracks.
*   **Week 6: Licensee - Payment & License Acquisition**
    *   Integrate Stripe for fiat payments (Frontend Elements, Backend processing).
    *   Backend logic to handle successful payment:
        *   Record license in DB.
        *   Trigger Story Protocol license registration/transfer (async task).
        *   Generate PDF license receipt.
        *   Secure download link for HQ audio.
    *   Frontend UI for checkout flow.

**Phase 3: Dashboards, Admin & Polish (Weeks 7-10)**
*   **Week 7: Licensee Dashboard & Public Verification**
    *   Frontend: Licensee Dashboard UI - view purchased licenses, download links, PDF receipts.
    *   Link to Story Protocol explorer for on-chain license view.
    *   Backend & Frontend: Public License Verification page.
*   **Week 8: RH Dashboard - Full Functionality**
    *   Frontend: Complete RH Dashboard - view track status, licenses sold (summary), earnings (summary).
    *   Connect all RH dashboard components to backend APIs.
*   **Week 9: Admin - Operational Dashboard & Basic Tools**
    *   Backend: API endpoints to expose operational metrics (fingerprinting queue/errors, Story Protocol tx queue/errors, upload errors, payment issues).
    *   Frontend: Secure Admin Dashboard UI.
    *   Display key operational metrics. Basic drill-down to error lists/logs.
    *   Basic Sentry integration for frontend/backend error tracking.
    *   Admin UI for basic user management (view list, roles).
    *   Admin UI to view all tracks and flag content (internal flag).
*   **Week 10: Testing, Refinement & Admin Enhancements**
    *   Focus on end-to-end testing of all user flows (RH, Licensee, Admin).
    *   UI/UX polish based on internal feedback.
    *   Refine Admin dashboard based on testing (e.g., ensure necessary info is visible for troubleshooting).
    *   Implement basic job monitoring views for admins (e.g., list fingerprinting jobs and their status).
    *   Basic Grafana dashboards (if time permits and deemed critical for V1 visibility).

**Phase 4: Launch Prep & Contingency (Weeks 11-12)**
*   **Week 11: Final Testing, Documentation & Legal Pages**
    *   Comprehensive testing: functional, performance (basic), security (basic checks).
    *   Bug fixing.
    *   Developer documentation (API docs, setup guide).
    *   User-facing FAQ content.
    *   Implement static pages for Terms of Service, Privacy Policy.
*   **Week 12: Deployment, Monitoring Setup & Contingency**
    *   Prepare production deployment environment (Dockerized).
    *   Final deployment to production.
    *   Ensure logging and monitoring (Sentry, basic server monitoring) are active.
    *   Contingency for bug fixes and immediate post-launch issues.
    *   Basic BDR procedure documentation/testing.

---

**Key Milestones:**

*   **End of Week 3:** Core backend for RH track registration (including fingerprinting, AI meta, Story IP reg) is functional.
*   **End of Week 6:** Licensee can discover, pay for (fiat), and receive a license and audio file. Core Story Protocol license link established.
*   **End of Week 8:** RH & Licensee dashboards are largely functional.
*   **End of Week 10:** Admin operational dashboard is providing key insights. Major bugs addressed.
*   **End of Week 12:** Platform deployed to production (V1 MVP Launch).

---

**Assumptions & Risks:**

*   **Lean Dev Team:** Assumes 2-3 experienced full-stack developers.
*   **Story Protocol SDK Stability:** Relies on the stability and usability of the chosen Story Protocol SDK. If Python bindings are not mature, a Node.js microservice adds complexity.
*   **Third-Party API Stability:** Gemini, Stripe, etc.
*   **Scope Creep:** V1 features are intentionally limited. Must resist adding non-essential features.
*   **Web3 Abstraction Complexity:** Ensuring seamless UX for fiat users interacting with on-chain elements requires careful backend design.
*   **Learning Curve:** Team familiarity with Story Protocol.

Regular sprint reviews, clear communication, and adaptability will be key to navigating this timeline. 