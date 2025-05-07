
import React from 'react';

const StoryProtocolSection = () => {
  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">The Power of Decentralized IP</h2>
          
          <div className="mb-6 flex justify-center">
            {/* Story Protocol logo placeholder - replace with actual logo */}
            <div className="bg-secondary/50 rounded-lg px-6 py-3 inline-block">
              <span className="font-bold text-xl">Story Protocol</span>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground mb-8">
            SoundRights is proudly built using Story Protocol, a Layer 1 blockchain designed to be the native IP infrastructure of the internet. 
            This allows us to provide unprecedented transparency, security, and creator control for sound assets.
          </p>
          
          <a 
            href="https://story.xyz" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-secondary hover:bg-secondary/80 transition-colors"
          >
            Learn more about Story Protocol
          </a>
        </div>
      </div>
    </section>
  );
};

export default StoryProtocolSection;
