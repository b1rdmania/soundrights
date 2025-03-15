
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import AudioPlayer from '@/components/AudioPlayer';
import OverviewSection from '@/components/invest/OverviewSection';
import ValuationSection from '@/components/invest/ValuationSection';
import FundingSection from '@/components/invest/FundingSection';
import BenefitsSection from '@/components/invest/BenefitsSection';
import NextStepsSection from '@/components/invest/NextStepsSection';
import { Toaster } from '@/components/ui/toaster';

const Invest = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-bold tracking-tight mb-4">SoundMatch AI – Investment Opportunity</h1>
            <Separator className="my-4" />
          </div>

          {/* Audio Player */}
          <AudioPlayer 
            audioUrl="https://suno.com/embed/song/f24fb581-f86a-4dc9-b4ff-38cf411680e6" 
            title="Play while reading our pitch"
          />

          {/* Investment Sections */}
          <OverviewSection />
          <ValuationSection />
          <FundingSection />
          <BenefitsSection />
          <NextStepsSection />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Invest;
