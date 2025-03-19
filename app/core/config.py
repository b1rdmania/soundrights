from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # Application
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    API_V1_PREFIX: str = os.getenv("API_V1_PREFIX", "/api/v1")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/soundmatch")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # External APIs
    SPOTIFY_CLIENT_ID: Optional[str] = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET: Optional[str] = os.getenv("SPOTIFY_CLIENT_SECRET")
    SPOTIFY_REDIRECT_URI: Optional[str] = os.getenv("SPOTIFY_REDIRECT_URI", "http://localhost:8000/api/v1/spotify/auth/callback")
    YOUTUBE_API_KEY: Optional[str] = os.getenv("YOUTUBE_API_KEY")
    PIXABAY_API_KEY: Optional[str] = os.getenv("PIXABAY_API_KEY")
    JAMENDO_API_KEY: Optional[str] = os.getenv("JAMENDO_API_KEY")
    
    # Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "/tmp/soundmatch/uploads")
    
    # File upload limits
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_AUDIO_TYPES: set = {"audio/mpeg", "audio/mp3", "audio/wav"}
    
    class Config:
        case_sensitive = True

# Create global settings object
settings = Settings()

# Log Spotify credentials (masked for security)
print("Loaded SPOTIFY_CLIENT_ID:", settings.SPOTIFY_CLIENT_ID)
print("Loaded SPOTIFY_CLIENT_SECRET:", "***" + settings.SPOTIFY_CLIENT_SECRET[-4:] if settings.SPOTIFY_CLIENT_SECRET else None)
print("Loaded SPOTIFY_REDIRECT_URI:", settings.SPOTIFY_REDIRECT_URI) 