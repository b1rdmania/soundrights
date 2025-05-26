import os
import pytest

# Set test environment variables before importing any app modules
os.environ.update({
    "POSTGRES_USER": "testuser",
    "POSTGRES_PASSWORD": "testpass",
    "POSTGRES_DB": "soundrights_test",
    "POSTGRES_HOST": "localhost",
    "POSTGRES_PORT": "5432",
    "SECRET_KEY": "test-secret-key-for-testing-only",
    "ALGORITHM": "HS256",
    "AUDD_API_TOKEN": "test-token",
    "BACKEND_CORS_ORIGINS": '["http://localhost:3000","http://localhost:5173"]',
    "DEBUG": "True",
    "ZYLA_SHAZAM_API_KEY": "test-shazam-key",
    "GOOGLE_AI_API_KEY": "test-google-api-key",
})

# Now we can import app modules
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)

os.environ["AUDD_API_TOKEN"] = "test_audd_api_token"
os.environ["GOOGLE_AI_API_KEY"] = "test_google_ai_api_key"
os.environ["YAKOA_API_KEY"] = "test_yakoa_api_key"
os.environ["YAKOA_API_SUBDOMAIN"] = "test_yakoa_subdomain"
os.environ["YAKOA_NETWORK"] = "test_yakoa_network"

# Story Protocol (if needed for wider service testing) 