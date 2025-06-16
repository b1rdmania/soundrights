
import React from 'react';

const SolutionSection = () => {
  const solutions = [
    {
      title: "Timestamped IP Ownership",
      description: "Establish verifiable creation dates for future legal claims through blockchain registration."
    },
    {
      title: "Sync Royalty Management",
      description: "Centralized platform for managing catalog licensing with automated revenue tracking."
    },
    {
      title: "SDK Integration Tools",
      description: "Labels integrate SoundRights into existing websites for seamless payment processing."
    }
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">SoundRights: Label Infrastructure for Web3</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Comprehensive platform enabling independent labels to manage catalogs with blockchain-verified ownership:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
          {solutions.map((solution, index) => (
            <div 
              key={index} 
              className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow text-center card-hover"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl mb-2">{solution.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{solution.description}</p>
            </div>
          ))}
        </div>
        
        {/* SDK Integration Flow */}
        <div className="mt-10 sm:mt-16 max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 sm:p-6 rounded-lg border border-purple-200">
            <h3 className="text-center text-lg font-semibold mb-6 text-gray-800">SDK Integration Workflow</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-4 text-center">
              <div className="flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-blue-600 font-semibold">📁</span>
                </div>
                <p className="font-medium text-sm sm:text-base text-gray-700">Label Catalog Upload</p>
              </div>
              
              <div className="hidden md:block text-purple-500 text-2xl">⟶</div>
              <div className="md:hidden text-purple-500 text-2xl">⬇</div>
              
              <div className="flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-purple-600 font-semibold">⚡</span>
                </div>
                <p className="font-medium text-sm sm:text-base text-gray-700">SDK Embed on Website</p>
              </div>
              
              <div className="hidden md:block text-purple-500 text-2xl">⟶</div>
              <div className="md:hidden text-purple-500 text-2xl">⬇</div>
              
              <div className="flex-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-green-600 font-semibold">💰</span>
                </div>
                <p className="font-medium text-sm sm:text-base text-gray-700">Automated Licensing Revenue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
