
import React from 'react';
import { Monitor, Gamepad, MessageSquare, Headphones } from 'lucide-react';

const useCases = [
  {
    icon: Monitor,
    title: "Content Creators",
    description: "Find the perfect background music for your videos without copyright concerns."
  },
  {
    icon: Gamepad,
    title: "Streamers",
    description: "Stream with music that matches your vibe without worrying about DMCA strikes."
  },
  {
    icon: MessageSquare,
    title: "Marketers",
    description: "Create engaging marketing content with music that resonates with your audience."
  },
  {
    icon: Headphones,
    title: "Game Developers",
    description: "Discover soundtrack options for your games that match popular music styles."
  }
];

const UseCases = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Perfect For</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            SoundMatch AI helps creators across multiple platforms find the perfect music.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <useCase.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{useCase.title}</h3>
              <p className="text-muted-foreground text-sm">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
