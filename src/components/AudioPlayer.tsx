
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

const AudioPlayer = ({ audioUrl, title }: AudioPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
  }, [audioUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    toast({
      title: "Audio Player Error",
      description: "Couldn't load the audio. Please try again later.",
      variant: "destructive",
    });
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-10 shadow-sm">
      <h2 className="text-lg font-medium mb-3">{title || "Play while reading"}</h2>
      <div className="flex flex-col space-y-4">
        {isLoading && (
          <div className="h-[150px] flex items-center justify-center bg-muted rounded-md">
            <div className="animate-pulse text-muted-foreground">Loading audio...</div>
          </div>
        )}
        
        <iframe 
          src={audioUrl}
          width="100%" 
          height="150" 
          frameBorder="0" 
          allow="autoplay; encrypted-media" 
          title="Suno AI music player"
          className={`rounded-md ${isLoading ? 'hidden' : 'block'}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
        
        {hasError && (
          <div className="h-[150px] flex items-center justify-center bg-muted/50 rounded-md border border-destructive/30">
            <div className="text-destructive">
              Failed to load audio player. <button 
                onClick={() => window.open(audioUrl, '_blank')}
                className="underline text-primary hover:text-primary/80"
              >
                Open in new tab
              </button>
            </div>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          AI-generated Music Example - Courtesy of Suno
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
