
import React from 'react';

const ProblemSection = () => {
  const problems = [
    {
      title: "No Timestamped Ownership",
      description: "Independent labels can't prove IP creation dates for future legal claims."
    },
    {
      title: "Fragmented Licensing", 
      description: "Sync and advertising deals scattered across platforms with manual processes."
    },
    {
      title: "Complex Royalty Management",
      description: "No centralized system for managing catalog licensing and revenue tracking."
    },
    {
      title: "Web3 Technical Barriers",
      description: "Traditional labels locked out of blockchain benefits due to complexity."
    }
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The $42B Music Rights Challenge</h2>
          <p className="text-lg text-muted-foreground">
            Independent labels control 43% of global music market but lack tools for efficient rights management:
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
