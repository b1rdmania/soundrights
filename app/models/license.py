"""
License models for managing track licensing.
"""
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, ForeignKey, JSON, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.core.database import Base
from app.models.base import AuditMixin


class LicenseType(str, enum.Enum):
    """Types of licenses available."""
    NON_COMMERCIAL = "non_commercial"
    COMMERCIAL_USE = "commercial_use"
    SYNC_LICENSE = "sync_license"
    REMIX_ALLOWED = "remix_allowed"
    CUSTOM = "custom"


class LicenseStatus(str, enum.Enum):
    """License transaction status."""
    PENDING = "pending"
    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"
    TRANSFERRED = "transferred"


class UsageType(str, enum.Enum):
    """Types of usage allowed."""
    STREAMING = "streaming"
    DOWNLOAD = "download"
    SYNC_FILM = "sync_film"
    SYNC_TV = "sync_tv"
    SYNC_ADVERTISING = "sync_advertising"
    SYNC_GAME = "sync_game"
    REMIX = "remix"
    SAMPLE = "sample"
    LIVE_PERFORMANCE = "live_performance"
    BROADCAST = "broadcast"


class LicenseTerm(Base, AuditMixin):
    """License terms that can be attached to tracks."""
    
    __tablename__ = "license_terms"
    
    # Basic info
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    license_type = Column(
        Enum(LicenseType),
        nullable=False,
        index=True
    )
    
    # Pricing
    price_usd = Column(Float, nullable=False)
    currency = Column(String(3), default="USD", nullable=False)
    
    # Terms
    allowed_uses = Column(JSON, nullable=False)  # List of UsageType values
    territory = Column(String(100), default="Worldwide", nullable=False)
    duration_days = Column(Integer, nullable=True)  # None = perpetual
    max_units = Column(Integer, nullable=True)  # Max units for physical media
    max_streams = Column(Integer, nullable=True)  # Max streams
    attribution_required = Column(Boolean, default=True, nullable=False)
    commercial_use = Column(Boolean, default=False, nullable=False)
    derivative_works = Column(Boolean, default=False, nullable=False)
    
    # Story Protocol PIL (Programmable IP License)
    story_pil_type = Column(String(100), nullable=True)
    story_pil_id = Column(String(100), nullable=True)
    story_pil_uri = Column(String(500), nullable=True)
    
    # Custom terms
    custom_terms = Column(JSON, nullable=True)
    
    # Relationships
    track_id = Column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=False, index=True)
    track = relationship("Track", back_populates="license_terms")
    
    licenses = relationship("License", back_populates="terms", lazy="dynamic")
    
    def __repr__(self):
        return f"<LicenseTerm {self.name} - ${self.price_usd}>"


class License(Base, AuditMixin):
    """Individual license purchases/grants."""
    
    __tablename__ = "licenses"
    
    # License identification
    license_number = Column(String(100), unique=True, nullable=False, index=True)
    
    # Parties involved
    rights_holder_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    licensee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # License details
    track_id = Column(UUID(as_uuid=True), ForeignKey("tracks.id"), nullable=False, index=True)
    license_term_id = Column(UUID(as_uuid=True), ForeignKey("license_terms.id"), nullable=False, index=True)
    
    # Transaction details
    price_paid = Column(Float, nullable=False)
    currency = Column(String(3), default="USD", nullable=False)
    payment_method = Column(String(50), nullable=True)
    transaction_id = Column(String(255), nullable=True)
    
    # License period
    start_date = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=True)  # None = perpetual
    
    # Usage tracking
    usage_count = Column(Integer, default=0, nullable=False)
    usage_details = Column(JSON, nullable=True)
    
    # Story Protocol
    story_license_id = Column(String(100), nullable=True, unique=True)
    story_transaction_hash = Column(String(66), nullable=True)
    story_metadata_uri = Column(String(500), nullable=True)
    
    # Status
    status = Column(
        Enum(LicenseStatus),
        default=LicenseStatus.PENDING,
        nullable=False,
        index=True
    )
    
    # Project details (for sync licenses)
    project_name = Column(String(255), nullable=True)
    project_description = Column(Text, nullable=True)
    project_type = Column(String(100), nullable=True)
    
    # Notes
    internal_notes = Column(Text, nullable=True)
    licensee_notes = Column(Text, nullable=True)
    
    # Relationships
    rights_holder = relationship("User", foreign_keys=[rights_holder_id], back_populates="licenses_sold")
    licensee = relationship("User", foreign_keys=[licensee_id], back_populates="licenses_purchased")
    track = relationship("Track", back_populates="licenses")
    terms = relationship("LicenseTerm", back_populates="licenses")
    
    def __repr__(self):
        return f"<License {self.license_number}>"
    
    @property
    def is_active(self):
        """Check if license is currently active."""
        if self.status != LicenseStatus.ACTIVE:
            return False
        if self.end_date and datetime.utcnow() > self.end_date:
            return False
        return True 