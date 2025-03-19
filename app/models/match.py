from sqlalchemy import Column, Float, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Match(BaseModel):
    __tablename__ = "matches"
    
    source_track_id = Column(ForeignKey("tracks.id"), nullable=False)
    matched_track_id = Column(ForeignKey("tracks.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    
    # Relationships
    source_track = relationship("Track", 
                              foreign_keys=[source_track_id],
                              back_populates="source_matches")
    matched_track = relationship("Track",
                               foreign_keys=[matched_track_id],
                               back_populates="matched_tracks") 