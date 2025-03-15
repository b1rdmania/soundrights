
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
}

const AudioPlayer = ({ audioUrl, title }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create audio element when component mounts
    const audio = new Audio();
    audio.src = audioUrl;
    audio.volume = volume / 100;
    audio.addEventListener('loadeddata', () => setIsAudioLoaded(true));
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('error', handleAudioError);
    
    audioRef.current = audio;
    
    // Clean up when component unmounts
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current || !isAudioLoaded) {
      toast({
        title: "Audio not loaded yet",
        description: "Please wait while the audio is loading...",
        variant: "destructive"
      });
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      
      // Handle play promise to avoid uncaught promise errors
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
          })
          .catch(error => {
            // Auto-play prevented by browser
            toast({
              title: "Playback error",
              description: "Couldn't play the audio. Please try again.",
              variant: "destructive"
            });
            setIsPlaying(false);
          });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };
  
  const handleAudioError = (e: Event) => {
    console.error("Audio error:", e);
    toast({
      title: "Audio error",
      description: "There was a problem playing this track. Please try again later.",
      variant: "destructive"
    });
    setIsPlaying(false);
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-10 shadow-sm">
      <h2 className="text-lg font-medium mb-3">{title || "Play while reading"}</h2>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={togglePlayPause}
            disabled={!isAudioLoaded}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <div className="w-24 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Volume</span>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-14"
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {isAudioLoaded ? 
            "AI-generated Music Example - Courtesy of Suno" : 
            "Loading audio..."}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
