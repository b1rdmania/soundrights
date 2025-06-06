
import React from 'react';
import { Link } from 'react-router-dom';

const CtaSection = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Experience the Future of Sound IP?</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto"
            >
              Try the Demo
            </Link>
            
            <Link
              to="/whitepaper"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-secondary hover:bg-secondary/80 transition-colors w-full sm:w-auto"
            >
              Read Our White Paper
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
