import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from "@/lib/utils";
import { Menu, LogOut, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/upload', label: 'Try It', icon: '🎵' },
    { path: '/whitepaper', label: 'White Paper', icon: '📜' },
    { path: '/about', label: 'About', icon: '🎧' },
    // Removed the Invest link from navigation
    // { path: '/invest', label: 'Invest', icon: '💰' },
  ];

  const isActive = (path: string) => location === path;

  const handleWalletConnect = () => {
    if (connected) {
      setConnected(false);
    } else {
      // Simplified wallet connection for now
      setConnected(true);
    }
  };

  const ConnectButton = () => (
    <Button 
      variant="outline" 
      size={isMobile ? "lg" : "sm"}
      onClick={handleWalletConnect}
      className="flex items-center gap-2"
    >
      {connected ? <><LogOut size={16} /> Disconnect</> : <><Wallet size={16} /> Connect Wallet</>}
    </Button>
  );

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-semibold"
        >
          <span className="text-2xl">🎵</span>
          <span>SoundRights</span>
        </Link>
        
        {/* Desktop navigation */}
        {!isMobile ? (
          <nav className="flex items-center space-x-5 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary flex items-center gap-2 relative",
                  isActive(link.path) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <span className="opacity-60 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100",
                  isActive(link.path) && "scale-x-100"
                )}></span>
              </Link>
            ))}
            {/* Tomo Connect Button for Desktop */}
            <ConnectButton />
          </nav>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <button 
                className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors hover:rotate-[5deg] hover:scale-105"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[75vw] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-xl">🎵</span>
                  <span>SoundRights Menu</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-base rounded-md transition-all duration-200",
                      isActive(link.path) 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
                {/* Tomo Connect Button for Mobile Sheet */}
                <div className="mt-auto pt-4 border-t border-border">
                  <ConnectButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Navbar;
