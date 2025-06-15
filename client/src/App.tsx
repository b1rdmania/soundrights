import { queryClient } from "@/lib/queryClient";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from 'react-error-boundary';
import { WalletProvider } from "@/components/SafeWalletAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import About from "./pages/About";
import WhitePaper from "./pages/WhitePaper";
import Invest from "./pages/Invest";
import Demo from "./pages/Demo";
import LiveDemo from "./pages/LiveDemo";
import Sponsors from "./pages/Sponsors";
import Integrations from "./pages/Integrations";
import Marketplace from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Error boundary component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Reload page
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
              <Navbar />
              
              <main className="flex-grow">
                <AppRouter />
              </main>
              
              <Footer />
            </div>
          </TooltipProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </WalletProvider>
  );
};

export default App;