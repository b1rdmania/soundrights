import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import About from "./pages/About";
import WhitePaper from "./pages/WhitePaper";
import Invest from "./pages/Invest";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <TooltipProvider>
          <Toaster position="top-right" />
          <Sonner />
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
        </TooltipProvider>
      </div>
    </Router>
  );
};

export default App;
