
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from "@/components/ui/table";

const ValuationSection = () => {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span> 
        Proposed Valuation
      </h2>
      <p className="text-lg">
        Given the current stage, technology stack, and market opportunity, we propose a <strong>valuation of $2.5M - $3.5M post-money</strong>, depending on investor appetite and market conditions.
      </p>
      
      <div className="rounded-lg border overflow-hidden mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Metric</TableHead>
              <TableHead>Consideration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Market Opportunity</TableCell>
              <TableCell>Growing demand for <strong>AI-driven music discovery</strong> and <strong>content-safe music solutions</strong>.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Competitive Edge</TableCell>
              <TableCell>AI-powered deep music matching (chord structure, instrumentation, and timbre-based search).</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Tech Development Stage</TableCell>
              <TableCell>Feasible MVP with existing tools (Spotify API, FAISS, Librosa).</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Scalability</TableCell>
              <TableCell>Monetization potential through SaaS subscriptions, licensing partnerships, and API sales.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Pre-MVP Status</TableCell>
              <TableCell>Still in development; valuation aligns with standard pre-seed expectations.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <p className="mt-4 text-muted-foreground">
        ⏳ <strong>Investment terms to be finalized</strong> based on early discussions with angel investors and pre-seed funds.
      </p>
    </section>
  );
};

export default ValuationSection;
