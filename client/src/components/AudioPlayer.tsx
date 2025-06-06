
import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

const AudioPlayer = ({ audioUrl, title }: AudioPlayerProps) => {
  const { toast } = useToast();

  const handleOpenAudio = () => {
    window.open(audioUrl, '_blank');
    toast({
      title: "Opening audio",
      description: "Opening audio player in a new tab",
    });
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-10 shadow-sm">
      <h2 className="text-lg font-medium mb-3">{title || "Play Audio"}</h2>
      
      <div className="flex flex-col space-y-4">
        <Button 
          onClick={handleOpenAudio}
          className="w-full flex items-center justify-center gap-2"
        >
          <Play className="h-5 w-5" />
          Play while reading our pitch
          <ExternalLink className="h-4 w-4 ml-1" />
        </Button>
        
        <div className="text-sm text-muted-foreground">
          AI-generated Music Example - Courtesy of Suno
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
