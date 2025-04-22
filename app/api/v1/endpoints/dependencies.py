from fastapi import Depends
from app.services.metadata.musixmatch import musixmatch_service
from app.services.metadata.jamendo import jamendo_service
from app.services.ai.gemini_service import gemini_service
from app.services.metadata.musicbrainz import musicbrainz_client
from app.services.metadata.discogs_service import discogs_service
from app.services.metadata.wikipedia_service import wikipedia_service
from app.services.metadata.acoustid import AcoustIDClient

# Simple dependency injections that return service instances
def get_musixmatch_service():
    return musixmatch_service

def get_jamendo_service():
    return jamendo_service

def get_gemini_service():
    return gemini_service

def get_musicbrainz_service():
    return musicbrainz_client

def get_discogs_service():
    return discogs_service

def get_wikipedia_service():
    return wikipedia_service

acoustid_client: AcoustIDClient = Depends(lambda: acoustid_client) 