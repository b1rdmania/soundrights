import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const Invest = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create audio element when component mounts
    const audio = new Audio();
    audio.src = "https://assets.suno.ai/f24fb581-f86a-4dc9-b4ff-38cf411680e6/song.mp3";
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
  }, []);

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-bold tracking-tight mb-4">SoundMatch AI – Investment Opportunity</h1>
            <Separator className="my-4" />
          </div>

          {/* Audio Player */}
          <div className="bg-card border rounded-lg p-4 mb-10 shadow-sm">
            <h2 className="text-lg font-medium mb-3">Play while reading our pitch</h2>
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

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span> 
              Overview
            </h2>
            <p className="text-lg">
              SoundMatch AI is raising a <strong>$250K pre-seed round</strong> to fund the <strong>development and branding</strong> of its AI-powered music similarity search platform in <strong>Q2 2025</strong>.
            </p>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="rounded-lg border p-4 bg-card">
                <h3 className="text-md font-semibold mb-2">🎯 Goal</h3>
                <p>Build a working MVP, refine AI matching accuracy, expand indexed music libraries, and establish brand presence.</p>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <h3 className="text-md font-semibold mb-2">🚀 Use of Funds</h3>
                <p>Technology development, API integrations, infrastructure scaling, UX/UI enhancements, and early marketing efforts.</p>
              </div>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span> 
              Proposed Valuation
            </h2>
            <p className="text-lg">
              Given the current stage, technology stack, and market opportunity, we propose a <strong>valuation of $2.5M - $3.5M post-money</strong>, depending on investor appetite and market conditions.
            </p>
            
            <div className="rounded-lg border overflow-hidden mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Metric</TableHead>
                    <TableHead>Consideration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Market Opportunity</TableCell>
                    <TableCell>Growing demand for <strong>AI-driven music discovery</strong> and <strong>content-safe music solutions</strong>.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Competitive Edge</TableCell>
                    <TableCell>AI-powered deep music matching (chord structure, instrumentation, and timbre-based search).</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tech Development Stage</TableCell>
                    <TableCell>Feasible MVP with existing tools (Spotify API, FAISS, Librosa).</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Scalability</TableCell>
                    <TableCell>Monetization potential through SaaS subscriptions, licensing partnerships, and API sales.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pre-MVP Status</TableCell>
                    <TableCell>Still in development; valuation aligns with standard pre-seed expectations.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <p className="mt-4 text-muted-foreground">
              ⏳ <strong>Investment terms to be finalized</strong> based on early discussions with angel investors and pre-seed funds.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span> 
              Funding Breakdown ($250K Allocation)
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              <div className="rounded-lg border p-4 bg-card">
                <h3 className="text-md font-semibold mb-2">📌 Tech Development (50%)</h3>
                <p>AI model refinement, FAISS optimization, API integration.</p>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <h3 className="text-md font-semibold mb-2">📌 Branding & Marketing (20%)</h3>
                <p>Positioning, community engagement, early outreach.</p>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <h3 className="text-md font-semibold mb-2">📌 Infrastructure & Hosting (15%)</h3>
                <p>Cloud deployment (AWS/GCP), scaling storage.</p>
              </div>
              <div className="rounded-lg border p-4 bg-card">
                <h3 className="text-md font-semibold mb-2">📌 Team Expansion (15%)</h3>
                <p>Hiring core technical & marketing talent.</p>
              </div>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">4</span> 
              Investor Benefits & Exit Potential
            </h2>
            
            <div className="space-y-3 mt-4">
              <div className="border-l-4 border-primary pl-4 py-1">
                <p><strong>🔹 Early Entry to a High-Growth Market</strong> – AI music search is an emerging industry.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-1">
                <p><strong>🔹 Scalable Monetization Model</strong> – Freemium subscriptions, API sales, licensing partnerships.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-1">
                <p><strong>🔹 Potential Acquisition Targets</strong> – Music licensing platforms, video production SaaS, AI search firms.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-1">
                <p><strong>🔹 Exit Opportunities</strong> – Strategic buyout (B2B SaaS, AI music players) or further funding rounds in 12-18 months.</p>
              </div>
            </div>
          </section>

          <section className="mb-10 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">5</span> 
              Next Steps
            </h2>
            
            <div className="space-y-3 mt-4">
              <div className="border-l-4 border-primary pl-4 py-1">
                <p><strong>💰 Investor Outreach Begins Q1 2025</strong> – Preparing materials & early discussions.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-1">
                <p><strong>🛠 MVP Launch in Q2 2025</strong> – Showcasing AI-driven music discovery in action.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-1">
                <p><strong>📢 Brand Development & Go-To-Market in Q3 2025</strong> – Building visibility & traction.</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg mt-6 text-center">
              <p className="text-lg font-medium">📩 Interested investors can contact us for further discussions.</p>
              <Button variant="outline" className="mt-3">
                Contact Us
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Invest;
