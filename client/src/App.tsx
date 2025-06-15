
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

// Minimal test router to identify mounting issue
const TestHomePage = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">SoundRights</h1>
      <p className="text-xl text-gray-600 mb-8">Production Platform - Testing Mount</p>
      <div className="bg-green-100 p-4 rounded-lg">
        <p className="text-green-800 font-semibold">React App Successfully Mounted</p>
      </div>
    </div>
  </div>
);

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={TestHomePage} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <p>Page not found - <a href="/" className="text-purple-600">Go Home</a></p>
        </div>
      </Route>
    </Switch>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <AppRouter />
      </div>
    </QueryClientProvider>
  );
};

export default App;
