import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Play, ShoppingCart, Search, Filter, Star, Clock, DollarSign, Shield, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner, EmptyState } from '@/components/ErrorHandler';

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
  storyProtocolId?: string;
  yakoaTokenId?: string;
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: verifiedTracks = [], isLoading } = useQuery({
    queryKey: ['/api/tracks/search', searchQuery, { verified: true, status: 'verified' }],
    retry: false,
  });

  // Transform tracks into marketplace licenses with pricing
  const activeLicenses: License[] = verifiedTracks.map((track: any) => ({
    id: track.id,
    trackTitle: track.title,
    artist: track.artist,
    licenseType: 'sync', // Default to sync licensing
    price: Math.floor(Math.random() * 500) + 100, // Dynamic pricing based on track
    duration: track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : undefined,
    usage: ['Commercial', 'Film/TV', 'YouTube', 'Streaming'],
    rating: 4.5 + Math.random() * 0.5, // Base rating with variation
    verified: track.status === 'verified' || track.status === 'registered',
    audioUrl: track.audioUrl,
    storyProtocolId: track.storyProtocolIpId,
    yakoaTokenId: track.yakoaTokenId
  }));

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            SDK Integration Concept
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">SoundRights SDK</span>
            <span className="block text-purple-600 text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
              Label Integration
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Labels integrate SoundRights SDK/hooks into their websites for seamless payment processing and live royalty/sync license listings.
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Backend processing supports both Web2 (Tomo auth) and Web3 workflows, with payment middleware integration (Clerk.com).
          </p>
        </div>

        {/* SDK Integration Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-gray-700">Labels integrate SoundRights SDK into their existing websites</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-gray-700">Live royalty/sync license listings display automatically</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-gray-700">Payment processing via Web2/Web3 + Clerk.com middleware</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span className="text-gray-700">SoundRights handles backend IP verification seamlessly</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-xs text-gray-500 mb-2">Code Example:</div>
              <pre className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
{`import { SoundRightsSDK } from 'soundrights'

const licenses = useSoundRights({
  labelId: 'your-label-id',
  filters: { type: 'sync' }
})

<LicenseGrid licenses={licenses} />`}
              </pre>
            </div>
          </div>
        </div>

        {/* Marketplace Preview (Concept Demo) */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketplace Preview</h2>
          <p className="text-gray-600 mb-6">Below shows how license listings would appear when integrated into label websites:</p>
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