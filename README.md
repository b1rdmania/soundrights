# SoundRights

**Secure, Transparent B2B Music Licensing, Powered by Story Protocol & AI**

SoundRights is a web3-native platform designed to revolutionize how music IP is registered, managed, licensed, and verified for B2B use cases. Built for the demands of professional content creators, filmmakers, advertising agencies, and game developers, SoundRights leverages Story Protocol for on-chain IP asset management, AI for intelligent metadata enrichment, and robust audio fingerprinting for identification and verification.

Our mission is to provide a seamless, efficient, and trustworthy ecosystem for music rights holders to monetize their work and for professional licensees to acquire authentic, clearly-defined music licenses with confidence.

---

## 🧐 The Problem We Solve

The traditional B2B music licensing landscape is often characterized by:
*   **Opacity:** Complex rights chains and unclear ownership.
*   **Inefficiency:** Lengthy negotiations and manual processes.
*   **Fragmentation:** Difficulty in discovering suitable music and verifying license authenticity.
*   **Risk:** Fear of copyright infringement due to ambiguous terms or fraudulent claims.

SoundRights addresses these challenges by offering a modern, transparent, and automated solution built on a foundation of verifiable on-chain records and intelligent tooling.

## ✨ Key Features (V1 Focus)

*   **Web3-Powered IP Registration:**
    *   Rights Holders can upload audio and seamlessly register it as an IP Asset on Story Protocol.
    *   AI-assisted metadata generation (genre, mood, keywords) for richer, more discoverable listings.
*   **Programmable IP Licensing (PILs):**
    *   Define clear, machine-readable licensing terms directly on-chain.
    *   Simplified license templates for common B2B use cases (sync, commercial, etc.).
*   **B2B Music Catalog & Discovery:**
    *   A curated catalog for professional licensees to search, filter, and preview tracks.
    *   Detailed track pages with transparent licensing options and pricing.
*   **Fiat On-Ramp & Seamless Licensing:**
    *   Licensees can purchase licenses using standard fiat payments (e.g., credit card via Stripe).
    *   Web3 complexities are abstracted; the platform handles on-chain license transactions.
*   **Verifiable Licenses:**
    *   Licensees receive a downloadable high-quality audio file, a PDF license receipt, and an on-chain record of their license via Story Protocol.
    *   Public verification tool to confirm license authenticity and key terms.
*   **Audio Fingerprinting:**
    *   Chromaprint/AcoustID technology for unique audio identification, aiding in verification and future V2+ features like duplicate detection.
*   **Operational Admin Dashboard:**
    *   Internal tools for platform monitoring, user management, and ensuring the health of critical processes (fingerprinting, Story Protocol transactions).

## 🛠️ Technology Stack

*   **Frontend:** React (TypeScript), Vite, Tailwind CSS
*   **Backend:** FastAPI (Python 3.10+), Uvicorn/Gunicorn
*   **Database:** PostgreSQL
*   **Audio Fingerprinting:** Chromaprint (`fpcalc`)
*   **On-Chain IP Management:** Story Protocol SDK
*   **AI Metadata:** Google Gemini API (or similar LLMs)
*   **Payments:** Stripe SDK
*   **Async Task Processing:** Celery with Redis/RabbitMQ
*   **File Storage:** S3-compatible object storage (e.g., AWS S3, MinIO)
*   **Monitoring & Alerting:** Sentry, Grafana (optional), ELK Stack/CloudWatch
*   **Containerization:** Docker, Docker Compose

## 🏗️ Architecture Overview

SoundRights employs a modular, service-oriented architecture:

1.  **Frontend (React):** Provides the user interface for Rights Holders, Licensees, and Admins.
2.  **Backend API (FastAPI):** Handles business logic, user management, and orchestrates interactions with other services.
3.  **Core Services:**
    *   **Database (PostgreSQL):** Stores all platform data.
    *   **Audio Fingerprinting Service:** Generates and matches audio fingerprints.
    *   **Story Protocol Service:** Interacts with the Story Protocol blockchain for IP registration and licensing.
    *   **AI Metadata Service:** Enriches track information.
    *   **Payment Service:** Integrates with Stripe for fiat transactions.
    *   **File Storage Service:** Manages audio file uploads.
4.  **Async Workers (Celery):** Manages background tasks like fingerprinting and on-chain transactions to ensure a responsive user experience.

*(A more detailed visual architecture can be conceptualized using the Mermaid diagram outline provided in project discussions.)*

## 🚀 Getting Started (High-Level for V1 Development)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/b1rdmania/soundrights.git
    cd soundrights
    ```
2.  **Set up Environment Variables:**
    *   Copy `.env.example` to `.env` (and potentially `.env.production` for prod-like settings).
    *   Fill in necessary API keys and configuration details (Stripe, Story Protocol RPC, Gemini, Database credentials, S3, etc.).
3.  **Build & Run with Docker Compose (Recommended for V1):**
    ```bash
    docker-compose up --build
    ```
    This will build the necessary images and start the frontend, backend, database, and other services as defined in `docker-compose.yml`.
4.  **Access the application:**
    *   Frontend: `http://localhost:5173` (or as configured)
    *   Backend API: `http://localhost:8000` (or as configured)

*(Detailed setup instructions for local development without Docker, and specific service configurations, will be maintained in developer documentation.)*

## 📄 Project Planning Documents

The planning and design for SoundRights V1 are captured in the following documents within this repository:

*   [**SoundRights Site Plan (V1)**](./SoundRights_Site_Plan_V1.md): Outlines the key pages, user flows, and site structure.
*   [**SoundRights Technical Whitepaper (V1)**](./SoundRights_Technical_Whitepaper_V1.md): Details the technical architecture, components, and considerations.
*   [**SoundRights Product Document (V1)**](./SoundRights_Product_Document_V1.md): Defines the target users, V1 features, user stories, and non-functional requirements.
*   [**SoundRights Development Roadmap (V1)**](./SoundRights_Development_Roadmap_V1.md): Lays out the development timeline, key milestones, and tech stack for V1.

## 🗺️ Project Roadmap Summary (V1)

Our V1 roadmap is focused on delivering a robust B2B music licensing MVP within an 8-12 week timeframe. Key phases include:

1.  **Foundation & Core Backend:** Setup, core models, audio upload, fingerprinting, Story Protocol IP registration, AI metadata.
2.  **Frontend Skeletons & Licensee Core:** Basic UI, RH dashboard shell, music discovery (search/filter/preview), payment integration, license acquisition.
3.  **Dashboards, Admin & Polish:** Full RH & Licensee dashboards, public license verification, operational admin dashboard.
4.  **Launch Prep & Contingency:** Testing, documentation, deployment.

Refer to the [**Development Roadmap**](./SoundRights_Development_Roadmap_V1.md) for detailed weekly breakdowns.

## 🤝 Contributing

We welcome contributions to SoundRights! As we are in the early stages, please consider the following:

1.  Review the [**Project Planning Documents**](#-project-planning-documents) to understand the V1 scope and architecture.
2.  For bugs or feature requests, please open an issue first to discuss what you would like to change.
3.  For pull requests, please ensure your code aligns with the existing tech stack and coding style (linters and formatters will be enforced).
4.  Ensure your PR includes relevant tests.

*(More detailed contribution guidelines will be added as the project matures.)*

## ⚖️ License

This project is currently under active development. A formal open-source license (e.g., MIT or Apache 2.0) will be finalized and added here prior to any public release or broader community engagement.

---

*For inquiries, please contact the project maintainers.*
