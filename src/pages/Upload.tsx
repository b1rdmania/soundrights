
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadForm from '@/components/UploadForm';

const Upload = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">SoundRights: Interactive Demo</h1>
            <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-md mb-8 text-sm">
              <p>
                Welcome to the SoundRights MVP Demo! Connect your wallet (configured for Story Testnet) 
                to register your sound IP or upload a file to verify its license. 
                All interactions occur on the Story Protocol Testnet.
              </p>
            </div>
            
            <div className="bg-card border rounded-lg shadow-sm p-6">
              <UploadForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
