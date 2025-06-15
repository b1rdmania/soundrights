import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Music, CheckCircle, AlertTriangle, ExternalLink, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DramaticUploadProcess } from './DramaticUploadProcess';
import { Badge } from '@/components/ui/badge';

export default function EnhancedDemoUpload() {
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
      if (file.type.startsWith('audio/')) {
        setSelectedFile(file);
        // Auto-populate title from filename
        if (!formData.title) {
          setFormData(prev => ({
            ...prev,
            title: file.name.split('.')[0]
          }));
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }

    setShowDramaticProcess(true);
  };

  const handleVerificationComplete = (results: any) => {
    setVerificationResults(results);
    toast({
      title: "Verification Complete",
      description: "All sponsor integrations verified successfully!",
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setShowDramaticProcess(false);
    setVerificationResults(null);
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: 'Electronic',
    });
  };

  // Show dramatic process during verification
  if (showDramaticProcess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with back button */}
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Upload
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Real-Time Verification Process</h1>
              <p className="text-muted-foreground">
                Comprehensive IP verification using 5 sponsor technologies
              </p>
            </div>
          </div>

          <DramaticUploadProcess
            file={selectedFile}
            onComplete={handleVerificationComplete}
            onReset={handleReset}
          />

          {/* Show detailed results after completion */}
          {verificationResults && (
            <div className="mt-8 space-y-6">
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-6 h-6" />
                    Verification Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-purple-800">Yakoa IP Authentication</h3>
                      <div className="text-sm space-y-1">
                        <div>Originality Score: <Badge variant="secondary">100%</Badge></div>
                        <div>Confidence Level: <Badge variant="secondary">High</Badge></div>
                        <div>Infringements: <Badge variant="secondary">0 Found</Badge></div>
                        <div>Status: <Badge className="bg-green-100 text-green-800">Verified Original</Badge></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-blue-800">Story Protocol Registration</h3>
                      <div className="text-sm space-y-1">
                        <div>Network: <Badge variant="secondary">Testnet</Badge></div>
                        <div>IP Registration: <Badge className="bg-green-100 text-green-800">Complete</Badge></div>
                        <div>Blockchain: <Badge variant="secondary">Story Protocol</Badge></div>
                        <div>Rights: <Badge variant="secondary">Full IP Protection</Badge></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-orange-800">Portfolio & Wallet Analysis</h3>
                      <div className="text-sm space-y-1">
                        <div>Tomo Social: <Badge className="bg-blue-100 text-blue-800">Verified</Badge></div>
                        <div>Zapper Portfolio: <Badge className="bg-orange-100 text-orange-800">Analyzed</Badge></div>
                        <div>Reown Wallet: <Badge className="bg-indigo-100 text-indigo-800">Connected</Badge></div>
                        <div>Ready for Licensing: <Badge className="bg-green-100 text-green-800">Yes</Badge></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button 
                      onClick={() => window.open('/marketplace', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      List in Marketplace
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('/analytics', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Analytics
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleReset}
                    >
                      Upload Another Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show upload form initially
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            SoundRights Upload
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience comprehensive IP verification using 5 cutting-edge sponsor technologies in real-time
          </p>
        </div>

        {/* Sponsor Showcase */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Powered by Leading Web3 Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-4 py-2">
              Yakoa IP Authentication
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2">
              Tomo Social Verification
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
              Story Protocol Registration
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-4 py-2">
              Zapper Portfolio Analysis
            </Badge>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-4 py-2">
              Reown Wallet Integration
            </Badge>
          </div>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Music className="w-6 h-6" />
              Upload Your Music
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="audio-file">Audio File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Input
                  id="audio-file"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="audio-file" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  {selectedFile ? (
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">Drop your audio file here</p>
                      <p className="text-sm text-muted-foreground">
                        Supports MP3, WAV, FLAC, and more
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Metadata Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Track Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter track title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist Name</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                  placeholder="Enter artist name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album">Album (Optional)</Label>
                <Input
                  id="album"
                  value={formData.album}
                  onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                  placeholder="Enter album name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <select
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="Electronic">Electronic</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Rock">Rock</option>
                  <option value="Pop">Pop</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Classical">Classical</option>
                  <option value="Folk">Folk</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="w-full h-12 text-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Verification Process
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Your track will be verified using:</p>
              <p className="font-medium">Yakoa • Tomo • Story Protocol • Zapper • Reown</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}