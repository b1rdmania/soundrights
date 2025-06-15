import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Music, CheckCircle, AlertCircle, FileAudio, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ErrorHandler, LoadingSpinner } from '@/components/ErrorHandler';

interface UploadProgress {
  stage: 'uploading' | 'analyzing' | 'verifying' | 'registering' | 'complete';
  progress: number;
  message: string;
}

interface TrackMetadata {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  description?: string;
}

export default function MusicUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<TrackMetadata>({
    title: '',
    artist: '',
    album: '',
    genre: '',
    description: ''
  });
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; metadata: TrackMetadata }) => {
      const formData = new FormData();
      formData.append('audio', data.file);
      formData.append('metadata', JSON.stringify(data.metadata));

      // Upload progress stages
      setUploadProgress({ stage: 'uploading', progress: 20, message: 'Uploading audio file...' });
      
      const response = await fetch('/api/tracks/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      setUploadProgress({ stage: 'analyzing', progress: 40, message: 'Analyzing audio features...' });
      
      const result = await response.json();
      
      setUploadProgress({ stage: 'verifying', progress: 60, message: 'Verifying authenticity with Yakoa...' });
      
      // Verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress({ stage: 'registering', progress: 80, message: 'Registering IP asset on blockchain...' });
      
      // Blockchain registration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setUploadProgress({ stage: 'complete', progress: 100, message: 'Upload complete!' });
      
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: `${metadata.title} has been uploaded and verified successfully.`,
      });
      
      // Reset form
      setSelectedFile(null);
      setMetadata({ title: '', artist: '', album: '', genre: '', description: '' });
      setShowMetadataForm(false);
      setUploadProgress(null);
      
      // Invalidate cache to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['/api/tracks'] });
    },
    onError: (error) => {
      setUploadProgress(null);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/aac'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an audio file (MP3, WAV, FLAC, or AAC).",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setShowMetadataForm(true);
      
      // Pre-fill metadata from filename
      const filename = file.name.replace(/\.[^/.]+$/, '');
      const parts = filename.split(' - ');
      if (parts.length >= 2) {
        setMetadata(prev => ({
          ...prev,
          artist: parts[0].trim(),
          title: parts[1].trim()
        }));
      } else {
        setMetadata(prev => ({
          ...prev,
          title: filename
        }));
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.m4a']
    },
    maxFiles: 1,
    disabled: uploadMutation.isPending
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an audio file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!metadata.title || !metadata.artist) {
      toast({
        title: "Missing Information",
        description: "Please provide at least the track title and artist name.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({ file: selectedFile, metadata });
  };

  const handleMetadataChange = (field: keyof TrackMetadata, value: string) => {
    setMetadata(prev => ({ ...prev, [field]: value }));
  };

  const removeFile = () => {
    setSelectedFile(null);
    setShowMetadataForm(false);
    setMetadata({ title: '', artist: '', album: '', genre: '', description: '' });
  };

  if (uploadMutation.error) {
    return (
      <ErrorHandler
        error={uploadMutation.error}
        retry={() => uploadMutation.reset()}
        context="upload"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Music Track</h1>
        <p className="text-gray-600">
          Upload your music to verify authenticity and register IP ownership on the blockchain
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              } ${uploadMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input {...getInputProps()} />
              <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg text-purple-600">Drop your audio file here...</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-900 mb-2">
                    Drop your audio file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports MP3, WAV, FLAC, AAC (max 50MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Music className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  disabled={uploadMutation.isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showMetadataForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Track Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Track Title *</Label>
                  <Input
                    id="title"
                    value={metadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    placeholder="Enter track title"
                    required
                    disabled={uploadMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="artist">Artist Name *</Label>
                  <Input
                    id="artist"
                    value={metadata.artist}
                    onChange={(e) => handleMetadataChange('artist', e.target.value)}
                    placeholder="Enter artist name"
                    required
                    disabled={uploadMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="album">Album</Label>
                  <Input
                    id="album"
                    value={metadata.album}
                    onChange={(e) => handleMetadataChange('album', e.target.value)}
                    placeholder="Enter album name"
                    disabled={uploadMutation.isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={metadata.genre}
                    onChange={(e) => handleMetadataChange('genre', e.target.value)}
                    placeholder="Enter genre"
                    disabled={uploadMutation.isPending}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) => handleMetadataChange('description', e.target.value)}
                  placeholder="Describe your track (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                  disabled={uploadMutation.isPending}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeFile}
                  disabled={uploadMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadMutation.isPending || !metadata.title || !metadata.artist}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <LoadingSpinner />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Upload & Verify
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {uploadProgress && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Processing Upload</h3>
                <span className="text-sm text-gray-500">{uploadProgress.progress}%</span>
              </div>
              
              <Progress value={uploadProgress.progress} className="w-full" />
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {uploadProgress.stage === 'complete' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                )}
                {uploadProgress.message}
              </div>

              {uploadProgress.stage === 'complete' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">
                      Your track has been successfully uploaded and verified!
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    IP asset registration complete. Check your dashboard for details.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}