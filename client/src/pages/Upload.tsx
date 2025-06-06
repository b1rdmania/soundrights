import React from 'react';
import { useLocation } from 'wouter';
import TrackUpload from '@/components/TrackUpload';

const Upload = () => {
  const [, setLocation] = useLocation();

  const handleUploadSuccess = (track: any) => {
    setLocation(`/results?trackId=${track.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upload Your Music
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your audio file to register IP rights, analyze metadata, and explore licensing opportunities through our Web3-powered platform.
            </p>
          </div>

          <TrackUpload onSuccess={handleUploadSuccess} />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Audio Analysis</h3>
              <p className="text-gray-600">
                Advanced AI analyzes your track for metadata, similarity matching, and copyright verification
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">IP Registration</h3>
              <p className="text-gray-600">
                Register your intellectual property rights on Story Protocol for transparent ownership
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensing</h3>
              <p className="text-gray-600">
                Explore licensing opportunities and manage rights through smart contracts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;