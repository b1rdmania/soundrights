
import React from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

const AudioPlayer = ({ audioUrl, title }: AudioPlayerProps) => {
  return (
    <div className="bg-card border rounded-lg p-4 mb-10 shadow-sm">
      <h2 className="text-lg font-medium mb-3">{title || "Play while reading"}</h2>
      <div className="flex flex-col space-y-4">
        <iframe 
          src={audioUrl}
          width="100%" 
          height="150" 
          frameBorder="0" 
          allow="autoplay; encrypted-media" 
          title="Suno AI music player"
          className="rounded-md"
        />
        <div className="text-sm text-muted-foreground">
          AI-generated Music Example - Courtesy of Suno
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
