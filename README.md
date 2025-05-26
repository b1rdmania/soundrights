# SoundRights

**Secure, Transparent B2B Music Licensing, Powered by Story Protocol & AI**

SoundRights is a web3-native platform designed to revolutionize how music IP is registered, managed, licensed, and verified for B2B use cases. Built for the demands of professional content creators, filmmakers, advertising agencies, and game developers, SoundRights leverages Story Protocol for on-chain IP asset management, AI for intelligent metadata enrichment, robust audio fingerprinting for identification and verification, and seamless partner integrations for onboarding, originality, and analytics.

Our mission is to provide a seamless, efficient, and trustworthy ecosystem for music rights holders to monetize their work and for professional licensees to acquire authentic, clearly-defined music licenses with confidence.

---

## 🟩 Week 1 Progress Checklist

- [x] **Project setup (Git, Docker, CI/CD basics)**
- [x] **requirements.txt with all dependencies**
- [x] **Docker Compose for Postgres, Redis, pgAdmin**
- [x] **Automated setup script (`setup_dev.sh`)**
- [x] **.env file generation with all required variables**
- [x] **Core config (`app/core/config.py`)**
- [x] **Database layer (`app/core/database.py`)**
- [x] **All core models (`User`, `Track`, `License`, `APIKey`, mixins)**
- [x] **Security utils (password hashing, JWT, auth helpers)**
- [x] **API layer: Auth endpoints (`register`, `login`, `refresh`, etc.)**
- [x] **API router structure**
- [x] **Main app (`app/main.py`) with CORS, Sentry, logging, health check**
- [x] **Alembic config and env for migrations**
- [x] **Docs: Roadmap, whitepaper, README**
- [ ] **Initial Alembic migration generated and applied**
- [ ] **Tested local dev environment end-to-end**
- [ ] **Static `.env.example` file (optional, since `.env` is auto-generated)**

---

## 🚀 Week 2 & Beyond: Next Steps

- [ ] **Finalize Yakoa Integration:**
    - [ ] Verify and refine Pydantic models for Yakoa API with actual responses.
    - [ ] Implement public URL generation for media (e.g., S3 upload).
    - [ ] Integrate Yakoa `register_token` into the audio upload workflow.
    - [ ] Add DB fields for Yakoa `token_id`/status & create migration.
    - [ ] Write integration tests for the complete Yakoa flow.
- [ ] **Implement Core Story Protocol Functionality:**
    - [ ] Service for registering IP Assets on Story Protocol.
    - [ ] Service for attaching licenses (PILs) to IP Assets.
    - [ ] API endpoints for these Story Protocol interactions.
- [ ] **Integrate Tomo for User Onboarding:**
    - [ ] Plan and implement Tomo SDK/API for social login & wallet management.
- [ ] **Frontend Development (Initial Phase):**
    - [ ] UI for user registration/login (with Tomo).
    - [ ] UI for audio upload and metadata input.
    - [ ] UI for displaying track information (including Yakoa/Story Protocol status).
- [ ] **Database & Backend Polish:**
    - [ ] Expand database models and create Alembic migrations for new features.
    - [ ] Refine existing CRUD endpoints with full business logic.
- [ ] **Testing & CI/CD:**
    - [ ] Continuously expand test coverage for all new features.

---

## 🧐 The Problem We Solve

The traditional B2B music licensing landscape is often characterized by:
*   **Opacity:** Complex rights chains and unclear ownership.
*   **Inefficiency:** Lengthy negotiations and manual paperwork.
*   **Verification Headaches:** Difficult to prove or check the true license of a sound file.
*   **Onboarding Friction:** Web3 wallet setup and onboarding is a barrier for many users.
*   **Lack of Transparency:** No easy way to see onchain license status or asset history.

SoundRights addresses these challenges by offering a modern, transparent, and automated solution built on a foundation of verifiable on-chain records and intelligent tooling.

## 🚀 Key Features

