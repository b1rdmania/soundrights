
import React from 'react';

const ProblemSection = () => {
  const problems = [
    {
      title: "Rights Fragmentation",
      description: "Music IP scattered across platforms with no unified ownership proof."
    },
    {
      title: "Licensing Bottlenecks", 
      description: "Sync deals take months through intermediaries charging 30-50% fees."
    },
    {
      title: "Originality Disputes",
      description: "No reliable way to prove creation date or verify authenticity."
    },
    {
      title: "Revenue Leakage",
      description: "Complex royalty chains where creators lose track of their earnings."
    }
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The Problem: Lost Control, Unclear Rights</h2>
          <p className="text-lg text-muted-foreground">
            Independent labels face billion-dollar inefficiencies in music rights management:
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
