import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchResult from '@/components/SearchResult';
import { filterOptions, applyFilters } from '@/lib/music-utils';
import { ArrowUp, Filter, Music, Download, Play, Pause } from 'lucide-react';
import { SearchResultProps } from '@/components/SearchResult';
import { toast } from 'react-hot-toast';

// Interface for props passed to AnalyzingDisplay
interface AnalyzingDisplayProps {
  title: string;
  artist: string;
}

// New component for the "Analyzing" display
const AnalyzingDisplay: React.FC<AnalyzingDisplayProps> = ({ title, artist }) => {
  // Dynamically generate lines using props
  const lines = [
    `> Initializing SoundMatch Analysis Core v3.1... OK`,
    `> Target Locked: ${artist} - ${title}`,
    `> Engaging Musixmatch API [matcher.track.get]... Match verified.`,
    `> Searching MusicBrainz Identifier Index...`,
    // Simulate MBID/AcousticBrainz step (might or might not happen)
    Math.random() > 0.3 
      ? `> MBID Located. Querying AcousticBrainz [high-level]... Features acquired (BPM/Key).` 
      : `> MBID Lookup Failed/Skipped. Proceeding with metadata only...`,
    `> Initializing Gemini Language Model [gemini-1.5-flash]... Ready.`,
    `> Generating Sonic Description & Keyword Matrix... AI analysis complete.`,
    `> Cross-Referencing Jamendo Royalty-Free Database [fuzzytags]...`,
    `> Compiling Results Vector... DONE`,
    `> Displaying Output...`
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
    }, 300);

    const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
    }, 500);

    return () => {
        clearInterval(intervalId);
        clearInterval(cursorInterval);
    };
  }, [lines]);

  return (
    <div className="font-mono text-sm text-muted-foreground bg-card p-4 rounded-md shadow-lg border min-h-[220px]">
      {displayedLines.map((line, i) => (
        <p key={i}>{line}</p>
      ))}
      {showCursor && <span className="animate-pulse text-primary">_</span>}
    </div>
  );
};

// Helper to format time (seconds) as MM:SS
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
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
  musicbrainz_data?: { // ADD MusicBrainz data
      mbid?: string;
      match_score?: number;
      tags?: string[];
      // Add other potential MB fields if fetched later
      [key: string]: any; 
  } | null;
  source_track?: { // From text search (Musixmatch)
    title: string;
    artist: string;
    genres?: string[];
    rating?: number;
    explicit?: boolean;
    instrumental?: boolean; // Added this based on Musixmatch parser
    musixmatch_id?: number; // Added this based on Musixmatch parser
    commontrack_id?: number; // Added this based on Musixmatch parser
    album?: string; // Added this based on Musixmatch parser
    updated_time?: string; // Added this based on Musixmatch parser
    // Add other fields from Musixmatch if needed
  } | null;
  recognized_track?: { // From file upload (Shazam)
    title: string;
    subtitle?: string; // Artist is often here
    key?: string; // Shazam key
    explicit?: boolean; // Added to satisfy type checker
    instrumental?: boolean; // Added to satisfy type checker
    // Add other fields from Shazam if needed
  } | null;
  analysis?: { // From Gemini
    description: string;
    keywords: string[];
  } | null;
  similar_tracks: Track[];
}

