
import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Music } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background pointer-events-none" />
      
      {/* Static background circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-primary/5" />
        <div className="absolute top-[40%] right-[10%] w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-primary/5" />
        <div className="absolute bottom-[10%] left-[30%] w-24 sm:w-48 h-24 sm:h-48 rounded-full bg-primary/5" />
      </div>
      
      {/* Static, bigger, more transparent musical notes */}
      <div className="absolute top-[15%] left-[10%] text-[30px] sm:text-[40px] text-primary/10">🎵</div>
      <div className="absolute bottom-[20%] right-[15%] text-[36px] sm:text-[48px] text-primary/10">🎶</div>
      <div className="absolute top-[40%] left-[25%] text-[28px] sm:text-[36px] text-primary/10">🎼</div>
      <div className="absolute bottom-[40%] right-[25%] text-[32px] sm:text-[42px] text-primary/10">🎧</div>
      
      <div className="container relative px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-4 shadow-inner">
            Built on Story Protocol
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance relative">
            <span className="absolute -top-6 -left-2 sm:-top-8 sm:-left-4 text-[28px] sm:text-[36px] text-primary/20">🎵</span>
            SoundRights
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-2">Secure Your Licenses On-Chain</div>
            <span className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 text-[28px] sm:text-[36px] text-primary/20">🎶</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Empowering audio creators with transparent IP registration and programmable licensing, built on Story Protocol.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 sm:pt-4">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl gap-2 w-full sm:w-auto relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></span>
              <span className="absolute inset-0 w-full h-0 bg-white/10 transition-all duration-300 group-hover:h-full"></span>
              <Music className="w-4 h-4 group-hover:animate-pulse" />
              Try the Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/whitepaper"
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
