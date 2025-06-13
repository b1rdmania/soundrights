import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Music, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
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
  });
  const [showDramaticProcess, setShowDramaticProcess] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.wav')) {
        setSelectedFile(file);
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
    
    try {
      const data = new FormData();
      data.append('audio', selectedFile);
      data.append('title', formData.title);
      data.append('artist', formData.artist);
      data.append('album', formData.album);
      data.append('genre', formData.genre);

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
          description: "Track uploaded and IP registered on Story Protocol blockchain",
        });
      } else {
        toast({
          title: "Upload Complete",
          description: uploadResult.ipError || "Track uploaded but IP registration failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload & Test Story Protocol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="audio-file">Audio File</Label>
                <Input
                  id="audio-file"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="genre">Genre</Label>
                <select
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="Electronic">Electronic</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Rock">Rock</option>
                  <option value="Pop">Pop</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Classical">Classical</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">Track Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter track title"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                  placeholder="Enter artist name"
                  className="mt-1"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="album">Album (Optional)</Label>
                <Input
                  id="album"
                  value={formData.album}
                  onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                  placeholder="Enter album name"
                  className="mt-1"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={uploading || !selectedFile}
              className="w-full"
            >
              {uploading ? (
                "Processing & Registering IP..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Register IP on Blockchain
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Processing Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Track Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Title:</strong> {result.title}</p>
                  <p><strong>Artist:</strong> {result.artist}</p>
                  <p><strong>ID:</strong> {result.id}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Blockchain Registration</h3>
                <div className="flex items-center gap-2 mb-2">
                  {result.ipRegistered ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">Successfully Registered</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="text-yellow-600 font-medium">Registration Pending</span>
                    </>
                  )}
                </div>
                {result.ipError && (
                  <p className="text-sm text-red-600">{result.ipError}</p>
                )}
              </div>
            </div>

            {result.audioFeatures && (
              <div>
                <h3 className="font-semibold mb-2">Audio Analysis</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="font-medium">BPM</div>
                    <div>{result.audioFeatures.bpm}</div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="font-medium">Key</div>
                    <div>{result.audioFeatures.key}</div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="font-medium">Duration</div>
                    <div>{Math.floor(result.audioFeatures.duration)}s</div>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="font-medium">Energy</div>
                    <div>{(result.audioFeatures.energy * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            )}

            {result.similarTracks && result.similarTracks.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Similar Tracks Detected</h3>
                <div className="space-y-2">
                  {result.similarTracks.map((track, index) => (
                    <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <p className="font-medium">{track.title} - {track.artist}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Similarity: {(track.similarity * 100).toFixed(1)}% ({track.matchType} match)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.storyProtocolUrl && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => window.open(result.storyProtocolUrl, '_blank')}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Story Protocol Explorer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}