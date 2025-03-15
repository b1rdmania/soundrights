
import React from 'react';
import { Upload, Zap, Music } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: "Upload Your Reference",
    description: "Upload a song or paste a Spotify/YouTube link to start the process.",
    icon: Upload,
  },
  {
    number: 2,
    title: "AI Analysis",
    description: "Our AI analyzes the music features, identifying key characteristics.",
    icon: Zap,
  },
  {
    number: 3,
    title: "Get Similar Tracks",
    description: "Receive a list of copyright-free music that matches your reference.",
    icon: Music,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-3">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI-powered platform makes finding the perfect copyright-free music simple.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="relative flex flex-col items-center text-center bg-background p-8 rounded-xl border shadow-sm card-hover"
            >
              <div className="absolute -top-5 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {step.number}
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-muted z-0" />
              )}
              
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-5 mt-3">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
