
import React from 'react';
import { Button } from '@/components/ui/button';

const NextStepsSection = () => {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">5</span> 
        Next Steps
      </h2>
      
      <div className="space-y-3 mt-4">
        <div className="border-l-4 border-primary pl-4 py-1">
          <p><strong>💰 Investor Outreach Begins Q1 2025</strong> – Preparing materials & early discussions.</p>
        </div>
        <div className="border-l-4 border-primary pl-4 py-1">
          <p><strong>🛠 MVP Launch in Q2 2025</strong> – Showcasing AI-driven music discovery in action.</p>
        </div>
        <div className="border-l-4 border-primary pl-4 py-1">
          <p><strong>📢 Brand Development & Go-To-Market in Q3 2025</strong> – Building visibility & traction.</p>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg mt-6 text-center">
        <p className="text-lg font-medium">📩 Interested investors can contact us for further discussions.</p>
        <Button variant="outline" className="mt-3">
          Contact Us
        </Button>
      </div>
    </section>
  );
};

export default NextStepsSection;
