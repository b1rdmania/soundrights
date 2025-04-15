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
    YOUTUBE_API_KEY: Optional[str] = os.getenv("YOUTUBE_API_KEY")
    PIXABAY_API_KEY: Optional[str] = os.getenv("PIXABAY_API_KEY")
    JAMENDO_API_KEY: Optional[str] = os.getenv("JAMENDO_API_KEY")
    ZYLA_SHAZAM_API_KEY: Optional[str] = os.getenv("ZYLA_SHAZAM_API_KEY")
    GOOGLE_GEMINI_API_KEY: Optional[str] = os.getenv("GOOGLE_GEMINI_API_KEY")
    MUSIXMATCH_API_KEY: Optional[str] = os.getenv("MUSIXMATCH_API_KEY")
    
    # Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "/tmp/soundmatch/uploads")
    
    # File upload limits
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_AUDIO_TYPES: set = {"audio/mpeg", "audio/mp3", "audio/wav"}
    
    class Config:
        case_sensitive = True

# Create global settings object
settings = Settings() 