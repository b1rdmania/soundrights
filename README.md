# SoundMatch AI - Find Similar Copyright-Free Music

**Hackathon Project - Seeking Partners!**

This project is being developed for a hackathon and we are actively looking for enthusiastic partners to join the team! If you're interested in AI, music technology, web development (React/FastAPI), or data services like MusicBrainz and Jamendo, please reach out!

## Project Goal

SoundMatch AI aims to be an intelligent platform that helps content creators, developers, and music enthusiasts discover copyright-free music similar to a provided track or audio file.

Users can:
- **Search by song/artist:** Enter a known song, and the app will find similar royalty-free alternatives.
- **Upload an MP3:** Analyze an existing audio file to find similar royalty-free tracks.
- **Paste a link:** Analyze a music link (e.g., Spotify, YouTube - *future feature*) to find similar royalty-free tracks.

The core idea is to leverage metadata analysis (using MusicBrainz) and similarity searching (using Jamendo) to provide relevant and usable music recommendations.

## Technology Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Python, FastAPI
- **Metadata:** MusicBrainz API
- **Royalty-Free Music Search:** Jamendo API
- **Deployment:** Vercel (Frontend), Railway (Backend)

## Development Progress So Far

We have made significant progress in building the core infrastructure and functionality:

- **Backend API (FastAPI on Railway):**
    - Set up FastAPI application structure.
    - Implemented API endpoints for:
        - `/search`: Takes a query, uses Spotify's basic search for initial info, queries MusicBrainz for detailed metadata, and then finds similar tracks on Jamendo.
        - `/process-file`: Accepts an MP3 upload, analyzes it using MusicBrainz, and finds similar tracks on Jamendo.
        - `/process-link`: Accepts a music URL, analyzes it using MusicBrainz, and finds similar tracks on Jamendo.
    - Integrated MusicBrainz client for metadata fetching and analysis.
    - Integrated Jamendo client for searching copyright-free music.
    - Configured CORS to allow requests from the frontend.
    - Set up environment variables for API keys and configuration.
    - Added basic logging and error handling.
    - Created Docker configurations (`docker-compose.yml`, `Dockerfile`) for local development and production (though primarily deploying via Railway).
- **Frontend (React on Vercel):**
    - Set up React application using Vite and TypeScript.
    - Created main pages: Index, Upload, Results, About, etc.
    - Implemented routing using `react-router-dom`.
    - Developed the `UploadForm` component allowing users to search, upload files, or paste links.
    - Created the `Results` page to display track information and similar results.
    - Integrated API client (`axios`) to communicate with the backend.
    - Configured UI components using `shadcn-ui` and styled with Tailwind CSS.
    - Set up deployment pipeline to Vercel.
    - Added error boundaries and loading states for better UX.
- **Deployment:**
    - Frontend successfully deployed to Vercel.
    - Backend successfully deployed to Railway.
    - Configured Vercel and Railway environment variables.
- **Troubleshooting:**
    - Resolved CORS issues between frontend and backend.
    - Debugged MIME type issues with Vercel static asset serving.
    - Iteratively fixed backend API errors (500 errors) related to API integrations (Spotify, MusicBrainz) and error handling logic.

## Next Steps / Areas for Collaboration

- **Refine Search Accuracy:** Improve the logic for matching and finding *truly* similar tracks.
- **Enhance UI/UX:** Make the results page more interactive and visually appealing. Add audio playback for Jamendo previews.
- **Improve Error Handling:** Make error messages more user-friendly on the frontend. Add more robust backend logging.
- **Link Processing:** Fully implement and test the `/process-link` functionality (needs robust URL parsing and service detection for various platforms like Spotify, YouTube, etc.).
- **Audio Fingerprinting:** Integrate **Shazam API** or similar services for identifying tracks directly from audio snippets.
- **Advanced Similarity Search:** Implement **FAISS** or other vector databases for more sophisticated similarity searches based on extracted audio features or embeddings.
- **Expand Music Sources:** Integrate with additional **open music royalty-free libraries** beyond Jamendo (e.g., Free Music Archive, Pixabay Music).
- **Full Spotify Integration:** Explore deeper integration with the **Spotify API** (requiring authentication) for richer data or user-specific features.
- **Other API Integrations:** Open to exploring other relevant music data or analysis APIs.
- **Testing:** Add unit and integration tests for both frontend and backend.
- **Scalability & Performance:** Optimize backend API calls and database interactions (if a DB is added later).
- **Feature Expansion:** Consider adding features like user accounts, saved searches, or filtering options for Jamendo results.

## Getting Started Locally

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_GIT_URL>
    cd soundmatch-audio-finder
    ```
2.  **Set up Backend:**
    - Navigate to the backend directory (if structure dictates, otherwise root).
    - Create a Python virtual environment: `python -m venv .venv`
    - Activate the virtual environment: `source .venv/bin/activate` (or `.\venv\Scripts\activate` on Windows)
    - Install backend dependencies: `pip install -r requirements.txt`
    - Create a `.env` file based on `.env.example` and add your API keys (Jamendo, potentially others).
    - Run the backend server: `uvicorn app.main:app --reload --port 8000`
3.  **Set up Frontend:**
    - Navigate to the frontend directory (if structure dictates, otherwise root).
    - Install frontend dependencies: `npm install`
    - Create a `.env.local` file and add `VITE_API_URL=http://localhost:8000/api/v1` (or your backend URL).
    - Run the frontend development server: `npm run dev`

The frontend should be accessible at `http://localhost:5173` (or another port specified by Vite).

**Join Us!**

If you're excited about this project and want to contribute during the hackathon, please reach out!
