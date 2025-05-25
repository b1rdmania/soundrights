# SoundRights

**Decentralized Sound IP Registration & Verification on Story Protocol**

SoundRights is a web3-native platform for registering, licensing, and verifying sound assets on-chain. Built for the Surreal World Assets bounty, it enables:

- **On-Chain Registration:** Upload audio, generate AI-powered metadata, and register as an IP Asset on Story Protocol.
- **Programmable Licensing:** Attach clear, machine-readable licenses (PILs) to your sound IP.
- **Transparent Verification:** Anyone can upload a file to verify its license status via audio fingerprinting and on-chain queries.

**Tech Stack:** FastAPI (Python), React (TypeScript), Story Protocol SDK, Google Gemini (AI), AcoustID/Chromaprint (fingerprinting), PostgreSQL/SQLite, Docker.

**Current GitHub Remote:**  
`origin  https://github.com/b1rdmania/soundrights.git (fetch)`  
`origin  https://github.com/b1rdmania/soundrights.git (push)`

---

## Audio Fingerprinting: How It Works

When a user uploads an audio file:
1. The backend saves the file temporarily.
2. The `fpcalc` tool (from Chromaprint) is run on the file to extract a unique audio fingerprint and duration.
3. This fingerprint is used to:
    - Register the asset (mapping fingerprint to on-chain ipAssetId).
    - Verify uploaded files by matching their fingerprint against registered assets.
4. The backend can also query the AcoustID API for additional metadata if needed.

**Key file:**  
`app/services/audio_identification/acoustid_service.py`  
- Runs `fpcalc` via subprocess/asyncio.
- Handles errors, parses JSON output, and returns fingerprint data.

---

## Getting Started Locally

### 1. Clone the repository

```sh
git clone https://github.com/b1rdmania/soundrights.git
cd soundrights
```

### 2. Backend Setup

- Create a Python virtual environment:
  ```sh
  python -m venv .venv
  source .venv/bin/activate
  ```
- Install dependencies:
  ```sh
  pip install -r requirements.txt
  ```
- Copy `.env.example` to `.env` and add your API keys (e.g., for Gemini, AcoustID).
- Run the backend server:
  ```sh
  uvicorn app.main:app --reload --port 8000
  ```

### 3. Frontend Setup

- Install frontend dependencies:
  ```sh
  npm install
  ```
- Create a `.env.local` file and set:
  ```
  VITE_API_URL=http://localhost:8000/api/v1
  ```
- Run the frontend development server:
  ```sh
  npm run dev
  ```

The frontend should be accessible at `http://localhost:5173`.

---

## Project Roadmap

- [x] On-chain registration of sound assets (Story Protocol Testnet)
- [x] AI-powered metadata generation (Google Gemini)
- [x] Audio fingerprinting (Chromaprint/AcoustID)
- [x] Programmable license selection (PILs)
- [x] License verification via upload and on-chain query
- [ ] $IP token payment integration (future)
- [ ] Batch registration, DAW integrations (future)

---

## Contributing

Pull requests and issues are welcome! If you're interested in collaborating, please reach out.

---

## License

MIT

---

## Acknowledgements

- [Story Protocol](https://storyprotocol.xyz/)
- [Google Gemini](https://ai.google/)
- [AcoustID / Chromaprint](https://acoustid.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
