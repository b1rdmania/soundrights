
import React from 'react';

const OverviewSection = () => {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span> 
        Overview
      </h2>
      <p className="text-lg">
        SoundMatch AI is raising a <strong>$250K pre-seed round</strong> to fund the <strong>development and branding</strong> of its AI-powered music similarity search platform in <strong>Q2 2025</strong>.
      </p>
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-md font-semibold mb-2">🎯 Goal</h3>
          <p>Build a working MVP, refine AI matching accuracy, expand indexed music libraries, and establish brand presence.</p>
        </div>
        <div className="rounded-lg border p-4 bg-card">
          <h3 className="text-md font-semibold mb-2">🚀 Use of Funds</h3>
          <p>Technology development, API integrations, infrastructure scaling, UX/UI enhancements, and early marketing efforts.</p>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
