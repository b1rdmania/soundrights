
import { Switch, Route } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from 'react-error-boundary';
import { WalletProvider } from "@/components/WalletAuth";
import MobileDetector from "@/components/MobileDetector";
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
// Dashboard removed for MVP - focusing on demo functionality
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
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

// Loading component
const LoadingFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      {/* Dashboard removed for MVP - focusing on demo and integrations functionality */}
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
            <MobileDetector>
              <div className="flex flex-col min-h-screen">
                <Toaster position="top-right" />
                <Sonner />
                <Navbar />
                
                <main className="flex-grow">
                  <AppRouter />
                </main>
                
                <Footer />
              </div>
            </MobileDetector>
          </TooltipProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </WalletProvider>
  );
};

export default App;
