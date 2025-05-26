"""
Application configuration using pydantic-settings.
Handles environment variables and application settings.
"""
from typing import Optional, List, HttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, PostgresDsn, validator
import secrets


class Settings(BaseSettings):
    """Main application settings."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )
    
    # Application
    PROJECT_NAME: str = "SoundRights"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    # Database
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str
    DATABASE_URL: Optional[PostgresDsn] = None
    
    @validator("DATABASE_URL", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: dict) -> str:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            username=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_HOST"),
            port=int(values.get("POSTGRES_PORT", 5432)),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Story Protocol
    STORY_PROTOCOL_RPC_URL: str = "https://testnet.storyrpc.io"
    STORY_PROTOCOL_CHAIN_ID: int = 1513
    STORY_PROTOCOL_PRIVATE_KEY: Optional[str] = None
    STORY_PROTOCOL_IP_ASSET_REGISTRY: Optional[str] = None
    STORY_PROTOCOL_LICENSING_MODULE: Optional[str] = None
    
    # AI Services
    GOOGLE_AI_API_KEY: Optional[str] = None
    ZYLA_SHAZAM_API_KEY: Optional[str] = None
    
    # Audio Storage
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET_NAME: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    
    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None
    
    # Sentry
    SENTRY_DSN: HttpUrl | None = None
    
    # Audio Processing
    AUDIO_CHUNK_SIZE: int = 4096
    MAX_FILE_SIZE_MB: int = 25  # Maximum file size for uploads in MB
    MAX_AUDIO_LENGTH_SECONDS: int = 300  # Maximum audio length in seconds
    
    # Database pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    AUDD_API_TOKEN: str | None = None

    YAKOA_API_KEY: str | None = None
    YAKOA_API_SUBDOMAIN: str = "docs-demo"
    YAKOA_NETWORK: str = "story-mainnet"

    # API Keys for external services (ensure these are in your .env)
    # ZYLA_SHAZAM_API_KEY: str | None = None # Retained for now, though Shazam was removed


settings = Settings() 