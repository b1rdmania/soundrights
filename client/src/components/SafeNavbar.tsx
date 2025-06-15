import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from "@/lib/utils";
import { Menu, LogOut, Wallet, Music } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/SafeWalletAuth";

const SafeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
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
    { path: '/integrations', label: 'Integrations' },
    { path: '/whitepaper', label: 'Docs' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SoundRights</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-600",
                  location === link.path
                    ? "text-purple-600"
                    : "text-gray-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-green-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 font-medium">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SafeNavbar;