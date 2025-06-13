import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Play, ShoppingCart, Search, Filter, Star, Clock, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface License {
  id: string;
  trackTitle: string;
  artist: string;
  licenseType: 'sync' | 'mechanical' | 'performance' | 'master' | 'exclusive';
  price: number;
  duration?: string;
  usage: string[];
  audioUrl?: string;
  coverArt?: string;
  rating: number;
  verified: boolean;
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: licensesData, isLoading } = useQuery({
    queryKey: ['/api/marketplace/licenses', filterType, sortBy, searchQuery]
  });

  const activeLicenses: License[] = [
    {
      id: '1',
      trackTitle: 'Digital Dreams',
      artist: 'SynthWave Studios',
      licenseType: 'sync',
      price: 250,
      duration: '30 seconds',
      usage: ['Commercial', 'Film/TV', 'YouTube'],
      rating: 4.8,
      verified: true
    },
    {
      id: '2', 
      trackTitle: 'Urban Rhythm',
      artist: 'BeatMaker Pro',
      licenseType: 'mechanical',
      price: 150,
      usage: ['Streaming', 'Physical Sales', 'Digital Download'],
      rating: 4.6,
      verified: true
    },
    {
      id: '3',
      trackTitle: 'Ambient Journey',
      artist: 'Zen Productions',
      licenseType: 'performance',
      price: 300,
      usage: ['Live Events', 'Radio', 'Podcasts'],
      rating: 4.9,
      verified: false
    },
    {
      id: '4',
      trackTitle: 'Epic Orchestral',
      artist: 'Symphony Digital',
      licenseType: 'exclusive',
      price: 1500,
      usage: ['Full Rights', 'Commercial Use', 'Modification'],
      rating: 5.0,
      verified: true
    }
  ];

  const getLicenseTypeColor = (type: string) => {
    switch (type) {
      case 'sync': return 'bg-blue-100 text-blue-800';
      case 'mechanical': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'master': return 'bg-orange-100 text-orange-800';
      case 'exclusive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLicenses = activeLicenses.filter((license: License) => {
    const matchesSearch = license.trackTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         license.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || license.licenseType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Live Marketplace
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">Music Licensing</span>
            <span className="block text-purple-600 text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
              Marketplace
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and license original music for your projects. All tracks verified through our IP authentication system.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tracks, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="md:w-48 border-gray-300 focus:border-purple-500">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="License Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sync">Sync Rights</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="master">Master Rights</SelectItem>
                <SelectItem value="exclusive">Exclusive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="md:w-48 border-gray-300 focus:border-purple-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* License Types Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <h3 className="font-semibold text-blue-600">Sync Rights</h3>
            <p className="text-sm text-gray-600">Film, TV, commercials</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <h3 className="font-semibold text-green-600">Mechanical</h3>
            <p className="text-sm text-gray-600">Reproduction & distribution</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <h3 className="font-semibold text-purple-600">Performance</h3>
            <p className="text-sm text-gray-600">Live events, radio, streaming</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <h3 className="font-semibold text-orange-600">Master Rights</h3>
            <p className="text-sm text-gray-600">Original recording usage</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-200">
            <h3 className="font-semibold text-red-600">Exclusive</h3>
            <p className="text-sm text-gray-600">Full ownership transfer</p>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredLicenses.length} licenses
          </p>
        </div>

        {/* License Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLicenses.map((license: License) => (
            <Card key={license.id} className="hover:shadow-lg transition-shadow bg-white border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900">{license.trackTitle}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-600">
                      <Music className="w-4 h-4" />
                      {license.artist}
                      {license.verified && (
                        <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                          Verified
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{license.rating}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getLicenseTypeColor(license.licenseType)}>
                    {license.licenseType.charAt(0).toUpperCase() + license.licenseType.slice(1)} License
                  </Badge>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="font-bold text-gray-900">${license.price}</span>
                  </div>
                </div>

                {license.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {license.duration}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2 text-gray-900">Usage Rights:</p>
                  <div className="flex flex-wrap gap-1">
                    {license.usage.map((use: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    License
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLicenses.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No licenses found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}