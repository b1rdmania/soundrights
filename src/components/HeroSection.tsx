
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Fingerprint } from 'lucide-react';

const HeroSection = () => {
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
      
      <div className="container relative px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-4">
            Built on Story Protocol
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            SoundRights: Own Your Sound. Secure Your Licenses On-Chain.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Empowering audio creators with transparent IP registration and programmable licensing, built on Story Protocol.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 gap-2 w-full sm:w-auto"
            >
              Try the Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/whitepaper"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-secondary hover:bg-secondary/80 transition-colors gap-2 w-full sm:w-auto"
            >
              Read Our White Paper
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
