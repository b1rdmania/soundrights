
import React from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import UseCases from '@/components/UseCases';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <UseCases />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
