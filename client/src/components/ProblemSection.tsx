
import React from 'react';

const ProblemSection = () => {
  const problems = [
    {
      title: "Limited Control",
      description: "Standard licenses don't allow for nuanced, creator-defined usage terms."
    },
    {
      title: "Verification Headaches",
      description: "It's hard to prove or check the true license of a sound file."
    },
    {
      title: "Complex Licensing",
      description: "Custom deals are manual, slow, and often opaque."
    },
    {
      title: "An Opaque Future",
      description: "How do we manage rights clearly in an age of remixes and AI-generated content?"
    }
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The Problem: Lost Control, Unclear Rights</h2>
          <p className="text-lg text-muted-foreground">
            In today's digital world, musicians and sound creators often struggle with:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow card-hover"
            >
              <h3 className="font-semibold text-xl mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
