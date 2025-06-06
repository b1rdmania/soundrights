import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Music, Shield, ChevronRight, ExternalLink } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { WalletConnection } from '@/components/WalletConnection';

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

export default function Demo() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: 'Electronic',
    description: ''
  });
  const [walletConnected, setWalletConnected] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('/api/tracks/upload', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (result: UploadResult) => {
      setUploadResult(result);
      if (result.ipRegistered) {
        toast({
          title: "Success!",
          description: "Track uploaded and IP registered on Story Protocol blockchain",
        });
      } else {
        toast({
          title: "Upload Complete",
          description: result.ipError || "Track uploaded but IP registration failed",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

    const data = new FormData();
    data.append('audio', selectedFile);
    data.append('title', formData.title);
    data.append('artist', formData.artist);
    data.append('album', formData.album);
    data.append('genre', formData.genre);
    data.append('description', formData.description);

    uploadMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              Story Protocol Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to test IP registration on Story Protocol blockchain
            </p>
            <Button onClick={() => window.location.href = '/api/login'} className="w-full">
              Log In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Story Protocol Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Upload music and register IP rights on the blockchain
            </p>
          </div>

          {/* Wallet Connection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Blockchain Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WalletConnection 
                onConnected={() => setWalletConnected(true)}
                showStoryProtocolStatus={true}
              />
            </CardContent>
          </Card>

          {/* Upload Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div>
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

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your track, its style, inspiration, etc."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={uploadMutation.isPending || !selectedFile}
                  className="w-full"
                >
                  {uploadMutation.isPending ? (
                    "Uploading & Registering IP..."
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Register IP
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Track Information</h3>
                    <p><strong>Title:</strong> {uploadResult.title}</p>
                    <p><strong>Artist:</strong> {uploadResult.artist}</p>
                    <p><strong>ID:</strong> {uploadResult.id}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">IP Registration Status</h3>
                    <p className={`font-medium ${uploadResult.ipRegistered ? 'text-green-600' : 'text-red-600'}`}>
                      {uploadResult.ipRegistered ? '✅ Successfully Registered' : '❌ Registration Failed'}
                    </p>
                    {uploadResult.ipError && (
                      <p className="text-sm text-red-600 mt-1">{uploadResult.ipError}</p>
                    )}
                  </div>
                </div>

                {uploadResult.audioFeatures && (
                  <div>
                    <h3 className="font-semibold mb-2">Audio Analysis</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>BPM: {uploadResult.audioFeatures.bpm}</div>
                      <div>Key: {uploadResult.audioFeatures.key}</div>
                      <div>Duration: {Math.floor(uploadResult.audioFeatures.duration)}s</div>
                      <div>Energy: {(uploadResult.audioFeatures.energy * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                )}

                {uploadResult.similarTracks && uploadResult.similarTracks.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Similar Tracks Detected</h3>
                    <div className="space-y-2">
                      {uploadResult.similarTracks.map((track, index) => (
                        <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border">
                          <p className="font-medium">{track.title} - {track.artist}</p>
                          <p className="text-sm text-gray-600">
                            Similarity: {(track.similarity * 100).toFixed(1)}% ({track.matchType})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploadResult.storyProtocolUrl && (
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => window.open(uploadResult.storyProtocolUrl, '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Story Protocol Explorer
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}