
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 mt-auto border-t bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold">
              <span className="bg-primary rounded-md p-1 text-xs text-primary-foreground">SR</span>
              <span>SoundRights</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Own Your Sound. Secure Your Licenses On-Chain.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Try It Now
                </Link>
              </li>
              <li>
                <Link to="/whitepaper" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  White Paper
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            © {currentYear} SoundRights. Built on <a href="https://story.xyz" className="text-primary hover:underline">Story Protocol</a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
