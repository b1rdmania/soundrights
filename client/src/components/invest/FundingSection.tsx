
import React from 'react';

const FundingSection = () => {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span> 
        Funding Breakdown ($250K Allocation)
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-md font-semibold mb-2">📌 Tech Development (50%)</h3>
          <p>AI model refinement, FAISS optimization, API integration.</p>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-md font-semibold mb-2">📌 Branding & Marketing (20%)</h3>
          <p>Positioning, community engagement, early outreach.</p>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-md font-semibold mb-2">📌 Infrastructure & Hosting (15%)</h3>
          <p>Cloud deployment (AWS/GCP), scaling storage.</p>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-md font-semibold mb-2">📌 Team Expansion (15%)</h3>
          <p>Hiring core technical & marketing talent.</p>
        </div>
      </div>
    </section>
  );
};

export default FundingSection;
