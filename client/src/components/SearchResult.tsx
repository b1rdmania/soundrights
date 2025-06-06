
import React, { useState } from 'react';
import { Play, Pause, Download, ExternalLink } from 'lucide-react';

export interface SearchResultProps {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  previewUrl: string;
  licenseType: string;
  downloadUrl: string;
  bpm: number;
  genre: string;
  mood: string;
  similarity: number;
}

const SearchResult: React.FC<SearchResultProps> = ({
  title,
  artist,
  imageUrl,
  previewUrl,
  licenseType,
  downloadUrl,
  bpm,
  genre,
  mood,
  similarity,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(previewUrl));
  
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };
  
  React.useEffect(() => {
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.pause();
    };
  }, [audio]);
  
  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };
  
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
          </button>
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 text-white/90 text-xs font-medium">
          {Math.round(similarity * 100)}% Match
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{artist}</p>
          </div>
          <span className="px-2 py-1 rounded-full bg-secondary text-xs font-medium">
            {licenseType}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">BPM</p>
            <p className="font-medium">{bpm}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Genre</p>
            <p className="font-medium text-sm">{genre}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Mood</p>
            <p className="font-medium text-sm">{mood}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={togglePlay}
            className="flex-1 flex items-center justify-center py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
