import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Music, Clock, Shield, Zap, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner, EmptyState } from '@/components/ErrorHandler';
import { debounce } from 'lodash';

interface SearchFilters {
  genre?: string;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'title' | 'artist';
  verified?: boolean;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;
  status: string;
  yakoaTokenId?: string;
  storyProtocolIpId?: string;
  createdAt: string;
  audioUrl?: string;
}

export default function TrackSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((query: string, filters: SearchFilters) => {
      // Trigger search
    }, 300),
    []
  );

  const { data: tracks = [], isLoading, error } = useQuery({
    queryKey: ['/api/tracks/search', searchQuery, filters],
    enabled: searchQuery.length > 0 || Object.keys(filters).length > 0,
    retry: false,
  });

  const { data: popularTracks = [] } = useQuery({
    queryKey: ['/api/tracks/popular'],
    retry: false,
  });

  const { data: recentTracks = [] } = useQuery({
    queryKey: ['/api/tracks/recent'],
    retry: false,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedSearch(searchQuery, newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setShowFilters(false);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Shield className="w-4 h-4 text-green-600" />;
      case 'registered':
        return <Zap className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const TrackCard: React.FC<{ track: Track }> = ({ track }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{track.title}</h3>
              <p className="text-gray-600 truncate">{track.artist}</p>
              {track.album && (
                <p className="text-sm text-gray-500 truncate">{track.album}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {track.duration && (
              <span className="text-sm text-gray-500">
                {formatDuration(track.duration)}
              </span>
            )}
            
            <div className="flex items-center gap-1">
              {getStatusIcon(track.status)}
              <Badge className={getStatusColor(track.status)}>
                {track.status}
              </Badge>
            </div>
            
            {track.yakoaTokenId && (
              <Badge variant="outline" className="text-xs">
                Yakoa
              </Badge>
            )}
            
            {track.storyProtocolIpId && (
              <Badge variant="outline" className="text-xs">
                Story
              </Badge>
            )}
          </div>
        </div>
        
        {track.genre && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              {track.genre}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Music</h1>
        <p className="text-gray-600">Search through verified tracks and IP assets</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search tracks, artists, or albums..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-12 h-12 text-lg"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Genre
                </label>
                <Select
                  value={filters.genre || ''}
                  onValueChange={(value) => handleFilterChange('genre', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All genres</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="hip-hop">Hip Hop</SelectItem>
                    <SelectItem value="electronic">Electronic</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sort by
                </label>
                <Select
                  value={filters.sortBy || 'newest'}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="artist">Artist A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant={filters.verified ? "default" : "outline"}
                  onClick={() => handleFilterChange('verified', !filters.verified)}
                  className="w-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Verified Only
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Results for "{searchQuery}"
          </h2>
          {isLoading ? (
            <LoadingSpinner message="Searching tracks..." />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error searching tracks</p>
            </div>
          ) : tracks.length === 0 ? (
            <EmptyState
              icon={Music}
              title="No tracks found"
              description="Try adjusting your search terms or filters"
            />
          ) : (
            <div className="space-y-3">
              {tracks.map((track: Track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popular Tracks */}
      {!searchQuery && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Tracks</h2>
          {popularTracks.length === 0 ? (
            <EmptyState
              icon={Music}
              title="No popular tracks yet"
              description="Be the first to upload and verify your music"
              actionLabel="Upload Track"
              actionHref="/upload"
            />
          ) : (
            <div className="grid gap-3">
              {popularTracks.slice(0, 5).map((track: Track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Tracks */}
      {!searchQuery && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Added</h2>
          {recentTracks.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No recent tracks"
              description="Check back later for newly uploaded music"
            />
          ) : (
            <div className="grid gap-3">
              {recentTracks.slice(0, 5).map((track: Track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}