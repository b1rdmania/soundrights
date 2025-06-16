
import React from 'react';
import { AlertTriangle, Shuffle, TrendingDown, Lock } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      title: "No Timestamped Ownership",
      description: "Independent labels can't prove IP creation dates for future legal claims.",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
    {
      title: "Fragmented Licensing", 
      description: "Sync and advertising deals scattered across platforms with manual processes.",
      icon: Shuffle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      title: "Complex Royalty Management",
      description: "No centralized system for managing catalog licensing and revenue tracking.",
      icon: TrendingDown,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    },
    {
      title: "Web3 Technical Barriers",
      description: "Traditional labels locked out of blockchain benefits due to complexity.",
      icon: Lock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-red-50/50 via-orange-50/30 to-yellow-50/50 dark:from-red-950/20 dark:via-orange-950/10 dark:to-yellow-950/20">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Market Crisis
          </div>
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            The $42B Music Rights Challenge
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Independent labels control <span className="font-bold text-primary">43% of global music market</span> but lack tools for efficient rights management
          </p>
          
          {/* Stats visual */}
          <div className="flex justify-center mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border max-w-md">
              <div className="text-3xl font-bold text-red-600 mb-2">$42 Billion</div>
              <div className="text-sm text-muted-foreground">Annual music rights market</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" style={{width: '43%'}}></div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">43% controlled by independent labels</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <div 
                key={index} 
                className={`relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 ${problem.borderColor} hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}
              >
                {/* Icon with animated background */}
                <div className={`w-16 h-16 ${problem.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${problem.color}`} />
                </div>
                
                {/* Problem indicator */}
                <div className="absolute top-4 right-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                
                <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-gray-100">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
                
                {/* Visual emphasis line */}
                <div className={`h-1 ${problem.bgColor} rounded-full mt-6 group-hover:w-full w-1/3 transition-all duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom impact statement */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">
              The Result: Billions in Lost Revenue
            </div>
            <p className="text-muted-foreground">
              Without proper rights management infrastructure, independent labels lose millions annually to inefficient processes, disputes, and missed opportunities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
