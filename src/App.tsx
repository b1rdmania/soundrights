import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import About from "./pages/About";
import WhitePaper from "./pages/WhitePaper";
import Invest from "./pages/Invest";
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

const App = () => {
  console.log('App rendering...'); // Debug log

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <TooltipProvider>
            <Toaster position="top-right" />
            <Sonner />
            <Suspense fallback={<LoadingFallback />}>
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/whitepaper" element={<WhitePaper />} />
                  <Route path="/invest" element={<Invest />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </Suspense>
          </TooltipProvider>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