const Results: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [playingTrack, setPlayingTrack] = React.useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  // New state for seek bar
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<number>(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Simulate analysis delay
    const analysisTimeout = setTimeout(() => {
        setIsAnalyzing(false);
    }, 3500); // New increased delay (3.5 seconds)

    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(analysisTimeout); // Clear timeout on unmount
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Effect to handle audio cleanup when track changes or component unmounts
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handlePlay = (trackId: string, audioUrl: string) => {
    if (playingTrack === trackId) {
      audioRef.current?.pause();
      setPlayingTrack(null);
    } else {
      // Stop currently playing track if any
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Create new audio element
      audioRef.current = new Audio(audioUrl);
      setPlayingTrack(trackId);
      setCurrentTime(0);
      setDuration(0);

      // Add listeners for seek bar
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
       audioRef.current.addEventListener('ended', () => {
         setPlayingTrack(null); // Reset button when track ends
         setCurrentTime(0);
       });

      audioRef.current.play().catch(e => {
        console.error("Error playing audio:", e);
        toast.error(`Error playing track: ${e.message}`)
        setPlayingTrack(null); // Reset state on error
      });
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(event.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const resultsData = location.state?.results as ResultsData | undefined;
  const sourceTrack = resultsData?.source_track || resultsData?.recognized_track;
  const similarTracks = resultsData?.similar_tracks || [];
  const analysis = resultsData?.analysis;
  const musicbrainz_data = resultsData?.musicbrainz_data;

  // Determine display title/artist *before* the return statement
  const displayTitle = sourceTrack?.title || 'Unknown Title';
  const displayArtist = resultsData?.source_track?.artist || resultsData?.recognized_track?.subtitle || 'Unknown Artist';

  // --- Conditional Rendering Logic ---

  // 1. If analyzing, show the hacker display, passing title/artist
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-28 pb-16 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-2xl">
             <AnalyzingDisplay title={displayTitle} artist={displayArtist} />
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
                    <p className="text-muted-foreground italic text-sm">{analysis.description}</p>
                  </div>
                )}
                {/* --- Display AcousticBrainz & Musixmatch Details --- */}
                {(musicbrainz_data || sourceTrack?.explicit !== undefined || sourceTrack?.instrumental !== undefined) && (
                    <div className="mt-4 pt-4 border-t border-muted text-xs text-muted-foreground space-y-1">
                         <h4 className="font-semibold text-sm mb-1 text-foreground">Track Details:</h4>
                         {musicbrainz_data?.mbid && (
                             <p><span className="font-medium">MBID:</span> {musicbrainz_data.mbid}</p>
                         )}
                         {musicbrainz_data?.match_score && (
                             <p><span className="font-medium">Match Score:</span> {musicbrainz_data.match_score}</p>
                         )}
                         {sourceTrack?.explicit !== undefined && (
                             <p><span className="font-medium">Explicit:</span> {sourceTrack.explicit ? 'Yes' : 'No'}</p>
                         )}
                         {sourceTrack?.instrumental !== undefined && (
                              <p><span className="font-medium">Instrumental:</span> {sourceTrack.instrumental ? 'Yes' : 'No'}</p>
                         )}
                         {/* Add Musixmatch Rating if desired */}
                         {/* {sourceTrack?.rating !== undefined && (
                              <p><span className="font-medium">Musixmatch Rating:</span> {sourceTrack.rating}/100</p>
                         )} */}
                    </div>
                )}
              </div>
            </div>
            
            {/* --- Technical Details Section --- */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
                <div className="bg-white rounded-lg p-4 shadow-sm border text-xs text-muted-foreground font-mono">
                    <h4 className="font-semibold text-sm mb-2 text-foreground">Musixmatch Data:</h4>
                    {sourceTrack ? (
                        <pre className="overflow-x-auto bg-gray-50 p-2 rounded text-xs">{JSON.stringify(sourceTrack, null, 2)}</pre>
                    ) : <p>N/A</p>}
                    
                    <h4 className="font-semibold text-sm mt-3 mb-2 text-foreground">MusicBrainz Data:</h4>
                    {musicbrainz_data ? (
                         <pre className="overflow-x-auto bg-gray-50 p-2 rounded text-xs">{JSON.stringify(musicbrainz_data, null, 2)}</pre>
                    ) : <p>N/A</p>}
                </div>
            </div>
            
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
              <h2 className="text-2xl font-semibold mb-2">Similar Royalty-Free Tracks (from Jamendo)</h2>
              {/* Display Keywords Used */} 
              {analysis?.keywords && analysis.keywords.length > 0 && (
                  <div className="mb-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Keywords used:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.keywords.map((kw, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-mono">{kw}</span>
                          ))}
                      </div>
                  </div>
              )}
              
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
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0"> {/* Container for controls */} 
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
                          {/* --- Seek Bar --- */}
                          {playingTrack === track.id && (
                            <div className="flex items-center space-x-2 w-full md:w-auto">
                                <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
                                <input 
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700 accent-primary"
                                />
                                <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
                            </div>
                          )}
                          {/* --- Download Button --- */}
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
