import pytest
from unittest.mock import patch, MagicMock
import requests

from app.services.ip_verification.yakoa_service import YakoaService, YakoaError
from app.core.config import Settings

@pytest.fixture
def mock_settings(monkeypatch):
    monkeypatch.setattr("app.services.ip_verification.yakoa_service.settings", Settings(
        YAKOA_API_KEY="test_key",
        YAKOA_API_SUBDOMAIN="test_subdomain",
        YAKOA_NETWORK="test_network",
        # Add other necessary mock settings if YakoaService constructor uses them beyond these
    ))

@pytest.fixture
def yakoa_service(mock_settings):
    return YakoaService()

@patch("requests.post")
def test_register_token_success(mock_post, yakoa_service):
    mock_response = MagicMock()
    mock_response.status_code = 200
    expected_json = {"status": "success", "token_id": "123"}
    mock_response.json.return_value = expected_json
    mock_post.return_value = mock_response

    token_data = {"id": "test_id", "media": [{"media_id": "m1", "url": "http://example.com/vid.mp4"}]}
    result = yakoa_service.register_token(token_data)

    assert result == expected_json
    mock_post.assert_called_once_with(
        f"https://test_subdomain.ip-api.yakoa.io/test_network/token",
        json=token_data,
        headers={
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": "Bearer test_key"
        },
        timeout=30
    )
    mock_response.raise_for_status.assert_called_once()

@patch("requests.post")
def test_register_token_http_error(mock_post, yakoa_service):
    mock_response = MagicMock()
    mock_response.status_code = 400
    mock_response.text = "Bad Request"
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError(response=mock_response)
    mock_post.return_value = mock_response

    token_data = {"id": "test_id"}
    with pytest.raises(YakoaError) as exc_info:
        yakoa_service.register_token(token_data)
    
    assert exc_info.value.status_code == 400
    assert exc_info.value.details == "Bad Request"
    assert "Yakoa API HTTP error: 400" in str(exc_info.value)

@patch("requests.post")
def test_register_token_request_exception(mock_post, yakoa_service):
    mock_post.side_effect = requests.exceptions.Timeout("Connection timed out")

    token_data = {"id": "test_id"}
    with pytest.raises(YakoaError) as exc_info:
        yakoa_service.register_token(token_data)
    
    assert "Yakoa API request failed: Connection timed out" in str(exc_info.value)

@patch("requests.post")
def test_register_token_success_no_api_key(mock_post, monkeypatch):
    # Temporarily modify settings for this specific test
    monkeypatch.setattr("app.services.ip_verification.yakoa_service.settings", Settings(
        YAKOA_API_KEY=None, # No API Key
        YAKOA_API_SUBDOMAIN="test_subdomain_no_key",
        YAKOA_NETWORK="test_network_no_key",
    ))
    service_no_key = YakoaService()
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    expected_json = {"status": "success", "token_id": "456"}
    mock_response.json.return_value = expected_json
    mock_post.return_value = mock_response

    token_data = {"id": "test_id_no_key", "media": [{"media_id": "m1", "url": "http://example.com/vid.mp4"}]}
    result = service_no_key.register_token(token_data)

    assert result == expected_json
    mock_post.assert_called_once_with(
        f"https://test_subdomain_no_key.ip-api.yakoa.io/test_network_no_key/token",
        json=token_data,
        headers={
            "accept": "application/json",
            "content-type": "application/json",
            # No Authorization header
        },
        timeout=30
    )
    mock_response.raise_for_status.assert_called_once() 