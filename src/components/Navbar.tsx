
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Menu, X, FileText, Music } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
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
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/upload', label: 'Try It', icon: '🎵' },
    { path: '/whitepaper', label: 'White Paper', icon: '📜' },
    { path: '/about', label: 'About', icon: '🎧' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-sm" 
          : "bg-transparent"
      )}
    >
      {/* Musical note decorations */}
      <div className="absolute left-[10%] top-4 text-primary/20 animate-float" style={{ animationDuration: '3s', fontSize: '24px' }}>
        🎵
      </div>
      <div className="absolute right-[15%] top-8 text-primary/20 animate-float" style={{ animationDuration: '5s', fontSize: '20px' }}>
        🎼
      </div>
      <div className="absolute left-[25%] top-12 text-primary/20 animate-float" style={{ animationDuration: '4s', fontSize: '16px' }}>
        🎶
      </div>
      
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-semibold"
        >
          <span className="bg-primary rounded-md p-1.5 text-primary-foreground">
            🎵
          </span>
          <span>SoundRights</span>
        </Link>
        
        {!isMobile ? (
          <nav className="flex items-center space-x-8">
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
          </nav>
        ) : (
          <button 
            className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors hover:rotate-[5deg] hover:scale-105"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>
      
      {/* Mobile menu */}
      {isMobile && (
        <div 
          className={cn(
            "absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm shadow-lg transition-all duration-300 overflow-hidden",
            isMenuOpen ? "max-h-[300px] border-b" : "max-h-0"
          )}
        >
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" /> Menu
              </SheetTitle>
            </SheetHeader>
            <nav className="grid gap-4 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 text-lg font-semibold hover:translate-x-1 transition-transform",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </div>
      )}
    </header>
  );
};

export default Navbar;
