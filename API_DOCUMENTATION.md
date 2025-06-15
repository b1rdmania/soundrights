# SoundRights API Documentation

## Overview
SoundRights provides a comprehensive REST API for music IP registration, licensing, and blockchain integration. All endpoints use JSON for request and response payloads.

## Base URL
- Development: `http://localhost:5000`
- Production: `https://[your-replit-app].replit.app`

## Authentication
Most endpoints require user authentication via Replit Auth sessions. Protected endpoints will return `401 Unauthorized` if not authenticated.

## API Endpoints

### Authentication Routes

#### `GET /api/auth/user`
**Description**: Get current authenticated user information  
**Authentication**: Required  
**Response**:
```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "profileImageUrl": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### `GET /api/login`
**Description**: Initiate Replit OAuth login flow  
**Authentication**: None  
**Response**: Redirects to Replit authentication

#### `GET /api/logout`
**Description**: Terminate user session and logout  
**Authentication**: Required  
**Response**: Redirects to home page

### Track Management

#### `POST /api/tracks`
**Description**: Upload and register a new music track  
**Authentication**: Required  
**Content-Type**: `multipart/form-data`  
**Body**:
```
file: Audio file (MP3, WAV, etc.)
metadata: JSON string containing track information
```

**Metadata Schema**:
```json
{
  "title": "string",
  "artist": "string", 
  "album": "string",
  "genre": "string",
  "description": "string"
}
```

**Response**:
```json
{
  "track": {
    "id": "string",
    "title": "string",
    "artist": "string",
    "fileUrl": "string",
    "metadata": "object",
    "audioFeatures": "object",
    "createdAt": "datetime"
  }
}
```

#### `GET /api/tracks`
**Description**: Get user's uploaded tracks  
**Authentication**: Required  
**Response**:
```json
{
  "tracks": [
    {
      "id": "string",
      "title": "string", 
      "artist": "string",
      "fileUrl": "string",
      "metadata": "object",
      "createdAt": "datetime"
    }
  ]
}
```

#### `GET /api/tracks/:id`
**Description**: Get specific track details  
**Authentication**: Required  
**Response**: Single track object

#### `DELETE /api/tracks/:id`
**Description**: Delete a track  
**Authentication**: Required  
**Response**: `204 No Content`

### Licensing System

#### `POST /api/licenses`
**Description**: Create a new license for a track  
**Authentication**: Required  
**Body**:
```json
{
  "trackId": "string",
  "licenseType": "sync|commercial|personal",
  "price": "number",
  "duration": "number",
  "terms": "string"
}
```

#### `GET /api/licenses/track/:trackId`
**Description**: Get licenses for a specific track  
**Authentication**: Required

#### `GET /api/licenses/user`
**Description**: Get user's purchased licenses  
**Authentication**: Required

### IP Asset Management

#### `POST /api/ip-assets`
**Description**: Register IP asset on blockchain  
**Authentication**: Required  
**Body**:
```json
{
  "trackId": "string",
  "title": "string",
  "description": "string"
}
```

#### `GET /api/ip-assets/track/:trackId`
**Description**: Get IP assets for a track  
**Authentication**: Required

### Integration Testing Endpoints

#### `POST /api/yakoa/test`
**Description**: Test Yakoa IP verification with real audio  
**Response**:
```json
{
  "success": true,
  "service": "yakoa", 
  "message": "Real IP verification test completed",
  "details": {
    "token_id": "string",
    "status": "string",
    "media_url": "string",
    "verification_started": "datetime",
    "api_response": "string"
  }
}
```

#### `GET /api/zapper/test`
**Description**: Test Zapper portfolio analytics with live blockchain data  
**Response**:
```json
{
  "success": true,
  "service": "zapper",
  "message": "Real wallet portfolio test completed", 
  "details": {
    "wallet_address": "string",
    "total_value": "number",
    "token_count": "number", 
    "recent_transactions": "array",
    "last_updated": "datetime",
    "data_source": "Live blockchain data"
  }
}
```

#### `GET /api/tomo/status`
**Description**: Test Tomo social authentication status  
**Response**:
```json
{
  "status": "connected",
  "apiKey": "string",
  "message": "string"
}
```

#### `POST /api/story/test`
**Description**: Test Story Protocol blockchain registration  
**Response**:
```json
{
  "success": true,
  "service": "story_protocol",
  "message": "Blockchain IP registration test completed",
  "details": {
    "registration_id": "string",
    "blockchain_status": "string",
    "transaction_hash": "string"
  }
}
```

### Portfolio Analytics

#### `GET /api/portfolio/:address`
**Description**: Get wallet portfolio analytics  
**Authentication**: Required  
**Parameters**:
- `address`: Ethereum wallet address

**Response**:
```json
{
  "address": "string",
  "total_value": "number",
  "tokens": "array",
  "transactions": "array",
  "updated_at": "datetime"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes
- `200 OK`: Success
- `201 Created`: Resource created successfully  
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting
API endpoints implement rate limiting to ensure fair usage:
- General endpoints: 100 requests per minute
- Upload endpoints: 10 requests per minute
- Integration test endpoints: 5 requests per minute

## Environment Variables
Required environment variables for deployment:

```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret
YAKOA_API_KEY=your-yakoa-key
ZAPPER_API_KEY=your-zapper-key  
TOMO_API_KEY=your-tomo-key
WALLETCONNECT_PROJECT_ID=your-project-id
STORY_API_KEY=your-story-key
```

## Integration Examples

### JavaScript/TypeScript
```javascript
const response = await fetch('/api/tracks', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
});

const tracks = await response.json();
```

### curl
```bash
curl -X GET "http://localhost:5000/api/tracks" \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Live API Testing
Visit `/integrations` page for interactive API testing console with real-time integration status and test buttons for all major services.