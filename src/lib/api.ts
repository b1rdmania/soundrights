
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://soundmatch-audio-finder-production.up.railway.app/api/v1';

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  view_count: string;
  thumbnail: string;
  published_at: string;
}

export const youtubeApi = {
  processUrl: async (url: string): Promise<YouTubeVideo> => {
    const response = await api.post('/youtube/process', { url });
    return response.data;
  },
};

export default api; 
