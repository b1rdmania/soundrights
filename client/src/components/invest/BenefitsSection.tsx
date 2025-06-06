
import React from 'react';

const BenefitsSection = () => {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">4</span> 
        Investor Benefits & Exit Potential
      </h2>
      
      <div className="space-y-3 mt-4">
        <div className="border-l-4 border-primary pl-4 py-1">
          <p><strong>🔹 Early Entry to a High-Growth Market</strong> – AI music search is an emerging industry.</p>
        </div>
        <div className="border-l-4 border-primary pl-4 py-1">
          <p><strong>🔹 Scalable Monetization Model</strong> – Freemium subscriptions, API sales, licensing partnerships.</p>
        </div>
        <div className="border-l-4 border-primary pl-4 py-1">
          <p><strong>🔹 Potential Acquisition Targets</strong> – Music licensing platforms, video production SaaS, AI search firms.</p>
        </div>
        <div className="border-l-4 border-primary pl-4 py-1">
          <p><strong>🔹 Exit Opportunities</strong> – Strategic buyout (B2B SaaS, AI music players) or further funding rounds in 12-18 months.</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
