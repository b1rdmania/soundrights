"""
API Key model for B2B integrations.
"""
from sqlalchemy import Column, String, Boolean, DateTime, JSON, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import secrets

from app.core.database import Base
from app.models.base import AuditMixin


class APIKey(Base, AuditMixin):
    """API Key model for B2B integrations."""
    
    __tablename__ = "api_keys"
    
    # Key details
    name = Column(String(100), nullable=False)
    key_prefix = Column(String(10), nullable=False, index=True)  # First 10 chars for identification
    key_hash = Column(String(255), nullable=False, unique=True)  # Hashed API key
    
    # Permissions and limits
    scopes = Column(JSON, nullable=False, default=list)  # List of allowed scopes
    rate_limit_per_hour = Column(Integer, default=1000, nullable=False)
    rate_limit_per_day = Column(Integer, default=10000, nullable=False)
    
    # Usage tracking
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    usage_count = Column(Integer, default=0, nullable=False)
    
    # Validity
    is_active = Column(Boolean, default=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    # IP restrictions
    allowed_ips = Column(JSON, nullable=True)  # List of allowed IP addresses
    
    # Relationships
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    user = relationship("User", back_populates="api_keys")
    
    def __repr__(self):
        return f"<APIKey {self.name} - {self.key_prefix}...>"
    
    @staticmethod
    def generate_api_key():
        """Generate a new API key."""
        return f"sk_{secrets.token_urlsafe(32)}"
    
    @property
    def is_valid(self):
        """Check if API key is valid."""
        if not self.is_active:
            return False
        if self.expires_at and datetime.utcnow() > self.expires_at:
            return False
        return True 