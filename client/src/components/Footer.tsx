
import React from 'react';
import { Link } from 'wouter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-12 mt-auto relative overflow-hidden">
      {/* Enhanced gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/5 to-purple-50/80"></div>
      
      {/* Animated musical elements */}
      <div className="absolute right-[15%] -top-6 text-primary/30 animate-float" style={{ animationDuration: '4s', fontSize: '32px' }}>
        🎵
      </div>
      <div className="absolute left-[25%] -top-2 text-secondary/40 animate-float" style={{ animationDuration: '6s', fontSize: '24px' }}>
        🎶
      </div>
      <div className="absolute right-[70%] top-8 text-primary/20 animate-float" style={{ animationDuration: '8s', fontSize: '20px' }}>
        🎼
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 text-2xl font-bold group">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg">🎵</span>
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SoundRights
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Own Your Sound. Secure Your Licenses On-Chain. 
              <br />
              <span className="text-primary font-medium">Revolutionizing music IP for independent labels.</span>
            </p>
            
            {/* Platform highlights */}
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <span>🔒</span> Blockchain Secured
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                <span>🎯</span> AI Verified
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                <span>⚡</span> Instant Licensing
              </span>
            </div>
          </div>
          
          {/* Navigation Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>🎼</span> Platform
              </h3>
              <div className="space-y-3">
                <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors group">
                  <span className="flex items-center gap-2">
                    <span className="scale-0 group-hover:scale-100 transition-transform">🏠</span>
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Home</span>
                  </span>
                </Link>
                
                <Link href="/marketplace" className="block text-muted-foreground hover:text-secondary transition-colors group">
                  <span className="flex items-center gap-2">
                    <span className="scale-0 group-hover:scale-100 transition-transform">🎶</span>
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Marketplace</span>
                  </span>
                </Link>
                
                <Link href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors group">
                  <span className="flex items-center gap-2">
                    <span className="scale-0 group-hover:scale-100 transition-transform">📊</span>
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Dashboard</span>
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span>📚</span> Resources
              </h3>
              <div className="space-y-3">
                <Link href="/whitepaper" className="block text-muted-foreground hover:text-primary transition-colors group">
                  <span className="flex items-center gap-2">
                    <span className="scale-0 group-hover:scale-100 transition-transform">📄</span>
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">White Paper</span>
                  </span>
                </Link>
                
                <Link href="/about" className="block text-muted-foreground hover:text-secondary transition-colors group">
                  <span className="flex items-center gap-2">
                    <span className="scale-0 group-hover:scale-100 transition-transform">🎧</span>
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">About</span>
                  </span>
                </Link>
                
                <a href="https://story.xyz" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors group">
                  <span className="flex items-center gap-2">
                    <span className="scale-0 group-hover:scale-100 transition-transform">🔗</span>
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Story Protocol</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced footer bottom */}
        <div className="mt-12 pt-6 border-t border-gradient-to-r from-transparent via-primary/20 to-transparent relative">
          <div className="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span>©</span> {currentYear} SoundRights
              <span className="animate-pulse">🎵</span>
              <span className="hidden md:inline">Powered by blockchain innovation</span>
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                Built on 
                <a href="https://story.xyz" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Story Protocol
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
