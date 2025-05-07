
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhitePaper = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-6">SoundRights White Paper</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Dive deeper into the vision, technology, and implementation details of SoundRights. Our white paper 
                outlines the problem we're solving, our innovative solution leveraging Story Protocol, the features 
                of our MVP for the Surreal World Assets bounty, and our future roadmap.
              </p>
              
              <a 
                href="#" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors gap-2"
              >
                Download White Paper (PDF)
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
            
            {/* White Paper Preview/Contents Section */}
            <div className="border rounded-lg shadow-sm p-6 bg-card">
              <h2 className="text-2xl font-semibold mb-4">Contents</h2>
              
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Executive Summary</li>
                <li>The Problem: Sound IP in the Digital Age
                  <ul className="list-disc list-inside ml-5 mt-1">
                    <li>Current Licensing Limitations</li>
                    <li>Verification Challenges</li>
                    <li>The AI and Remix Revolution</li>
                  </ul>
                </li>
                <li>SoundRights: A Decentralized Solution
                  <ul className="list-disc list-inside ml-5 mt-1">
                    <li>Architecture Overview</li>
                    <li>Story Protocol Integration</li>
                    <li>Programmable IP Licenses (PILs)</li>
                  </ul>
                </li>
                <li>Technical Implementation
                  <ul className="list-disc list-inside ml-5 mt-1">
                    <li>IP Registration Flow</li>
                    <li>License Template Creation</li>
                    <li>Verification Mechanism</li>
                  </ul>
                </li>
                <li>MVP Features & Roadmap</li>
                <li>Use Cases & Market Opportunity</li>
                <li>Team & Vision</li>
                <li>References</li>
              </ol>
              
              <div className="mt-8 text-center">
                <p className="text-muted-foreground italic mb-4">
                  For the complete white paper with technical details, implementation roadmap, and market analysis, 
                  please download the PDF.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                  <a 
                    href="#" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors gap-2 w-full sm:w-auto"
                  >
                    Download White Paper
                    <ArrowDown className="w-4 h-4" />
                  </a>
                  
                  <Link
                    to="/upload"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-secondary hover:bg-secondary/80 transition-colors w-full sm:w-auto"
                  >
                    Try the Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WhitePaper;
