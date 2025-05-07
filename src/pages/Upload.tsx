
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
            <h1 className="text-4xl font-bold mb-6">SoundRightsAI Demo</h1>
            <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-md mb-8 text-sm">
              <p className="mb-3">
                This is a simplified demo of the SoundRightsAI platform. Use this interface to upload a sound file to see how our AI-powered metadata generation works.
              </p>
              <p>
                Once you upload your audio file, our Google Gemini AI will analyze it and generate descriptive metadata including tags, mood, instrumentation, and context suggestions.
              </p>
            </div>
            
            <div className="bg-card border rounded-lg shadow-sm p-6">
              <UploadForm onUpload={handleUpload} />
            </div>

            <div className="mt-10 bg-secondary/20 border border-secondary/30 rounded-lg p-6 text-left">
              <h2 className="text-2xl font-semibold mb-4">AI-Powered Metadata Generation</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">The AI's Role:</h3>
                  <p className="text-muted-foreground">
                    When a creator registers a new sound IP through SoundRightsAI, we use Google Gemini AI to analyze the 
                    uploaded audio and automatically generate descriptive metadata (like tags, a summary of instrumentation, 
                    mood, context, etc.). The creator can then review, edit, and confirm this AI-generated metadata before 
                    it's included with the IP Asset registered on Story Protocol.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">The Process:</h3>
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <span className="font-medium">Audio File Upload & AI Analysis:</span>
                      <p className="text-muted-foreground">
                        Once you successfully upload your audio file, our system will indicate that AI analysis is in progress with visual feedback.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Metadata Generation:</span>
                      <p className="text-muted-foreground">
                        When analysis is complete, AI-generated metadata is presented in an editable format. This includes description, tags/keywords, mood, and instrumentation.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">User Review & Customization:</span>
                      <p className="text-muted-foreground">
                        You can review and edit all AI-generated suggestions before proceeding. This ensures the metadata accurately represents your sound.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">License Selection & Registration:</span>
                      <p className="text-muted-foreground">
                        After finalizing metadata, select your license terms and register your IP on the Story Protocol Testnet.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Upload;
