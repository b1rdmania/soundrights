
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadForm from '@/components/UploadForm';
import { toast } from 'react-hot-toast';

const Upload = () => {
  const navigate = useNavigate();

  const handleUpload = (data: any) => {
    // Handle the uploaded data for demo purposes
    toast.success("Demo completed successfully!");
    console.log("Upload data received:", data);
    
    // Navigate to results page with mock data
    navigate('/results', { 
      state: { 
        resultData: {
          originalTrack: {
            title: data.title,
            artist: data.artist,
            source: data.source
          },
          similarTracks: [
            { title: "Similar Track 1", artist: "Artist A", license: "CC BY 4.0" },
            { title: "Similar Track 2", artist: "Artist B", license: "CC BY-NC 4.0" },
            { title: "Similar Track 3", artist: "Artist C", license: "CC0 1.0" }
          ]
        } 
      } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">SoundRights Demo</h1>
            <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-md mb-8 text-sm">
              <p>
                This is a simplified demo of the SoundRights platform. Use this interface to search
                for music or upload a sample to see how the platform works.
              </p>
            </div>
            
            <div className="bg-card border rounded-lg shadow-sm p-6">
              <UploadForm onUpload={handleUpload} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
