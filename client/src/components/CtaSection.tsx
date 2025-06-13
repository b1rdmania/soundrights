
import React from 'react';
import { Link } from 'wouter';

const CtaSection = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Music Business Today</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join independent labels already securing their rights with blockchain technology.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto"
            >
              Connect Wallet & Start
            </Link>
            
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-medium bg-secondary hover:bg-secondary/80 transition-colors w-full sm:w-auto"
            >
              Browse Marketplace
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No monthly fees. Pay only per transaction. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
