
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Youtube, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type InputMethod = 'file' | 'spotify' | 'youtube';

const UploadForm = () => {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>('file');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleMethodChange = (method: InputMethod) => {
    setSelectedMethod(method);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'audio/mpeg' || selectedFile.type === 'audio/mp3') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an MP3 file.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'audio/mpeg' || droppedFile.type === 'audio/mp3') {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an MP3 file.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const validateSpotifyLink = (link: string) => {
    return link.includes('spotify.com/track/');
  };
  
  const validateYoutubeLink = (link: string) => {
    return link.includes('youtube.com/watch') || link.includes('youtu.be/');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (selectedMethod === 'file' && !file) {
      toast({
        title: "No file selected",
        description: "Please upload an MP3 file.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedMethod === 'spotify' && !validateSpotifyLink(link)) {
      toast({
        title: "Invalid Spotify link",
        description: "Please enter a valid Spotify track link.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedMethod === 'youtube' && !validateYoutubeLink(link)) {
      toast({
        title: "Invalid YouTube link",
        description: "Please enter a valid YouTube video link.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate processing
    setIsLoading(true);
    
    // For demo purposes, navigate to results page after a delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/results');
    }, 2000);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-lg border">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Upload Your Music</h2>
        <p className="text-muted-foreground">
          Upload a song or paste a link to find similar copyright-free music.
        </p>
      </div>
      
      <div className="flex border-b mb-8">
        <button
          className={`pb-2 px-4 transition-colors ${selectedMethod === 'file' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => handleMethodChange('file')}
        >
          <Upload className="inline-block mr-2 h-4 w-4" />
          Upload MP3
        </button>
        <button
          className={`pb-2 px-4 transition-colors ${selectedMethod === 'spotify' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => handleMethodChange('spotify')}
        >
          <LinkIcon className="inline-block mr-2 h-4 w-4" />
          Spotify Link
        </button>
        <button
          className={`pb-2 px-4 transition-colors ${selectedMethod === 'youtube' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => handleMethodChange('youtube')}
        >
          <Youtube className="inline-block mr-2 h-4 w-4" />
          YouTube Link
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {selectedMethod === 'file' && (
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-muted'} ${file ? 'border-green-500 bg-green-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".mp3,audio/mpeg"
              className="hidden"
              onChange={handleFileChange}
            />
            
            {file ? (
              <div className="py-4">
                <div className="flex items-center justify-center text-green-600 mb-2">
                  <Upload className="h-10 w-10" />
                </div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center text-muted-foreground mb-4">
                  <Upload className="h-10 w-10" />
                </div>
                <p className="font-medium">Drag and drop your MP3 file</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse from your device
                </p>
              </>
            )}
          </div>
        )}
        
        {(selectedMethod === 'spotify' || selectedMethod === 'youtube') && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="link" className="block text-sm font-medium">
                Paste your {selectedMethod === 'spotify' ? 'Spotify' : 'YouTube'} link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="link"
                  type="text"
                  value={link}
                  onChange={handleLinkChange}
                  placeholder={selectedMethod === 'spotify' 
                    ? 'https://open.spotify.com/track/...' 
                    : 'https://www.youtube.com/watch?v=...'}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            
            {selectedMethod === 'spotify' && !validateSpotifyLink(link) && link.length > 0 && (
              <div className="flex items-start text-amber-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                <span>Please enter a valid Spotify track link</span>
              </div>
            )}
            
            {selectedMethod === 'youtube' && !validateYoutubeLink(link) && link.length > 0 && (
              <div className="flex items-start text-amber-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                <span>Please enter a valid YouTube video link</span>
              </div>
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center transition-all duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing your song...
            </>
          ) : (
            <>Find Similar Music</>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
