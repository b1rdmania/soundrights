import os
import tempfile
import pytest
from unittest.mock import patch

def create_temp_audio_file(content: bytes = b"dummy audio data"):
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
    tmp.write(content)
    tmp.close()
    return tmp.name

def test_recognize_audio_audd_success(client, monkeypatch):
    # Mock AudDService.recognize_by_file
    with patch("app.services.audio_identification.audd_service.AudDService.recognize_by_file") as mock_audd:
        mock_audd.return_value = {
            "status": "success",
            "result": {
                "artist": "Test Artist",
                "title": "Test Song",
                "album": "Test Album",
                "release_date": "2023-01-01",
                "label": "Test Label",
                "timecode": "00:00",
                "song_link": "https://lis.tn/TestSong"
            }
        }
        audio_path = create_temp_audio_file()
        with open(audio_path, "rb") as f:
            response = client.post("/api/v1/recognize/audio/audd", files={"file": ("test.mp3", f, "audio/mp3")})
        os.remove(audio_path)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["result"]["artist"] == "Test Artist"
        assert data["result"]["title"] == "Test Song"

def test_recognize_audio_audd_empty_file(client):
    response = client.post("/api/v1/recognize/audio/audd", files={"file": ("empty.mp3", b"", "audio/mp3")})
    assert response.status_code == 400
    assert "could not process" in response.json()["detail"].lower()

def test_recognize_audio_audd_no_filename(client):
    # Test with missing filename - FastAPI returns 422 for validation errors
    audio_path = create_temp_audio_file()
    with open(audio_path, "rb") as f:
        response = client.post("/api/v1/recognize/audio/audd", files={"file": ("", f, "audio/mp3")})
    os.remove(audio_path)
    # FastAPI returns 422 for validation errors when filename is empty
    assert response.status_code == 422

def test_recognize_audio_audd_service_error(client, monkeypatch):
    # Mock AudDService.recognize_by_file to raise an exception
    with patch("app.services.audio_identification.audd_service.AudDService.recognize_by_file") as mock_audd:
        mock_audd.side_effect = Exception("AudD API error")
        audio_path = create_temp_audio_file()
        with open(audio_path, "rb") as f:
            response = client.post("/api/v1/recognize/audio/audd", files={"file": ("test.mp3", f, "audio/mp3")})
        os.remove(audio_path)
        assert response.status_code == 503
        assert "AudD recognition failed" in response.json()["detail"] 