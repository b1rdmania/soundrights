import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResult from '@/components/SearchResult';
import { filterOptions, applyFilters } from '@/lib/music-utils';
import { ArrowUp, Filter, Music, Download, Play, Pause } from 'lucide-react';
import { SearchResultProps } from '@/components/SearchResult';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audio_url: string;
  download_url: string;
  license: string;
  tags: string[];
  mood: string;
  similarity: number;
}

interface ResultsData {
  track: {
    title: string;
    artist: string;
    duration: string;
    tags: string[];
    mood: string;
  };
  similar_tracks: Track[];
}

const Results: React.FC = () => {
  const [results, setResults] = useState<SearchResultProps[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResultProps[]>([]);
  const [selectedBpmRange, setSelectedBpmRange] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [playingTrack, setPlayingTrack] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get results from state passed during navigation
        const searchResults = location.state?.results;
        
        if (searchResults) {
          // Transform the results to match our SearchResultProps interface
          const transformedResults = searchResults.map((result: any) => ({
            id: result.id,
            title: result.name,
            artist: result.artist_name,
            imageUrl: result.image_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
            previewUrl: result.audio_url,
            licenseType: result.license_type || 'Free to Use',
            downloadUrl: result.download_url,
            bpm: result.bpm || 120,
            genre: result.tags?.[0] || 'Unknown',
            mood: result.mood || 'Unknown',
            similarity: result.similarity || 0.5,
          }));
          
          setResults(transformedResults);
          setFilteredResults(transformedResults);
        }
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
    
    // For back-to-top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);
  
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
  
  const handlePlay = (trackId: string, audioUrl: string) => {
    if (playingTrack === trackId) {
      audioRef.current?.pause();
    } else {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
    }
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };
  
  const resultsData = location.state?.results as ResultsData;
  
  if (!resultsData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-16">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">No Results Found</h1>
              <button
                onClick={() => navigate('/upload')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Similar Tracks Found</h1>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-2">{resultsData.track.title}</h2>
                <p className="text-muted-foreground mb-4">{resultsData.track.artist}</p>
                <div className="flex flex-wrap gap-2">
                  {resultsData.track.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Mood: {resultsData.track.mood}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Similar Tracks</h2>
              {resultsData.similar_tracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{track.title}</h3>
                      <p className="text-muted-foreground">{track.artist}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {track.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="mr-4">Mood: {track.mood}</span>
                        <span>Similarity: {(track.similarity * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePlay(track.id, track.audio_url)}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        {playingTrack === track.id ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </button>
                      <a
                        href={track.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
