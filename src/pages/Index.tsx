
import React from 'react';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import StoryProtocolSection from '@/components/StoryProtocolSection';
import CtaSection from '@/components/CtaSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <StoryProtocolSection />
        <CtaSection />
      </main>
    </div>
  );
};

export default Index;
