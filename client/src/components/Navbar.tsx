import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from "@/lib/utils";
import { Menu, LogOut, Wallet, Music, Zap, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/WalletAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  
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
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/live-demo', label: 'Demo' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/integrations', label: 'Integrations' },
    { path: '/whitepaper', label: 'White Paper' },
    { path: '/about', label: 'About' },
  ];

  const isActive = (path: string) => location === path;

  const ConnectButton = () => {
    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    if (isConnected && address) {
      return (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-lg border border-green-200">
            <CheckCircle size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">
              {isMobile ? formatAddress(address).slice(0, 8) + '...' : formatAddress(address)}
            </span>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="text-gray-600 hover:text-red-600"
          >
            <LogOut size={16} className="mr-1" />
            Disconnect
          </Button>
        </div>
      );
    }

    return (
      <Button 
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={connectWallet}
      >
        <Wallet size={16} className="mr-2" />
        Connect
      </Button>
    );
  };

  const UserMenu = ({ user }: { user: any }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Welcome back!</span>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => window.location.href = '/api/logout'}
        className="text-gray-600 hover:text-red-600 border-gray-300"
      >
        <LogOut size={16} className="mr-1" />
        Sign Out
      </Button>
    </div>
  );

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-purple-100" 
        : "bg-white/80 backdrop-blur-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-md">
                <Music className="text-white" size={20} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                SoundRights
              </span>
              <span className="text-xs text-gray-500 font-medium">Web3 Music IP</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-purple-600 relative group px-3 py-2 rounded-lg",
                  isActive(link.path) 
                    ? "text-purple-600 bg-purple-50" 
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center">
            <ConnectButton />
          </div>

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu size={20} className="text-purple-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <Music className="text-purple-600" size={20} />
                    <span className="text-gray-900">SoundRights</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={cn(
                        "flex items-center px-4 py-3 text-base rounded-lg transition-all duration-200",
                        isActive(link.path) 
                          ? "bg-purple-50 text-purple-600 font-medium border-l-4 border-purple-600" 
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <ConnectButton />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;