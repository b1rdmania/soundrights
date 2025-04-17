from fastapi import HTTPException, status

class InvalidFileTypeError(HTTPException):
    def __init__(self, detail: str = "Invalid file type"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )

class FileTooLargeError(HTTPException):
    def __init__(self, detail: str = "File too large"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )

class InvalidURLError(HTTPException):
    def __init__(self, detail: str = "Invalid URL"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )

class ProcessingError(HTTPException):
    def __init__(self, detail: str = "Error processing audio"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )

class ExternalAPIError(HTTPException):
    def __init__(self, detail: str = "Error from external API"):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail
        )

class SpotifyAPIError(HTTPException):
    """Raised when there's an error with the Spotify API."""
    def __init__(self, detail: str = "Error with Spotify API"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )

class YouTubeAPIError(HTTPException):
    """Raised when there's an error with the YouTube API."""
    def __init__(self, detail: str = "Error with YouTube API"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )

class MetadataAPIError(Exception):
    """Custom exception for metadata service errors."""
    pass

class RecognitionAPIError(Exception):
    """Custom exception for recognition service errors."""
    pass

class AIServiceError(Exception):
    """Custom exception for AI service errors."""
    pass

class MusixmatchAPIError(MetadataAPIError):
    """Specific exception for Musixmatch API errors."""
    pass

class AudioAnalysisError(Exception):
    """Custom exception for audio analysis service errors (e.g., AcousticBrainz)."""
    pass