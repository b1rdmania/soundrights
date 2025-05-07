
import React from 'react';
import { Fingerprint, Scroll, Search } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Fingerprint className="h-8 w-8 text-primary" />,
      title: "On-Chain IP Registration",
      description: "Easily upload your sound files. Our system helps generate rich metadata (with AI assistance!) and registers your work as an immutable IP Asset on the Story Protocol Testnet."
    },
    {
      icon: <Scroll className="h-8 w-8 text-primary" />,
      title: "Programmable Licensing",
      description: "Choose from clear Programmable IP License (PIL) templates (e.g., Non-Commercial Remix, Commercial Use) to define exactly how others can use your sound, attaching these rules directly to your on-chain IP."
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Transparent Verification",
      description: "Anyone can upload an audio file to verify its license. SoundRights matches it and displays the authoritative usage terms directly from the Story Protocol blockchain."
    }
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Discover the Core of SoundRights (MVP)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow card-hover"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="font-semibold text-xl mb-3 text-center">{feature.title}</h3>
              <p className="text-muted-foreground text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
