import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, ExternalLink } from 'lucide-react';

interface MobileDetectorProps {
  children: React.ReactNode;
}

const MobileDetector: React.FC<MobileDetectorProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth < 768;
      
      const mobile = isMobileDevice || isSmallScreen;
      setIsMobile(mobile);
      setShowMobileWarning(mobile);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (showMobileWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex flex-col items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          {/* Icon */}
          <div className="relative">
            <Monitor className="h-16 w-16 text-primary mx-auto mb-4" />
            <Smartphone className="h-8 w-8 text-muted-foreground absolute -bottom-1 -right-2" />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              SoundRights Beta
            </h1>
            <p className="text-sm text-muted-foreground">
              Blockchain Music Licensing Platform
            </p>
          </div>

          {/* Main Message */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Desktop Experience Required
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This beta version is optimized for desktop and tablet devices. 
              For the best experience with wallet connections, file uploads, 
              and blockchain interactions, please access SoundRights from 
              a computer.
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              What you can do on desktop:
            </p>
            <div className="grid grid-cols-1 gap-2 text-left">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Register music IP as NFTs</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Verify originality with AI scanning</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Connect wallets securely</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>License tracks directly to buyers</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setShowMobileWarning(false)}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue Anyway
            </button>
            
            <div className="text-xs text-muted-foreground">
              <p>Mobile version coming soon</p>
              <p className="mt-1">Follow us for updates</p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              SoundRights • Powered by Story Protocol
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileDetector;