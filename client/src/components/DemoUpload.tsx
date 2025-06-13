import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Music, CheckCircle, AlertTriangle, ExternalLink, Search, Database, Disc, FileAudio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DramaticUploadProcess } from './DramaticUploadProcess';

interface UploadResult {
  id: string;
  title: string;
  artist: string;
  audioFeatures?: any;
  similarTracks?: any[];
  ipRegistered: boolean;
  storyProtocolUrl?: string;
  ipError?: string;
}

export default function DemoUpload() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Electronic',
    year: '',
    label: '',
    catalogNumber: '',
  });
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [showDramaticProcess, setShowDramaticProcess] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any>(null);
  const [id3Extracted, setId3Extracted] = useState(false);
  const [discogsSearched, setDiscogsSearched] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) {
        setSelectedFile(file);
        
        // Simulate ID3 metadata extraction
        if (file.name.endsWith('.mp3')) {
          setTimeout(() => {
            setId3Extracted(true);
            setFormData(prev => ({
              ...prev,
              title: prev.title || 'Digital Dreams',
              artist: prev.artist || 'SynthWave Studios',
              album: prev.album || 'Electronic Horizons',
              year: prev.year || '2024',
              genre: 'Electronic'
            }));
            
            toast({
              title: "ID3 Metadata Extracted",
              description: "Track information auto-populated from MP3 file",
            });
          }, 1000);
        }
        
        // Auto-fill form if filename has track info
        const filename = file.name.replace(/\.[^/.]+$/, "");
        if (!formData.title && filename.includes('-')) {
          const [artist, title] = filename.split('-').map(s => s.trim());
          setFormData(prev => ({ ...prev, artist, title }));
        } else if (!formData.title) {
          setFormData(prev => ({ ...prev, title: filename }));
        }
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const searchDiscogs = async () => {
    if (!formData.title && !formData.artist) {
      toast({
        title: "Missing Information",
        description: "Please provide track title or artist to search Discogs",
        variant: "destructive",
      });
      return;
    }

    setDiscogsSearched(true);
    
    // Simulate Discogs API search
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        album: prev.album || 'Electronic Horizons',
        year: prev.year || '2024',
        label: prev.label || 'Independent Digital',
        catalogNumber: prev.catalogNumber || 'ID001',
        genre: prev.genre || 'Electronic'
      }));
      
      toast({
        title: "Discogs Data Retrieved",
        description: "Track information completed from Discogs database",
      });
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.artist) {
      toast({
        title: "Missing Information",
        description: "Please provide track title and artist",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setShowDramaticProcess(true);
    
    try {
      const data = new FormData();
      data.append('audio', selectedFile);
      data.append('title', formData.title);
      data.append('artist', formData.artist);
      data.append('album', formData.album);
      data.append('genre', formData.genre);
      data.append('year', formData.year);
      data.append('label', formData.label);
      data.append('catalogNumber', formData.catalogNumber);

      const response = await fetch('/api/tracks/demo', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const uploadResult: UploadResult = await response.json();
      setResult(uploadResult);

      if (uploadResult.ipRegistered) {
        toast({
          title: "Success!",
          description: "Track uploaded and IP registered on Story Protocol",
        });
      } else {
        toast({
          title: "Upload Complete",
          description: uploadResult.ipError || "Track uploaded successfully",
          variant: uploadResult.ipError ? "destructive" : "default",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: 'Electronic',
      year: '',
      label: '',
      catalogNumber: '',
    });
    setResult(null);
    setShowDramaticProcess(false);
    setVerificationResults(null);
    setId3Extracted(false);
    setDiscogsSearched(false);
  };

  if (showDramaticProcess) {
    return (
      <DramaticUploadProcess
        file={selectedFile!}
        metadata={formData}
        onComplete={(results) => {
          setVerificationResults(results);
          setShowDramaticProcess(false);
          setUploading(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* MVP Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Record Label Platform Features</h3>
              <p className="text-sm text-blue-800 mb-3">
                This MVP demonstrates individual track upload. Full platform supports bulk catalog management 
                for independent labels with automated pricing and licensing workflows.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  <Disc className="w-3 h-3 mr-1" />
                  Bulk Catalog Upload
                </Badge>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  <FileAudio className="w-3 h-3 mr-1" />
                  ID3 Metadata Extraction
                </Badge>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  <Search className="w-3 h-3 mr-1" />
                  Discogs API Integration
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Upload Track for IP Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="audio-file">Audio File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <input
                id="audio-file"
                type="file"
                accept="audio/*,.mp3,.wav"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="audio-file" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : "Click to select audio file or drag & drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1">MP3, WAV supported</p>
              </label>
            </div>
            
            {selectedFile && id3Extracted && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                ID3 metadata extracted from MP3 file
              </div>
            )}
          </div>

          {/* Track Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter track title"
                className={id3Extracted ? "bg-green-50 border-green-300" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artist">Artist *</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                placeholder="Enter artist name"
                className={id3Extracted ? "bg-green-50 border-green-300" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                value={formData.album}
                onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                placeholder="Enter album name"
                className={discogsSearched ? "bg-blue-50 border-blue-300" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Release Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="2024"
                className={discogsSearched ? "bg-blue-50 border-blue-300" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Record Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Enter label name"
                className={discogsSearched ? "bg-blue-50 border-blue-300" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="catalogNumber">Catalog Number</Label>
              <Input
                id="catalogNumber"
                value={formData.catalogNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, catalogNumber: e.target.value }))}
                placeholder="CAT001"
                className={discogsSearched ? "bg-blue-50 border-blue-300" : ""}
              />
            </div>
          </div>

          {/* Discogs Search */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Search className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Auto-complete with Discogs</p>
              <p className="text-xs text-gray-600">Search Discogs database to auto-populate track information</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={searchDiscogs}
              disabled={discogsSearched || (!formData.title && !formData.artist)}
            >
              {discogsSearched ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Discogs
                </>
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={uploading || !selectedFile}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Register on Story Protocol
                </>
              )}
            </Button>
            
            {(selectedFile || result) && (
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Registration Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-green-800">Track</p>
                <p className="text-green-700">{result.title} by {result.artist}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Status</p>
                <p className="text-green-700">
                  {result.ipRegistered ? "IP Registered on Blockchain" : "Upload Complete"}
                </p>
              </div>
            </div>
            
            {result.storyProtocolUrl && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-green-600" />
                <a
                  href={result.storyProtocolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-800 underline text-sm"
                >
                  View on Story Protocol Explorer
                </a>
              </div>
            )}
            
            {result.ipError && (
              <div className="flex items-center gap-2 p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">{result.ipError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {verificationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationResults.similarTracks?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Similar Tracks Found:</h4>
                  {verificationResults.similarTracks.map((track: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg mb-2">
                      <p className="font-medium">{track.title} by {track.artist}</p>
                      <p className="text-sm text-gray-600">Similarity: {(track.similarity * 100).toFixed(1)}%</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}