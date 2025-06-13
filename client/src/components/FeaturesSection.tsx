
import React from 'react';
import { Fingerprint, Scroll, Search } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Fingerprint className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />,
      title: "Instant Ownership Proof",
      description: "Upload tracks to mint NFTs with immutable timestamps. Your music, your proof, forever."
    },
    {
      icon: <Scroll className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />,
      title: "Smart License Automation",
      description: "Pre-built contracts for sync, streaming, and commercial use. Set rates, collect royalties automatically."
    },
    {
      icon: <Search className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />,
      title: "AI Originality Engine",
      description: "Real-time scanning detects copyright conflicts before registration. Protect your catalog proactively."
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Built for Independent Labels</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card p-5 sm:p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow card-hover"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="font-semibold text-lg sm:text-xl mb-3 text-center">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
