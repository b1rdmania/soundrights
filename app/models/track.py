from sqlalchemy import Column, String, Integer, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Track(BaseModel):
    __tablename__ = "tracks"
    
    title = Column(String(255), nullable=False)
    artist = Column(String(255))
    duration = Column(Integer)  # Duration in seconds
    bpm = Column(Float)
    key = Column(String(10))
    energy = Column(Float)
    danceability = Column(Float)
    features = Column(JSON)  # Stored audio features
    source_type = Column(String(50))  # 'spotify', 'youtube', 'upload'
    source_url = Column(String)
    
    # Relationships
    source_matches = relationship("Match", 
                                foreign_keys="Match.source_track_id",
                                back_populates="source_track")
    matched_tracks = relationship("Match",
                                foreign_keys="Match.matched_track_id",
                                back_populates="matched_track") 