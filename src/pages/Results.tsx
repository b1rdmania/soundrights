
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResult from '@/components/SearchResult';
import { getMockResults, filterOptions, applyFilters } from '@/lib/music-utils';
import { ArrowUp, Filter } from 'lucide-react';
import { SearchResultProps } from '@/components/SearchResult';

const Results = () => {
  const [results, setResults] = useState<SearchResultProps[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResultProps[]>([]);
  const [selectedBpmRange, setSelectedBpmRange] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Simulate loading results
    const mockResults = getMockResults();
    setResults(mockResults);
    setFilteredResults(mockResults);
    
    // For back-to-top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const filtered = applyFilters(
      results,
      selectedBpmRange,
      selectedGenre,
      selectedMood
    );
    setFilteredResults(filtered);
  }, [results, selectedBpmRange, selectedGenre, selectedMood]);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-10 animate-slide-up">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              We Found {filteredResults.length} Similar Tracks
            </h1>
            <p className="text-muted-foreground text-lg">
              Here are copyright-free music tracks that match your reference.
            </p>
          </div>
          
          <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center">
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors md:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
            
            <div className="hidden md:flex items-center flex-wrap gap-4">
              <div>
                <select
                  value={selectedBpmRange}
                  onChange={(e) => setSelectedBpmRange(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  {filterOptions.bpmRanges.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  {filterOptions.genres.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  {filterOptions.moods.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Link
              to="/upload"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Try Another Search
            </Link>
          </div>
          
          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden bg-white p-4 rounded-lg border mb-6 shadow-sm space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium">BPM Range</label>
                <select
                  value={selectedBpmRange}
                  onChange={(e) => setSelectedBpmRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  {filterOptions.bpmRanges.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  {filterOptions.genres.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mood</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                >
                  {filterOptions.moods.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result, index) => (
              <div key={result.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <SearchResult {...result} />
              </div>
            ))}
          </div>
          
          {filteredResults.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No results found with the selected filters. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </main>
      
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/20 animate-slide-up"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
      
      <Footer />
    </div>
  );
};

export default Results;
