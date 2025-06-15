
import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from 'react-error-boundary';
import { WalletProvider } from "@/components/SafeWalletAuth";
import SafeNavbar from "@/components/SafeNavbar";
import SafeFooter from "@/components/SafeFooter";
// Temporarily using minimal imports to identify mounting issue
import React from 'react';

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/upload" component={Upload} />
      <Route path="/demo" component={Demo} />
      <Route path="/live-demo" component={LiveDemo} />
      <Route path="/sponsors" component={Sponsors} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/profile" component={Profile} />
      <Route path="/results" component={Results} />
      <Route path="/about" component={About} />
      <Route path="/whitepaper" component={WhitePaper} />
      <Route path="/invest" component={Invest} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

const App = () => {
  return (
    <WalletProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Toaster position="top-right" />
              <Sonner />
              <SafeNavbar />
              
              <main className="flex-grow">
                <AppRouter />
              </main>
              
              <SafeFooter />
            </div>
          </TooltipProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </WalletProvider>
  );
};

export default App;
