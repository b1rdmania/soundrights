import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from "@/lib/utils";
import { Menu, LogOut, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, isLoading } = useAuth();
  
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
    { path: '/demo', label: 'Demo', icon: '🎵' },
    { path: '/marketplace', label: 'Marketplace', icon: '🛒' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/sponsors', label: 'Integrations', icon: '⛓️' },
    { path: '/upload', label: 'Upload', icon: '📤' },
    { path: '/whitepaper', label: 'White Paper', icon: '📜' },
    { path: '/about', label: 'About', icon: '🎧' },
  ];

  const isActive = (path: string) => location === path;

  const ConnectButton = () => (
    <Button 
      variant="outline" 
      size={isMobile ? "lg" : "sm"}
      onClick={() => window.location.href = '/api/login'}
      className="flex items-center gap-2"
    >
      <Wallet size={16} /> Sign In
    </Button>
  );

  const UserMenu = ({ user }: { user: any }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">
        {user.firstName || user.email || 'User'}
      </span>
      <Button 
        variant="outline" 
        size={isMobile ? "lg" : "sm"}
        onClick={() => window.location.href = '/api/logout'}
        className="flex items-center gap-2"
      >
        <LogOut size={16} /> Sign Out
      </Button>
    </div>
  );

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-sm dark:bg-gray-900/90" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link 
          href="/" 
          className="flex items-center space-x-2 text-xl font-semibold shrink-0"
        >
          <span className="text-2xl">🎵</span>
          <span className="hidden sm:block">SoundRights</span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-4 flex-grow justify-center max-w-2xl mx-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "text-sm font-medium transition-all hover:text-primary flex items-center gap-2 relative group",
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

        {/* Auth Section */}
        <div className="hidden lg:flex items-center">
          {isLoading ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          ) : isAuthenticated ? (
            <UserMenu user={user} />
          ) : (
            <ConnectButton />
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && (
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
                {/* Auth Section for Mobile */}
                <div className="mt-auto pt-4 border-t border-border">
                  {isLoading ? (
                    <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                  ) : isAuthenticated ? (
                    <UserMenu user={user} />
                  ) : (
                    <ConnectButton />
                  )}
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
