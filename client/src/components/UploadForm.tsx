
import React, { useState, useRef } from 'react';
import { Upload, Loader, Tag, FileAudio, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

type InputMethod = 'file';
type Mode = 'register' | 'verify';

interface UploadFormProps {
  onUpload: (data: any) => void;
  mode: Mode;
  isWalletConnected: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload, mode, isWalletConnected }) => {
  const [file, setFile] = useState<File | null>(null);
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string | null>(null);
  const [selectedLicense, setSelectedLicense] = useState('non-commercial');
  const [aiMetadata, setAiMetadata] = useState<{
    description: string;
    tags: string[];
    mood: string;
    instrumentation: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'audio/mpeg' || selectedFile.type === 'audio/mp3' || selectedFile.type === 'audio/wav') {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file type. Please upload an MP3 or WAV file.");
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
      if (droppedFile.type === 'audio/mpeg' || droppedFile.type === 'audio/mp3' || droppedFile.type === 'audio/wav') {
        setFile(droppedFile);
      } else {
        toast.error("Invalid file type. Please upload an MP3 or WAV file.");
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
    
    if (!file) {
      toast.error("Please upload an audio file first");
      return;
    }
    
    if (mode === 'register') {
      if (!isWalletConnected) {
        toast.error("Please connect your wallet to register IP");
        return;
      }
      
      if (!songTitle || !artistName) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    
    setIsLoading(true);
    
    if (mode === 'register') {
      // Mock AI analysis progression for registration
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
              
              // Set AI-generated metadata
              setAiMetadata({
                description: "An upbeat electronic track with synth pads and a driving beat. Features a distinctive melody with minor key progressions and ambient textures in the background.",
                tags: ["Electronic", "Synthwave", "Upbeat", "Instrumental", "Driving", "Ambient", "Minor Key", "Soundtrack"],
                mood: "Energetic, Mysterious",
                instrumentation: "Synthesizers, Electronic Drums, Ambient Pads"
              });
              
            }, 500);
          }, 1000);
        }, 1000);
      }, 1000);
    } else {
      // Mock verification process
      setAnalysisStage("Analyzing audio fingerprint...");
      
      setTimeout(() => {
        setAnalysisStage("Searching for match on Story Protocol...");
        
        setTimeout(() => {
          setAnalysisStage("Retrieving license information...");
          
          setTimeout(() => {
            setIsLoading(false);
            setAnalysisStage(null);
            
            // Mock verification data
            onUpload({
              filename: file.name,
              timestamp: new Date().toISOString()
            });
          }, 1000);
        }, 1500);
      }, 1000);
    }
  };
  
  const handleFinalSubmit = () => {
    onUpload({
      title: songTitle,
      artist: artistName,
      filename: file?.name,
      license: selectedLicense,
      metadata: aiMetadata,
      timestamp: new Date().toISOString()
    });
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
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
            accept=".mp3,.wav,audio/mpeg,audio/wav"
            className="hidden"
            onChange={handleFileChange}
          />
          
          {file ? (
            <div className="py-4">
              <div className="flex items-center justify-center text-green-600 mb-2">
                <FileAudio className="h-10 w-10" />
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
              <p className="font-medium">
                {mode === 'register' 
                  ? "Drag and drop your audio file to register" 
                  : "Drag and drop an audio file to verify its license"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse from your device
              </p>
            </>
          )}
        </div>
        
        {isLoading ? (
          <div className="bg-secondary/20 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {mode === 'register' ? 'AI Analysis in Progress' : 'Verification in Progress'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {mode === 'register' 
                ? "Our AI is listening... generating insights for your track!" 
                : "Searching for a match on Story Protocol..."}
            </p>
            
            <div className="w-full bg-background rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{analysisStage}</p>
          </div>
        ) : aiMetadata ? (
          // Show AI metadata and registration form
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                AI-Generated Metadata <span className="text-xs ml-2 bg-primary/20 px-2 py-0.5 rounded">Editable</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    AI-Suggested Description
                  </label>
                  <Textarea 
                    value={aiMetadata.description} 
                    onChange={(e) => setAiMetadata({...aiMetadata, description: e.target.value})}
                    className="w-full"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    AI-Suggested Tags/Keywords
                  </label>
                  <Input 
                    value={aiMetadata.tags.join(', ')} 
                    onChange={(e) => setAiMetadata({
                      ...aiMetadata, 
                      tags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma-separated tags</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      AI-Detected Mood
                    </label>
                    <Input 
                      value={aiMetadata.mood} 
                      onChange={(e) => setAiMetadata({...aiMetadata, mood: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      AI-Detected Instrumentation
                    </label>
                    <Input 
                      value={aiMetadata.instrumentation} 
                      onChange={(e) => setAiMetadata({...aiMetadata, instrumentation: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="songTitle" className="block text-sm font-medium mb-1">
                    Track Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="songTitle"
                    value={songTitle}
                    onChange={handleSongTitleChange}
                    placeholder="Enter track title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="artistName" className="block text-sm font-medium mb-1">
                    Artist/Creator Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="artistName"
                    value={artistName}
                    onChange={handleArtistNameChange}
                    placeholder="Enter artist name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Select Programmable IP License (PIL)</h3>
                <RadioGroup 
                  defaultValue="non-commercial"
                  value={selectedLicense}
                  onValueChange={setSelectedLicense}
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="non-commercial" id="non-commercial" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="non-commercial" className="font-medium">
                        Non-Commercial Social Remixing
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Free to use non-commercially, attribution required, remix allowed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="commercial" id="commercial" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="commercial" className="font-medium">
                        Commercial Use
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow commercial usage with specified terms
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="commercial-remix" id="commercial-remix" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="commercial-remix" className="font-medium">
                        Commercial Remix
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow commercial remixing, attribution required
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <Button
                type="button"
                onClick={handleFinalSubmit}
                className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors bg-primary hover:bg-primary-dark"
                disabled={!isWalletConnected}
              >
                <Check className="mr-2 h-4 w-4" />
                Register on Story Protocol Testnet
              </Button>
              
              {!isWalletConnected && (
                <p className="text-amber-600 text-sm text-center">
                  Please connect your wallet to register your IP on Story Protocol
                </p>
              )}
            </div>
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors bg-primary hover:bg-primary-dark"
            disabled={!file}
          >
            {mode === 'register' 
              ? "Generate AI Metadata" 
              : "Verify License on Story Protocol"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
