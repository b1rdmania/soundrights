
import React from 'react';

const SolutionSection = () => {
  const solutions = [
    {
      title: "Register Your Sound IP",
      description: "Create an immutable, on-chain record of your audio work."
    },
    {
      title: "Define Programmable Licenses",
      description: "Attach clear, specific, and machine-readable usage rights directly to your IP."
    },
    {
      title: "Enable Transparent Verification",
      description: "Allow anyone to instantly check the authoritative license of any SoundRights-registered audio."
    }
  ];

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">SoundRights: Clarity and Control, Powered by Story Protocol</h2>
          <p className="text-lg text-muted-foreground">
            SoundRights offers a new path forward. By leveraging Story Protocol, the decentralized IP infrastructure, we provide tools to:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {solutions.map((solution, index) => (
            <div 
              key={index} 
              className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow text-center card-hover"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>
              <h3 className="font-semibold text-xl mb-2">{solution.title}</h3>
              <p className="text-muted-foreground">{solution.description}</p>
            </div>
          ))}
        </div>
        
        {/* Simple flow diagram */}
        <div className="mt-16 max-w-4xl mx-auto px-4">
          <div className="bg-secondary/30 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
              <div className="flex-1">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="font-semibold">1</span>
                </div>
                <p className="font-medium">Creator uploads</p>
              </div>
              
              <div className="hidden md:block text-primary">→</div>
              <div className="md:hidden text-primary">↓</div>
              
              <div className="flex-1">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="font-semibold">2</span>
                </div>
                <p className="font-medium">Defines License on Story</p>
              </div>
              
              <div className="hidden md:block text-primary">→</div>
              <div className="md:hidden text-primary">↓</div>
              
              <div className="flex-1">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <span className="font-semibold">3</span>
                </div>
                <p className="font-medium">User Verifies on Story</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
