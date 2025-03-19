# SoundMatch AI - Backend Architecture

## 1. Core Service Structure

```
backend/
├── app/
│   ├── api/                    # FastAPI routes
│   │   ├── v1/                # API version 1
│   │   │   ├── endpoints/     # Route handlers
│   │   │   │   ├── upload.py
│   │   │   │   ├── spotify.py
│   │   │   │   ├── youtube.py
│   │   │   │   └── results.py
│   │   │   └── router.py      # API router configuration
│   ├── core/                  # Core application code
│   │   ├── config.py         # Configuration management
│   │   ├── security.py       # Security utilities
│   │   └── exceptions.py     # Custom exceptions
│   ├── services/             # Business logic
│   │   ├── audio/           # Audio processing services
│   │   │   ├── extractor.py  # Feature extraction
│   │   │   ├── processor.py  # Audio processing
│   │   │   └── matcher.py    # FAISS matching
│   │   ├── spotify/         # Spotify integration
│   │   ├── youtube/         # YouTube integration
│   │   └── metadata/        # Metadata services
│   ├── models/              # Data models
│   │   ├── audio.py
│   │   ├── track.py
│   │   └── response.py
│   └── utils/               # Utility functions
├── tests/                   # Test suite
├── alembic/                 # Database migrations
└── docker/                  # Docker configuration
```

## 2. Database Schema

```sql
-- Tracks table for storing processed audio files
CREATE TABLE tracks (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    artist VARCHAR(255),
    duration INTEGER,
    bpm FLOAT,
    key VARCHAR(10),
    energy FLOAT,
    danceability FLOAT,
    features JSONB,  -- Stored audio features
    source_type VARCHAR(50),  -- 'spotify', 'youtube', 'upload'
    source_url TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Matches table for storing similarity results
CREATE TABLE matches (
    id UUID PRIMARY KEY,
    source_track_id UUID REFERENCES tracks(id),
    matched_track_id UUID REFERENCES tracks(id),
    similarity_score FLOAT,
    created_at TIMESTAMP
);

-- External API cache
CREATE TABLE external_tracks (
    id UUID PRIMARY KEY,
    external_id VARCHAR(255),
    source VARCHAR(50),  -- 'pixabay', 'jamendo'
    metadata JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 3. Implementation Steps

### Phase 1: Foundation Setup
1. Set up FastAPI project structure
2. Configure database with SQLAlchemy
3. Implement basic configuration management
4. Set up logging and error handling
5. Create basic health check endpoint

### Phase 2: Input Processing
1. Implement file upload endpoint
   - Handle MP3 file uploads
   - Validate file types and sizes
   - Store files temporarily

2. Spotify Integration
   - Set up Spotify API client
   - Implement authentication flow
   - Create endpoint for Spotify URL processing
   - Extract track metadata and features

3. YouTube Integration
   - Set up yt-dlp integration
   - Create endpoint for YouTube URL processing
   - Handle audio extraction and conversion

### Phase 3: Audio Processing
1. Feature Extraction Service
   - Implement Librosa integration
   - Create feature extraction pipeline
   - Store extracted features

2. FAISS Integration
   - Set up FAISS index
   - Implement similarity search
   - Create matching service

### Phase 4: External API Integration
1. Pixabay Integration
   - Set up API client
   - Implement track search
   - Cache results

2. Jamendo Integration
   - Set up API client
   - Implement track search
   - Cache results

### Phase 5: Results Processing
1. Results Aggregation
   - Combine matches from different sources
   - Sort and filter results
   - Format response data

2. Caching Layer
   - Implement result caching
   - Set up cache invalidation
   - Handle cache updates

## 4. Technical Dependencies

### Core Dependencies
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- Python-multipart (for file uploads)
- python-jose (for JWT handling)

### Audio Processing
- Librosa
- FAISS
- numpy
- scipy

### External APIs
- spotipy (Spotify API client)
- yt-dlp
- requests
- aiohttp

### Database
- PostgreSQL
- Redis (for caching)

### Testing
- pytest
- pytest-asyncio
- httpx

## 5. Environment Variables

```env
# Application
APP_ENV=development
DEBUG=true
API_V1_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/soundmatch

# Redis
REDIS_URL=redis://localhost:6379/0

# External APIs
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
PIXABAY_API_KEY=your_api_key
JAMENDO_API_KEY=your_api_key

# Storage
UPLOAD_DIR=/tmp/soundmatch/uploads
```

## 6. API Endpoints

### Upload Endpoints
- `POST /api/v1/upload/file` - Upload MP3 file
- `POST /api/v1/upload/spotify` - Process Spotify URL
- `POST /api/v1/upload/youtube` - Process YouTube URL

### Results Endpoints
- `GET /api/v1/results/{track_id}` - Get matches for a track
- `GET /api/v1/results/{track_id}/similar` - Get similar tracks
- `GET /api/v1/results/{track_id}/preview` - Get preview URL

### Health Check
- `GET /api/v1/health` - Health check endpoint

## 7. Error Handling

### Custom Exceptions
- `InvalidFileTypeError`
- `FileTooLargeError`
- `InvalidURLError`
- `ProcessingError`
- `ExternalAPIError`

### Error Response Format
```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "Human readable message",
        "details": {}
    }
}
```

## 8. Logging Strategy

### Log Levels
- ERROR: Application errors
- WARNING: Potential issues
- INFO: General information
- DEBUG: Detailed debugging information

### Log Format
```json
{
    "timestamp": "ISO-8601",
    "level": "LOG_LEVEL",
    "message": "Log message",
    "context": {
        "request_id": "uuid",
        "user_id": "uuid",
        "endpoint": "/api/v1/...",
        "duration_ms": 123
    }
}
``` 