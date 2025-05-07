
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Music } from 'lucide-react';

const HeroSection = () => {
  const [musicNotes, setMusicNotes] = useState<Array<{ id: number; left: string; delay: string; emoji: string }>>([]);
  
  useEffect(() => {
    // Create initial floating music notes
    const initialNotes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      delay: `${Math.random() * 5}s`,
      emoji: ['🎵', '🎶', '🎼', '🎧', '🎸'][Math.floor(Math.random() * 5)]
    }));
    setMusicNotes(initialNotes);
    
    // Add new notes periodically
    const interval = setInterval(() => {
      setMusicNotes(prev => [
        ...prev.slice(-12), // Keep only the last 12 notes
        {
          id: Date.now(),
          left: `${Math.random() * 90 + 5}%`,
          delay: '0s',
          emoji: ['🎵', '🎶', '🎼', '🎧', '🎸'][Math.floor(Math.random() * 5)]
        }
      ]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background pointer-events-none" />
      
      {/* Animated background circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[10%] left-[30%] w-48 h-48 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Floating music notes */}
      {musicNotes.map(note => (
        <div
          key={note.id}
          className="absolute bottom-0 text-primary/30 animate-float-up"
          style={{
            left: note.left,
            animationDelay: note.delay,
            fontSize: `${Math.random() * 16 + 12}px`
          }}
        >
          {note.emoji}
        </div>
      ))}
      
      <div className="container relative px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-4 shadow-inner">
            Built on Story Protocol
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance relative">
            <span className="absolute -top-8 -left-4 text-3xl animate-float" style={{ animationDuration: '3s', animationDelay: '1s' }}>
              🎵
            </span>
            SoundRights: Own Your Sound
            <span className="absolute -bottom-6 -right-4 text-3xl animate-float" style={{ animationDuration: '4s', animationDelay: '2s' }}>
              🎶
            </span>
            <div className="text-2xl md:text-3xl lg:text-4xl mt-2">Secure Your Licenses On-Chain</div>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Empowering audio creators with transparent IP registration and programmable licensing, built on Story Protocol.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl gap-2 w-full sm:w-auto relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></span>
              <span className="absolute inset-0 w-full h-0 bg-white/10 transition-all duration-300 group-hover:h-full"></span>
              <Music className="w-4 h-4 group-hover:animate-pulse" />
              Try the Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/whitepaper"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:scale-105 hover:shadow-lg gap-2 w-full sm:w-auto relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent"></span>
              <span className="absolute inset-0 w-full h-0 bg-white/5 transition-all duration-300 group-hover:h-full"></span>
              📜 Read Our White Paper
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
