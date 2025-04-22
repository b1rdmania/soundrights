import logging
from typing import Dict, Optional, Tuple
import mutagen
from mutagen.id3 import ID3, ID3NoHeaderError

logger = logging.getLogger(__name__)

def extract_id3_tags(file_path: str) -> Tuple[Optional[str], Optional[str], Optional[Dict]]:
    """
    Extract title and artist from ID3 tags in audio file.
    
    Args:
        file_path: Path to the audio file
        
    Returns:
        Tuple of (title, artist, additional_metadata)
    """
    title = None
    artist = None
    additional_metadata = {}
    
    try:
        # First try using ID3 directly for ID3v2 tags
        try:
            audio = ID3(file_path)
            logger.info(f"ID3 tags found in {file_path}")
            
            # Extract common ID3v2 tag frames
            if 'TIT2' in audio:  # Title
                title = str(audio['TIT2'])
                logger.info(f"Found ID3 title: {title}")
            if 'TPE1' in audio:  # Artist
                artist = str(audio['TPE1'])
                logger.info(f"Found ID3 artist: {artist}")
            if 'TALB' in audio:  # Album
                additional_metadata['album'] = str(audio['TALB'])
            if 'TYER' in audio:  # Year
                additional_metadata['year'] = str(audio['TYER'])
            if 'TCON' in audio:  # Genre
                additional_metadata['genre'] = str(audio['TCON'])
                
            # Log other available tags for debugging
            logger.debug(f"All ID3 tags: {list(audio.keys())}")
                
        except ID3NoHeaderError:
            logger.warning("No ID3 header found, trying generic tag formats...")
        
        # If ID3 direct lookup failed, try generic mutagen
        if not title or not artist:
            try:
                audio = mutagen.File(file_path)
                if audio and hasattr(audio, 'tags') and audio.tags:
                    logger.info(f"Found generic tags: {list(audio.tags.keys())}")
                    # Different tag formats might use different keys
                    for key in audio.tags.keys():
                        if any(title_key in key.lower() for title_key in ['title', 'tit2']):
                            title = str(audio.tags[key])
                            logger.info(f"Found generic title: {title}")
                        if any(artist_key in key.lower() for artist_key in ['artist', 'performer', 'tpe1']):
                            artist = str(audio.tags[key])
                            logger.info(f"Found generic artist: {artist}")
                        if any(album_key in key.lower() for album_key in ['album', 'talb']):
                            additional_metadata['album'] = str(audio.tags[key])
                        if any(year_key in key.lower() for year_key in ['year', 'date', 'tyer']):
                            additional_metadata['year'] = str(audio.tags[key])
                        if any(genre_key in key.lower() for genre_key in ['genre', 'tcon']):
                            additional_metadata['genre'] = str(audio.tags[key])
            except Exception as e:
                logger.error(f"Error with generic mutagen: {e}")
    
    except ImportError as e:
        logger.error(f"Could not import mutagen for ID3 extraction: {e}")
    except Exception as e:
        logger.exception(f"Error extracting ID3 tags: {e}")
    
    return title, artist, additional_metadata 