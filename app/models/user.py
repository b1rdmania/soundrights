"""
User model for authentication and profile management.
"""
from sqlalchemy import Column, String, Boolean, Enum, Text
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base
from app.models.base import AuditMixin


class UserRole(str, enum.Enum):
    """User roles in the system."""
    ADMIN = "admin"
    RIGHTS_HOLDER = "rights_holder"
    LICENSEE = "licensee"
    BOTH = "both"  # Can be both rights holder and licensee


class UserStatus(str, enum.Enum):
    """User account status."""
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DEACTIVATED = "deactivated"


class User(Base, AuditMixin):
    """User model for authentication and profile management."""
    
    __tablename__ = "users"
    
    # Authentication fields
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile fields
    full_name = Column(String(255), nullable=True)
    display_name = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Role and permissions
    role = Column(
        Enum(UserRole),
        default=UserRole.LICENSEE,
        nullable=False,
        index=True
    )
    is_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    status = Column(
        Enum(UserStatus),
        default=UserStatus.PENDING,
        nullable=False,
        index=True
    )
    
    # Company/Organization info (for B2B)
    company_name = Column(String(255), nullable=True)
    company_role = Column(String(100), nullable=True)
    company_website = Column(String(500), nullable=True)
    tax_id = Column(String(100), nullable=True)
    
    # Web3 fields
    wallet_address = Column(String(42), unique=True, nullable=True, index=True)
    is_wallet_verified = Column(Boolean, default=False, nullable=False)
    
    # Contact preferences
    email_notifications = Column(Boolean, default=True, nullable=False)
    marketing_emails = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    tracks = relationship("Track", back_populates="user", lazy="dynamic")
    licenses_purchased = relationship("License", foreign_keys="License.licensee_id", back_populates="licensee", lazy="dynamic")
    licenses_sold = relationship("License", foreign_keys="License.rights_holder_id", back_populates="rights_holder", lazy="dynamic")
    api_keys = relationship("APIKey", back_populates="user", lazy="dynamic")
    
    def __repr__(self):
        return f"<User {self.username}>"
    
    @property
    def is_rights_holder(self):
        """Check if user can upload tracks."""
        return self.role in [UserRole.RIGHTS_HOLDER, UserRole.BOTH, UserRole.ADMIN]
    
    @property
    def is_licensee(self):
        """Check if user can purchase licenses."""
        return self.role in [UserRole.LICENSEE, UserRole.BOTH, UserRole.ADMIN] 