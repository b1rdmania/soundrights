import os
import requests
from typing import Optional, Dict, Any

AUDD_API_URL = "https://api.audd.io/"
AUDD_API_TOKEN = os.getenv("AUDD_API_TOKEN")

class AudDService:
    @staticmethod
    def recognize_by_url(audio_url: str, return_metadata: Optional[str] = None) -> Dict[str, Any]:
        """
        Recognize music from a remote audio file URL using AudD API.
        :param audio_url: URL to the audio file
        :param return_metadata: Comma-separated string for extra metadata (e.g., 'apple_music,spotify')
        :return: API response as dict
        """
        if not AUDD_API_TOKEN:
            raise ValueError("AUDD_API_TOKEN is not set in environment variables.")
        data = {
            'api_token': AUDD_API_TOKEN,
            'url': audio_url,
        }
        if return_metadata:
            data['return'] = return_metadata
        response = requests.post(AUDD_API_URL, data=data)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def recognize_by_file(file_path: str, return_metadata: Optional[str] = None) -> Dict[str, Any]:
        """
        Recognize music from a local audio file using AudD API.
        :param file_path: Path to the audio file
        :param return_metadata: Comma-separated string for extra metadata (e.g., 'apple_music,spotify')
        :return: API response as dict
        """
        if not AUDD_API_TOKEN:
            raise ValueError("AUDD_API_TOKEN is not set in environment variables.")
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {'api_token': AUDD_API_TOKEN}
            if return_metadata:
                data['return'] = return_metadata
            response = requests.post(AUDD_API_URL, data=data, files=files)
            response.raise_for_status()
            return response.json() 