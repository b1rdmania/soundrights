import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResult from '@/components/SearchResult';
import { filterOptions, applyFilters } from '@/lib/music-utils';
import { ArrowUp, Filter, Music, Download, Play, Pause } from 'lucide-react';
import { SearchResultProps } from '@/components/SearchResult';

// New component for the "Analyzing" display
const AnalyzingDisplay: React.FC = () => {
  const lines = [
    '> Accessing Musixmatch Data... ✓',
    '> Initiating Gemini Analysis Protocol...',
    '> Generating Sonic Fingerprint...',
    '> Cross-referencing Jamendo Database...',
    '> Compiling Results...',
  ];
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < lines.length) {
        setDisplayedLines((prev) => [...prev, lines[index]]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 350); // Adjust timing as needed

    const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
    }, 500); // Blinking cursor speed

    return () => {
        clearInterval(intervalId);
        clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="font-mono text-sm text-green-400 bg-black p-4 rounded-md shadow-lg min-h-[150px]">
      {displayedLines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      {showCursor && <span className="animate-pulse">_</span>}
    </div>
  );
};

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
  image_url?: string;
}

interface ResultsData {
  source_track?: { // From text search (Musixmatch)
    title: string;
    artist: string;
    genres?: string[];
    rating?: number;
    explicit?: boolean;
    // Add other fields from Musixmatch if needed
  };
  recognized_track?: { // From file upload (Shazam)
    title: string;
    subtitle?: string; // Artist is often here
    // Add other fields from Shazam if needed
  };
  analysis?: { // From Gemini
    description: string;
    keywords: string[];
  };
  similar_tracks: Track[];
  // Removed the mandatory top-level 'track' field
}

const Results: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [playingTrack, setPlayingTrack] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Simulate analysis delay
    const analysisTimeout = setTimeout(() => {
        setIsAnalyzing(false);
    }, 2500); // Adjust delay (in milliseconds) as desired

    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(analysisTimeout); // Clear timeout on unmount
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePlay = (trackId: string, audioUrl: string) => {
    if (playingTrack === trackId) {
      audioRef.current?.pause();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };
  
  const resultsData = location.state?.results as ResultsData | undefined;
  const sourceTrack = resultsData?.source_track || resultsData?.recognized_track;
  const similarTracks = resultsData?.similar_tracks || [];
  const analysis = resultsData?.analysis;

  // --- Conditional Rendering Logic ---

  // 1. If analyzing, show the hacker display
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-16 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-2xl">
             <AnalyzingDisplay />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 2. If analysis done, but no results/source track, show "Not Found"
  if (!resultsData || !sourceTrack) {
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

  // 3. If analysis done and results exist, show the results
  const displayTitle = sourceTrack?.title || 'Unknown Title';
  const displayArtist = resultsData?.source_track?.artist || resultsData?.recognized_track?.subtitle || 'Unknown Artist';
  const displayTags = resultsData?.source_track?.genres || analysis?.keywords || [];
  
  // Construct external search URLs
  const searchTerm = encodeURIComponent(`${displayArtist} ${displayTitle}`);
  const wikipediaSearchUrl = `https://en.wikipedia.org/w/index.php?search=${searchTerm}`;
  const discogsSearchUrl = `https://www.discogs.com/search/?q=${searchTerm}&type=all`;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Source Track</h1>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-semibold mb-2">{displayTitle}</h2>
                <p className="text-muted-foreground mb-4">{displayArtist}</p>
                {displayTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {displayTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {analysis?.description && (
                  <div className="mt-4 pt-4 border-t border-muted">
                    <h3 className="text-lg font-semibold mb-2">AI Analysis:</h3>
                    <p className="text-muted-foreground italic">{analysis.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* --- New External Links Section --- */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Find out more</h2>
                <div className="bg-white rounded-lg p-4 shadow-sm border flex items-center space-x-4">
                    <a 
                        href={wikipediaSearchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Search on Wikipedia
                    </a>
                    <span className="text-gray-300">|</span>
                    <a 
                        href={discogsSearchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Search on Discogs
                    </a>
                </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Similar Royalty-Free Tracks (from Jamendo)</h2>
              {similarTracks.length > 0 ? (
                similarTracks.map((track) => (
                  <div
                    key={track.id}
                    className="bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 flex space-x-4 items-center"
                  >
                    {track.image_url && (
                        <img 
                            src={track.image_url} 
                            alt={`${track.title} artwork`} 
                            className="w-16 h-16 rounded-md object-cover flex-shrink-0 shadow-sm"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          <h3 className="font-semibold truncate">{track.title}</h3>
                          <p className="text-muted-foreground text-sm truncate">{track.artist}</p>
                          {track.tags && track.tags.length > 0 && (
                             <div className="flex flex-wrap gap-1 mt-2">
                               {track.tags.slice(0, 5).map((tag, index) => (
                                 <span
                                   key={index}
                                   className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs"
                                 >
                                   {tag}
                                 </span>
                               ))}
                             </div>
                          )}
                          <p className="mt-2 text-xs text-muted-foreground">License: {track.license}</p>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <button
                            onClick={() => handlePlay(track.id, track.audio_url)}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                            title={playingTrack === track.id ? "Pause" : "Play"}
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
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                            title="Download"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                 <p className="text-muted-foreground">No similar tracks found on Jamendo based on the analysis.</p>
              )}
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
