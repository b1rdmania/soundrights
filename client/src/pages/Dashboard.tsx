import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Music, Upload, Shield, Zap, TrendingUp, Clock, CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import WalletPortfolio from '@/components/WalletPortfolio';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  uploadedAt: string;
  status: 'processing' | 'verified' | 'registered' | 'failed';
  ipAssetId?: string;
  yakoaTokenId?: string;
  storyTxHash?: string;
}

interface IPAsset {
  id: string;
  trackId: string;
  storyIpId: string;
  status: string;
  txHash?: string;
  createdAt: string;
}

interface DashboardStats {
  totalTracks: number;
  verifiedTracks: number;
  registeredAssets: number;
  totalValue: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tracks' | 'assets'>('overview');

  // Fetch user tracks
  const { data: tracks = [], isLoading: tracksLoading } = useQuery({
    queryKey: ['/api/tracks'],
    retry: false,
  });

  // Fetch IP assets
  const { data: ipAssets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['/api/ip-assets'],
    retry: false,
  });

  // Calculate dashboard stats
  const stats: DashboardStats = {
    totalTracks: tracks.length,
    verifiedTracks: tracks.filter((t: Track) => t.status === 'verified' || t.status === 'registered').length,
    registeredAssets: ipAssets.length,
    totalValue: tracks.length * 250, // Estimated value per track
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'registered':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your music IP portfolio</p>
          </div>
          <div className="flex gap-3">
            <Link href="/upload">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Track
              </Button>
            </Link>
            <Link href="/live-demo">
              <Button variant="outline">
                <Music className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tracks">My Tracks</TabsTrigger>
            <TabsTrigger value="assets">IP Assets</TabsTrigger>
            <TabsTrigger value="portfolio">
              <Wallet className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTracks}</p>
                    </div>
                    <Music className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Verified Tracks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.verifiedTracks}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">IP Assets</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.registeredAssets}</p>
                    </div>
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'tracks', label: 'My Tracks', icon: Music },
              { key: 'assets', label: 'IP Assets', icon: Shield },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {tracks.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks uploaded yet</h3>
                    <p className="text-gray-600 mb-4">Start building your music IP portfolio</p>
                    <Link href="/upload">
                      <Button>Upload Your First Track</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tracks.slice(0, 5).map((track: Track) => (
                      <div key={track.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(track.status)}
                          <div>
                            <p className="font-medium text-gray-900">{track.title}</p>
                            <p className="text-sm text-gray-600">{track.artist}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(track.status)}>
                          {track.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="space-y-4">
            {tracksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading tracks...</p>
              </div>
            ) : tracks.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No tracks found</h3>
                  <p className="text-gray-600 mb-6">Upload your first music track to get started</p>
                  <Link href="/upload">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Track
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {tracks.map((track: Track) => (
                  <Card key={track.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{track.title}</h3>
                            <p className="text-gray-600">{track.artist}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded {new Date(track.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {track.yakoaTokenId && (
                            <Badge variant="outline">Yakoa Verified</Badge>
                          )}
                          {track.storyTxHash && (
                            <Badge variant="outline">Story Protocol</Badge>
                          )}
                          <Badge className={getStatusColor(track.status)}>
                            {track.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-4">
            {assetsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading IP assets...</p>
              </div>
            ) : ipAssets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No IP assets registered</h3>
                  <p className="text-gray-600 mb-6">Upload and verify tracks to create blockchain IP assets</p>
                  <Link href="/live-demo">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Zap className="w-4 h-4 mr-2" />
                      Try Live Demo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {ipAssets.map((asset: IPAsset) => (
                  <Card key={asset.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">IP Asset #{asset.storyIpId}</h3>
                            <p className="text-gray-600">Track ID: {asset.trackId}</p>
                            <p className="text-sm text-gray-500">
                              Created {new Date(asset.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(asset.status)}>
                            {asset.status}
                          </Badge>
                          {asset.txHash && (
                            <Button variant="outline" size="sm">
                              View on Chain
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tracks" className="space-y-6">
            {/* Recent Tracks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  My Tracks ({tracks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tracksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : tracks.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tracks uploaded yet</h3>
                    <p className="text-gray-600 mb-4">Upload your first track to get started with IP protection</p>
                    <Link href="/upload">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Track
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tracks.map((track: any) => (
                      <div key={track.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{track.title}</h3>
                            <p className="text-gray-600">{track.artist}</p>
                            <p className="text-sm text-gray-500">
                              {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : 'Unknown duration'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusIcon(track.status)}
                          <Badge className={getStatusColor(track.status)}>
                            {track.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            {/* IP Assets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  IP Assets ({ipAssets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assetsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : ipAssets.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No IP assets registered</h3>
                    <p className="text-gray-600">Upload and verify tracks to create IP assets</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ipAssets.map((asset: any) => (
                      <Card key={asset.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">IP Asset #{asset.id}</h3>
                                <p className="text-gray-600">Track: {asset.trackId}</p>
                                <p className="text-sm text-gray-500">
                                  Story Protocol ID: {asset.storyIpId}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(asset.status)}>
                                {asset.status}
                              </Badge>
                              {asset.txHash && (
                                <Button variant="outline" size="sm">
                                  View on Chain
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <WalletPortfolio />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}