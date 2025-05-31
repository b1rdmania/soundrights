"""
Track model for audio assets.
"""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base
from app.models.base import AuditMixin


class TrackStatus(str, enum.Enum):
    """Track processing status."""
    PENDING = "pending"
    PROCESSING = "processing"
    FINGERPRINTING = "fingerprinting"
    REGISTERING = "registering"
    ACTIVE = "active"
    FAILED = "failed"
    ARCHIVED = "archived"


class Track(Base, AuditMixin):
    """Track model for audio assets."""
    
    __tablename__ = "tracks"
    
    # Basic metadata
    title = Column(String(255), nullable=False, index=True)
    artist_name = Column(String(255), nullable=False, index=True)
    album_name = Column(String(255), nullable=True)
    genre = Column(String(100), nullable=True, index=True)
    release_year = Column(Integer, nullable=True)
    duration_seconds = Column(Float, nullable=True)
    
    # AI-generated metadata
    ai_description = Column(Text, nullable=True)
    ai_tags = Column(JSON, nullable=True)  # List of tags
    ai_mood = Column(String(100), nullable=True)
    ai_instruments = Column(JSON, nullable=True)  # List of instruments
    ai_tempo_bpm = Column(Integer, nullable=True)
    ai_key = Column(String(20), nullable=True)
    
    # User-provided metadata
    description = Column(Text, nullable=True)
    tags = Column(JSON, nullable=True)  # User's tags
    lyrics = Column(Text, nullable=True)
    isrc = Column(String(20), nullable=True, unique=True)  # International Standard Recording Code
    
    # File information
    file_url = Column(String(500), nullable=False)
    file_hash = Column(String(64), nullable=False, unique=True)  # SHA256 hash
    file_size_bytes = Column(Integer, nullable=False)
    file_format = Column(String(10), nullable=False)
    sample_rate = Column(Integer, nullable=True)
    bitrate = Column(Integer, nullable=True)
    
    # Audio fingerprint
    chromaprint_fingerprint = Column(Text, nullable=True)
    chromaprint_duration = Column(Float, nullable=True)
    acoustid_track_id = Column(String(100), nullable=True)
    
    # Story Protocol fields
    story_ip_asset_id = Column(String(100), nullable=True, unique=True, index=True)
    story_transaction_hash = Column(String(66), nullable=True)
    story_metadata_uri = Column(String(500), nullable=True)
    story_registration_timestamp = Column(Integer, nullable=True)

    # Yakoa integration fields
    yakoa_token_id = Column(String(100), nullable=True, unique=True, index=True)
    yakoa_media_id = Column(String(100), nullable=True)
    yakoa_infringement_status = Column(String(50), nullable=True)
    
    # Status and visibility
    status = Column(
        Enum(TrackStatus),
        default=TrackStatus.PENDING,
        nullable=False,
        index=True
    )
    is_public = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    
    # Statistics
    play_count = Column(Integer, default=0, nullable=False)
    license_count = Column(Integer, default=0, nullable=False)
    
    # Relationships
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    user = relationship("User", back_populates="tracks")
    
    license_terms = relationship("LicenseTerm", back_populates="track", lazy="dynamic")
    licenses = relationship("License", back_populates="track", lazy="dynamic")
    
    def __repr__(self):
        return f"<Track {self.title} by {self.artist_name}>" 