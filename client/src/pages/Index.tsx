
import React from 'react';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import StoryProtocolSection from '@/components/StoryProtocolSection';
import WalletConnectSection from '@/components/WalletConnectSection';
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
        <WalletConnectSection />
        <CtaSection />
      </main>
    </div>
  );
};

export default Index;
