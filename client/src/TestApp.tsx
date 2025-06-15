import React from 'react';

const TestApp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">SoundRights</h1>
        <p className="text-gray-600 mb-4">Application is loading...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default TestApp;