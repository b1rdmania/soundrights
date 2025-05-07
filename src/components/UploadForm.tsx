
import React, { useState, useRef } from 'react';
import { Upload, Search, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

type InputMethod = 'file' | 'search';

interface UploadFormProps {
  onUpload: (data: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>('file');
  const [file, setFile] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleMethodChange = (method: InputMethod) => {
    setSelectedMethod(method);
    setFile(null);
    setSongTitle('');
    setArtistName('');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'audio/mpeg' || selectedFile.type === 'audio/mp3') {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file type. Please upload an MP3 file.");
      }
    }
  };

  const handleSongTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSongTitle(e.target.value);
  };

  const handleArtistNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtistName(e.target.value);
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
        toast.error("Invalid file type. Please upload an MP3 file.");
      }
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock AI analysis progression
    setAnalysisStage("Analyzing audio waveforms...");
    
    setTimeout(() => {
      setAnalysisStage("Identifying instrumentation and mood...");
      
      setTimeout(() => {
        setAnalysisStage("Generating metadata and keywords...");
        
        setTimeout(() => {
          setAnalysisStage("Finalizing results...");
          
          setTimeout(() => {
            setIsLoading(false);
            setAnalysisStage(null);
            toast.success("AI analysis completed successfully!");
            
            // Pass mock data to parent component
            onUpload({
              title: songTitle || "Demo Track",
              artist: artistName || "Unknown Artist",
              filename: file?.name || "demo-track.mp3",
              source: selectedMethod,
              timestamp: new Date().toISOString()
            });
          }, 500);
        }, 1000);
      }, 1000);
    }, 1000);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-lg border">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Register Your Sound IP</h2>
        <p className="text-muted-foreground">
          Upload an audio file or search for a song to generate AI-powered metadata for your IP registration.
        </p>
      </div>
      
      <div className="flex border-b mb-8">
        <button
          className={`pb-2 px-4 transition-colors ${selectedMethod === 'search' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => handleMethodChange('search')}
        >
          <Search className="inline-block mr-2 h-4 w-4" />
          Search
        </button>
        <button
          className={`pb-2 px-4 transition-colors ${selectedMethod === 'file' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => handleMethodChange('file')}
        >
          <Upload className="inline-block mr-2 h-4 w-4" />
          Upload MP3
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {selectedMethod === 'search' && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="songTitle" className="block text-sm font-medium">
                  Song Title
                </label>
                <Input
                  id="songTitle"
                  name="songTitle"
                  value={songTitle}
                  onChange={handleSongTitleChange}
                  placeholder="Enter song title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="artistName" className="block text-sm font-medium">
                  Artist Name
                </label>
                <Input
                  id="artistName"
                  name="artistName"
                  value={artistName}
                  onChange={handleArtistNameChange}
                  placeholder="Enter artist name"
                />
              </div>
            </div>
          </div>
        )}
        
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
        
        {isLoading ? (
          <div className="bg-secondary/20 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI Analysis in Progress</h3>
            <p className="text-muted-foreground mb-4">Our AI is listening... generating insights for your track!</p>
            
            <div className="w-full bg-background rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{analysisStage}</p>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors bg-primary hover:bg-primary-dark"
          >
            Generate AI Metadata
          </button>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
