
import React from 'react';
import { Link } from 'wouter';

const CtaSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto group"
            >
              <span className="mr-2">🎵</span>
              Connect Wallet & Start
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium bg-secondary hover:bg-secondary/80 transition-colors w-full sm:w-auto group"
            >
              <span className="mr-2">🎼</span>
              Browse Marketplace
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
