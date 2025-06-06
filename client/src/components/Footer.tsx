
import React from 'react';
import { Link } from 'wouter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 mt-auto relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"></div>
      
      {/* Musical note animation */}
      <div className="absolute right-[10%] -top-8 text-primary/20 animate-float" style={{ animationDuration: '5s', fontSize: '28px' }}>
        🎵
      </div>
      <div className="absolute left-[20%] -top-4 text-primary/20 animate-float" style={{ animationDuration: '7s', fontSize: '20px' }}>
        🎶
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2 text-xl font-semibold">
              <span className="bg-primary rounded-md p-1 text-xs text-primary-foreground">🎵</span>
              <span>SoundRights</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Own Your Sound. Secure Your Licenses On-Chain.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                <span className="scale-0 group-hover:scale-100 transition-transform">🏠</span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Home</span>
              </Link>
              <Link href="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                <span className="scale-0 group-hover:scale-100 transition-transform">🎵</span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Try It Now</span>
              </Link>
              <Link href="/whitepaper" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                <span className="scale-0 group-hover:scale-100 transition-transform">📜</span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">White Paper</span>
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                <span className="scale-0 group-hover:scale-100 transition-transform">🎧</span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">About</span>
              </Link>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                <span className="scale-0 group-hover:scale-100 transition-transform">🔒</span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Privacy Policy</span>
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group">
                <span className="scale-0 group-hover:scale-100 transition-transform">📄</span>
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">Terms of Use</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t relative">
          <div className="absolute left-1/4 top-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <p className="text-xs text-center text-muted-foreground">
            © {currentYear} SoundRights 🎵 Built on <a href="https://story.xyz" className="text-primary hover:underline">Story Protocol</a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
