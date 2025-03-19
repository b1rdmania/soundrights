import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { spotifyApi } from '../lib/api';

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const handleCallback = async () => {
      if (code) {
        try {
          const response = await spotifyApi.handleCallback(code);
          // Store the access token in localStorage
          localStorage.setItem('spotifyToken', response.access_token);
          // Redirect back to the upload form
          navigate('/');
        } catch (error) {
          console.error('Failed to handle Spotify callback:', error);
          navigate('/?error=auth_failed');
        }
      }
    };

    if (code) {
      handleCallback();
    }
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Connecting to Spotify...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
} 