- **On-Chain IP Registration:** Register audio assets as Story Protocol IP, with AI-enriched metadata.
- **Programmable Licensing:** Attach clear, machine-readable licenses (PILs) to your sound IP.
- **Audio Fingerprinting:** Chromaprint/AcoustID for robust audio identification and verification.
- **AI Metadata:** Google Gemini and open music DBs for rich, accurate metadata.
- **License Verification:** Anyone can upload a file to verify its license status via fingerprinting and onchain queries.
- **Admin Dashboard:** Monitor system health, job queues, and user activity.
- **API-First:** Modern REST API for B2B integrations.
- **Partner Integrations:**
    - **Tomo:** Social login & wallet onboarding for seamless user experience.
    - **Yakoa:** Audio originality/authentication API for all uploads.
    - **Zapper:** Onchain analytics API for license/IP asset transparency & analytics.

## 🤝 Partner Integrations

| Partner | What It Adds | How We Use It |
|---------|--------------|--------------|
| **Tomo** | Social login & wallet aggregation | User onboarding, wallet management |
| **Yakoa** | Audio originality/authentication API | Verifies originality of uploaded audio |
| **Zapper** | Onchain analytics API | License/IP asset transparency & analytics |

## 🛠️ Tech Stack
- **Backend:** FastAPI (Python), PostgreSQL, Redis, Celery
- **Frontend:** React (TypeScript), Vite, Tailwind
- **Blockchain:** Story Protocol (Testnet)
- **Audio:** Chromaprint, pyacoustid, Mutagen
- **AI/Metadata:** Google Gemini, MusicBrainz
- **Integrations:** Tomo, Yakoa, Zapper

## 📈 Roadmap (V1)
- User authentication (Tomo integration)
- Audio upload, AI metadata, and Yakoa originality check
- Story Protocol registration and licensing
- License purchase, NFT issuance, and Zapper analytics
- Admin dashboard and operational monitoring

## 📄 Docs
- [Technical Whitepaper](./SoundRights_Technical_Whitepaper_V1.md)
- [Development Roadmap](./SoundRights_Development_Roadmap_V1.md)
- [Product Document](./SoundRights_Product_Document_V1.md)
- [Site Plan](./SoundRights_Site_Plan_V1.md)

## 🏆 Hackathon Tracks & Bounties
- **IP Detection & Enforcement** (primary)
- **AI Agents** (secondary)
- **Data & Search** (secondary)
- **Partner Bounties:** Tomo, Yakoa, Zapper

## 📝 License
MIT

---

*For inquiries, please contact the project maintainers.*

## Music Recognition

SoundRights now uses the [AudD Music Recognition API](https://docs.audd.io/) for audio identification. This replaces the previous chromaprint/pyacoustid-based approach.

> **Note:** The AudD service is implemented in `app/services/audio_identification/audd_service.py` but is **not yet wired into the main API endpoints**. API integration is a pending task.

### Setup
- Sign up at [AudD Dashboard](https://audd.io/) to obtain your API token.
- Add your token to your environment (e.g., in `.env`):
  ```env
  AUDD_API_TOKEN=your_audd_api_token_here
  ```

### Usage
- The service is implemented in `app/services/audio_identification/audd_service.py`.
- Example usage:
  ```python
  from app.services.audio_identification.audd_service import AudDService
  result = AudDService.recognize_by_file('/path/to/audio.mp3', return_metadata='apple_music,spotify')
  print(result)
  ```

- You can also recognize by URL:
  ```python
  result = AudDService.recognize_by_url('https://example.com/audio.mp3')
  ```

## Requirements
- chromaprint has been removed from requirements.txt. AudD API is now used for music recognition.

## Development & Testing Practices

- **Automated Testing:** All API endpoints and core services must have automated, detailed tests.
- **Ongoing Debugging:** Continuous debugging and test coverage are required as features evolve.
- **Policy:** No new endpoint or service should be merged without corresponding tests.

## Project Status & Next Steps

<!-- Add high-level status and immediate next steps here -->

## Development
