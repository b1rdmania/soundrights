import React, { useState, useRef } from 'react';
import { Upload, Loader, FileAudio, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface TrackUploadProps {
  onSuccess?: (track: any) => void;
}

const GENRES = [
  'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 
  'Country', 'R&B', 'Reggae', 'Folk', 'Blues', 'Funk', 'Other'
];

const MOODS = [
  'Energetic', 'Calm', 'Happy', 'Sad', 'Aggressive', 'Romantic', 
  'Mysterious', 'Uplifting', 'Dark', 'Nostalgic', 'Triumphant'
];

const TrackUpload: React.FC<TrackUploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    mood: '',
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/tracks', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (track) => {
      toast({
        title: "Track uploaded successfully",
        description: `"${track.title}" has been uploaded and is being processed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tracks'] });
      onSuccess?.(track);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFile(null);
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: '',
      mood: '',
    });
    setTags([]);
    setCurrentTag('');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      // Auto-populate title if empty
      if (!formData.title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setFormData(prev => ({ ...prev, title: fileName }));
      }
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an audio file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.artist) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title and artist name.",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append('audio', file);
    data.append('title', formData.title);
    data.append('artist', formData.artist);
    data.append('album', formData.album);
    data.append('genre', formData.genre);
    data.append('mood', formData.mood);
    data.append('tags', JSON.stringify(tags));

    uploadMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Music Track</CardTitle>
        <CardDescription>
          Upload your audio file and provide metadata for licensing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : file
                ? 'border-green-500 bg-green-50'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <FileAudio className="w-12 h-12 mx-auto text-green-600" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="font-medium">Drop your audio file here</p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Track Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter track title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist *</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                placeholder="Enter artist name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                value={formData.album}
                onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
                placeholder="Enter album name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Select
              value={formData.mood}
              onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map(mood => (
                  <SelectItem key={mood} value={mood}>
                    {mood}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X
                      className="w-3 h-3 ml-1"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Track
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrackUpload;