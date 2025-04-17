import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Menu, X, FileText, TrendingUp } from 'lucide-react';
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
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Try It' },
    { path: '/whitepaper', label: 'White Paper', icon: <FileText size={16} className="mr-1" /> },
    { path: '/invest', label: 'Invest', icon: <TrendingUp size={16} className="mr-1" /> },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-semibold"
        >
          <span className="bg-primary rounded-md p-1.5 text-primary-foreground">SM</span>
          <span>SoundMatch</span>
        </Link>
        
        {!isMobile ? (
          <nav className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary link-hover flex items-center",
                  isActive(link.path) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.icon && link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <button 
            className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
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
            "absolute top-full left-0 right-0 bg-background shadow-lg transition-all duration-300 overflow-hidden",
            isMenuOpen ? "max-h-[300px] border-b" : "max-h-0"
          )}
        >
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-4 py-4">
              <NavLink to="/" className={({ isActive }) => cn("flex items-center gap-2 text-lg font-semibold", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")} onClick={() => setIsMenuOpen(false)}>Try SoundMatch</NavLink>
              <NavLink to="/tech-overview" className={({ isActive }) => cn("flex items-center gap-2 text-lg font-semibold", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")} onClick={() => setIsMenuOpen(false)}>Technical Overview</NavLink>
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2 text-lg font-semibold",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon && link.icon}
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
