import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SpotifyTrackFeatures {
  tempo: number;
  key: number;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration_ms: number;
  preview_url: string | null;
  external_url: string;
}

export interface SpotifyResponse {
  track: SpotifyTrack;
  features: SpotifyTrackFeatures;
  similar_tracks: Array<{
    id: string;
    name: string;
    artist_name: string;
    image_url?: string;
    audio_url: string;
    download_url: string;
    license_type?: string;
    bpm?: number;
    tags?: string[];
    mood?: string;
    similarity?: number;
  }>;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  view_count: string;
  thumbnail: string;
  published_at: string;
}

export interface SpotifyAuthResponse {
  auth_url: string;
}

export interface SpotifyTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const spotifyApi = {
  getAuthUrl: async () => {
    const response = await api.get('/spotify/auth/spotify');
    return response.data.auth_url;
  },

  handleCallback: async (code: string) => {
    const response = await api.get('/spotify/auth/callback', {
      params: { code }
    });
    return response.data;
  },

  processUrl: async (url: string, accessToken: string) => {
    const response = await api.post('/spotify/process', 
      { url },
      {
        params: { access_token: accessToken }
      }
    );
    return response.data;
  },

  searchTracks: async (query: string, accessToken: string) => {
    const response = await api.get('/spotify/search', {
      params: { 
        query,
        access_token: accessToken
      }
    });
    return response.data;
  }
};

export const youtubeApi = {
  processUrl: async (url: string): Promise<YouTubeVideo> => {
    const response = await api.post('/youtube/process', { url });
    return response.data;
  },
};

export default api; 