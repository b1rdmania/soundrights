import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Search, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

type InputMethod = 'file' | 'link' | 'search';

interface UploadFormProps {
  onUpload: (data: any) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>('search');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleMethodChange = (method: InputMethod) => {
    setSelectedMethod(method);
    setLink('');
    setSearchQuery('');
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
  
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    setError(null);

    try {
      if (selectedMethod === 'search' && searchQuery) {
        // Process search query
        const formData = new FormData();
        formData.append('query', searchQuery);
        
        const response = await fetch('/api/v1/music/search', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to process search');
        }
        
        const data = await response.json();
        onUpload(data);
      } else if (link) {
        // Process link
        const formData = new FormData();
        formData.append('url', link);
        
        const response = await fetch('/api/v1/music/process-link', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to process link');
        }
        
        const data = await response.json();
        onUpload(data);
      } else if (file) {
        // Process file
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/v1/music/process-file', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to process file');
        }
        
        const data = await response.json();
        onUpload(data);
      } else {
        toast.error('Please provide a search query, file, or link');
      }
    } catch (err) {
      toast.error('Failed to process request');
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-lg border">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Find Similar Music</h2>
        <p className="text-muted-foreground">
          Search for a song, upload a file, or paste a link to find similar copyright-free music.
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
        <button
          className={`pb-2 px-4 transition-colors ${selectedMethod === 'link' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => handleMethodChange('link')}
        >
          <LinkIcon className="inline-block mr-2 h-4 w-4" />
          Paste Link
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {selectedMethod === 'search' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-medium">
                Search for a song
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="search"
                  name="search"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Enter song name, artist, or both"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
        
        {selectedMethod === 'link' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="link" className="block text-sm font-medium">
                Paste your music link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="link"
                  name="link"
                  type="text"
                  value={link}
                  onChange={handleLinkChange}
                  placeholder="https://example.com/music"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || (!file && !link && !searchQuery)}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            isLoading || (!file && !link && !searchQuery)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Find Similar Tracks'
          )}
        </button>
      </form>
      
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
