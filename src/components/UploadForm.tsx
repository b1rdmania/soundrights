
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Search, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

type InputMethod = 'file' | 'link' | 'search';

interface UploadFormProps {
  onUpload: (data: any) => void;
}

interface AIGeneratedMetadata {
  description: string;
  keywords: string[];
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>('search');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // AI analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiMetadata, setAiMetadata] = useState<AIGeneratedMetadata | null>(null);
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  
  const handleMethodChange = (method: InputMethod) => {
    setSelectedMethod(method);
    setFile(null);
    setLink('');
    setSongTitle('');
    setArtistName('');
    // Reset AI states
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAiMetadata(null);
    setDescription('');
    setKeywords([]);
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'audio/mpeg' || selectedFile.type === 'audio/mp3') {
        setFile(selectedFile);
        // Start AI analysis after file upload
        await performAIAnalysis(selectedFile);
      } else {
        toast.error("Invalid file type. Please upload an MP3 file.");
      }
    }
  };
  
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleSongTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSongTitle(e.target.value);
  };

  const handleArtistNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtistName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleAddKeyword = () => {
    setKeywords([...keywords, '']);
  };

  const handleRemoveKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'audio/mpeg' || droppedFile.type === 'audio/mp3') {
        setFile(droppedFile);
        // Start AI analysis after file drop
        await performAIAnalysis(droppedFile);
      } else {
        toast.error("Invalid file type. Please upload an MP3 file.");
      }
    }
  };
  
  const performAIAnalysis = async (audioFile: File) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Prepare form data with the audio file
      const formData = new FormData();
      formData.append('file', audioFile);
      
      // Call the backend API for AI analysis
      const response = await api.post('/recognize/identify-and-generate-keywords', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Handle the response
      if (response.data) {
        const track = response.data.recognized_track || {};
        const generatedKeywords = response.data.generated_keywords || [];
        
        // If we have track data, set the song title and artist
        if (track.title) {
          setSongTitle(track.title);
        }
        if (track.subtitle) {
          setArtistName(track.subtitle); // Assuming subtitle is the artist name
        }
        
        // Create a mock description based on the track and keywords
        const mockDescription = `This ${track.genres ? track.genres.join(', ') : 'audio'} track features ${
          generatedKeywords.slice(0, 3).join(', ')
        } elements with a ${generatedKeywords.find(kw => kw.includes('tempo') || kw.includes('beat')) || 'unique'} rhythm.`;
        
        const metadata = {
          description: mockDescription,
          keywords: generatedKeywords,
        };
        
        setAiMetadata(metadata);
        setDescription(metadata.description);
        setKeywords(metadata.keywords);
        
        toast.success("AI analysis complete!");
      } else {
        throw new Error('No data received from AI analysis');
      }
    } catch (err: any) {
      console.error('AI analysis error:', err);
      toast.error(err.response?.data?.detail || 'AI analysis failed. Please try again.');
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    } finally {
      setIsAnalyzing(false);
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
      if (selectedMethod === 'search' && songTitle && artistName) {
        // Process search query
        const formData = new FormData();
        formData.append('title', songTitle);
        formData.append('artist', artistName);
        
        if (description) {
          formData.append('description', description);
        }
        
        if (keywords.length > 0) {
          formData.append('keywords', JSON.stringify(keywords));
        }
        
        const response = await api.post('/music/search', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (!response.data) {
          throw new Error('Failed to process search');
        }
        
        onUpload({
          ...response.data,
          metadata: {
            description,
            keywords
          }
        });
      } else if (link) {
        // Process YouTube link
        const requestData = { 
          url: link,
          metadata: {
            description,
            keywords
          }
        };
        
        const response = await api.post('/music/process-link', requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.data) {
          throw new Error('Failed to process link');
        }
        
        onUpload({
          ...response.data,
          metadata: {
            description,
            keywords
          }
        });
      } else if (file) {
        // Process file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('keywords', JSON.stringify(keywords));
        
        const response = await api.post('/music/process-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (!response.data) {
          throw new Error('Failed to process file');
        }
        
        onUpload({
          ...response.data,
          metadata: {
            description,
            keywords
          }
        });
      } else {
        toast.error('Please provide Song Title & Artist, upload a file, or paste a YouTube link');
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      
      let errorMessage = 'Failed to process request. Please try again.';
      // Check for specific Shazam 404 error first
      if (err.response?.status === 404 && err.response?.data?.detail?.includes('Shazam')) {
        errorMessage = 'Error: Shazam could not recognize this track. (Recognition service currently unreliable)';
      } else if (err.response?.data?.detail) {
        // Handle other backend errors with detail
        errorMessage = `Error: ${err.response.data.detail}`;
      } else if (err instanceof Error) {
        // Handle generic network or client-side errors
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-lg border">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Find Similar Music</h2>
        <p className="text-muted-foreground">
          Search for a song, upload a file, or paste a YouTube link to find similar copyright-free music.
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
          YouTube Link
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {selectedMethod === 'search' && (
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium">
              Search by Song Name / Artist
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="songTitle" className="block text-sm font-medium">
                  Song Title
                </label>
                <input
                  id="songTitle"
                  name="songTitle"
                  type="text"
                  value={songTitle}
                  onChange={handleSongTitleChange}
                  placeholder="Enter song title"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required={selectedMethod === 'search'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="artistName" className="block text-sm font-medium">
                  Artist Name
                </label>
                <input
                  id="artistName"
                  name="artistName"
                  type="text"
                  value={artistName}
                  onChange={handleArtistNameChange}
                  placeholder="Enter artist name"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required={selectedMethod === 'search'}
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
          <div className="space-y-2">
            <label htmlFor="link" className="block text-sm font-medium">
              Paste your YouTube video link
            </label>
            <input
              id="link"
              name="link"
              type="text"
              value={link}
              onChange={handleLinkChange}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required={selectedMethod === 'link'}
            />
          </div>
        )}
        
        {/* AI Analysis Progress Indicator */}
        {isAnalyzing && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                <span className="font-medium text-primary">AI analyzing your track...</span>
              </div>
              <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              Our AI is listening... generating smart metadata for your track!
            </p>
          </div>
        )}

        {/* AI Generated Metadata Section */}
        {aiMetadata && (
          <div className="mt-8 border-t pt-6 space-y-6">
            <div className="bg-primary/5 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium flex items-center mb-2 text-primary">
                <Search className="h-5 w-5 mr-2" />
                AI-Generated Metadata
              </h3>
              <p className="text-sm text-muted-foreground">
                Our AI has analyzed your track and generated the following metadata. 
                Feel free to review and edit these suggestions before submitting.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="ai-description" className="block text-sm font-medium mb-1">
                  AI-Suggested Description <span className="text-muted-foreground">(editable)</span>
                </label>
                <Textarea
                  id="ai-description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="AI description will appear here"
                  className="w-full resize-y min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  AI-Suggested Keywords <span className="text-muted-foreground">(editable)</span>
                </label>
                <div className="space-y-2">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={keyword}
                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                        placeholder="Keyword"
                        className="w-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    + Add Keyword
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || isAnalyzing || (!file && !link && !songTitle && !artistName)}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            isLoading || isAnalyzing || (!file && !link && !songTitle && !artistName)
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
