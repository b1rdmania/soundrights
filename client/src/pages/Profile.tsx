import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Music, 
  Activity, 
  Shield, 
  Clock, 
  FileText, 
  Award,
  TrendingUp,
  Wallet,
  ExternalLink,
  Download,
  Edit
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReownWallet } from '@/hooks/useReownWallet';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { address: connectedWallet } = useReownWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch user tracks
  const { data: tracks, isLoading: tracksLoading } = useQuery({
    queryKey: ['/api/tracks/user'],
    enabled: isAuthenticated,
  });

  // Fetch user licenses
  const { data: licenses, isLoading: licensesLoading } = useQuery({
    queryKey: ['/api/licenses/user'],
    enabled: isAuthenticated,
  });

  // Fetch user activity
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/user/activities'],
    enabled: isAuthenticated,
  });

  // Fetch user IP assets
  const { data: ipAssets, isLoading: ipAssetsLoading } = useQuery({
    queryKey: ['/api/user/ip-assets'],
    enabled: isAuthenticated,
  });

  // Export data mutation
  const exportDataMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/user/export-data', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soundrights-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your data has been downloaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'track_uploaded': return <Music className="w-4 h-4" />;
      case 'license_created': return <FileText className="w-4 h-4" />;
      case 'ip_registered': return <Shield className="w-4 h-4" />;
      case 'track_updated': return <Edit className="w-4 h-4" />;
      case 'analytics_viewed': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'track_uploaded': return 'bg-blue-100 text-blue-800';
      case 'license_created': return 'bg-green-100 text-green-800';
      case 'ip_registered': return 'bg-purple-100 text-purple-800';
      case 'track_updated': return 'bg-yellow-100 text-yellow-800';
      case 'analytics_viewed': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLicenseTypeColor = (type: string) => {
    switch (type) {
      case 'sync': return 'bg-blue-100 text-blue-800';
      case 'mechanical': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'master': return 'bg-red-100 text-red-800';
      case 'exclusive': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Please sign in to view your profile and activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/api/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="text-2xl">
                    {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">
                    {user?.firstName || user?.lastName 
                      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                      : user?.email || 'User Profile'
                    }
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Member since {formatDate(user?.createdAt || new Date().toISOString())}
                  </p>
                  
                  {connectedWallet && (
                    <div className="flex items-center gap-2 mt-3">
                      <Wallet className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-mono text-green-600">
                        {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Connected
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <Button
                    variant="outline"
                    onClick={() => exportDataMutation.mutate()}
                    disabled={exportDataMutation.isPending}
                    className="mb-2"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {exportDataMutation.isPending ? 'Exporting...' : 'Export Data'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tracks Uploaded</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tracksLoading ? '...' : (tracks as any)?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Licenses Created</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {licensesLoading ? '...' : (licenses as any)?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IP Assets Registered</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ipAssetsLoading ? '...' : (ipAssets as any)?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activitiesLoading ? '...' : (activities as any)?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tracks">My Tracks</TabsTrigger>
              <TabsTrigger value="licenses">Licenses</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activitiesLoading ? (
                      <div className="text-center py-4">Loading activities...</div>
                    ) : (activities as any)?.length ? (
                      <div className="space-y-3">
                        {(activities as any).slice(0, 5).map((activity: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className={`p-2 rounded-full ${getActivityColor(activity.action)}`}>
                              {getActivityIcon(activity.action)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.action.replace('_', ' ')}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent activity
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* IP Assets Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Story Protocol Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ipAssetsLoading ? (
                      <div className="text-center py-4">Loading IP assets...</div>
                    ) : (ipAssets as any)?.length ? (
                      <div className="space-y-3">
                        {(ipAssets as any).slice(0, 3).map((asset: any, index: number) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{asset.trackId}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {asset.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>IP ID: {asset.storyProtocolIpId?.slice(0, 8)}...</span>
                              {asset.storyProtocolUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={asset.storyProtocolUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No IP assets registered yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tracks">
              <Card>
                <CardHeader>
                  <CardTitle>My Music Tracks</CardTitle>
                  <CardDescription>
                    All tracks you've uploaded and registered on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tracksLoading ? (
                    <div className="text-center py-8">Loading tracks...</div>
                  ) : (tracks as any)?.length ? (
                    <div className="space-y-4">
                      {(tracks as any).map((track: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{track.title || 'Untitled'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {track.artist || 'Unknown Artist'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {track.genre || 'Unknown'}
                                </Badge>
                                {track.bpm && (
                                  <Badge variant="outline" className="text-xs">
                                    {track.bpm} BPM
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={track.status === 'verified' ? 'default' : 'secondary'}
                              className="mb-2"
                            >
                              {track.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(track.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No tracks uploaded yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="licenses">
              <Card>
                <CardHeader>
                  <CardTitle>License Management</CardTitle>
                  <CardDescription>
                    Licenses you've created and received for your music
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {licensesLoading ? (
                    <div className="text-center py-8">Loading licenses...</div>
                  ) : (licenses as any)?.length ? (
                    <div className="space-y-4">
                      {(licenses as any).map((license: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{license.trackId}</h3>
                            <Badge className={getLicenseTypeColor(license.licenseType)}>
                              {license.licenseType}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Price:</span>
                              <span className="ml-2 font-medium">${license.price}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="ml-2 font-medium">{license.duration}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Territory:</span>
                              <span className="ml-2 font-medium">{license.territory}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <span className="ml-2 font-medium">{license.status}</span>
                            </div>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Created {formatDate(license.createdAt)}</span>
                            <span>License ID: {license.licenseId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No licenses created yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Complete history of your actions on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="text-center py-8">Loading activity log...</div>
                  ) : (activities as any)?.length ? (
                    <div className="space-y-3">
                      {(activities as any).map((activity: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.action)}`}>
                            {getActivityIcon(activity.action)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {activity.action.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.createdAt)}
                              </span>
                            </div>
                            
                            {activity.resourceType && (
                              <p className="text-xs text-muted-foreground">
                                {activity.resourceType}: {activity.resourceId}
                              </p>
                            )}
                            
                            {activity.metadata && (
                              <div className="mt-2 text-xs">
                                <pre className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(activity.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity recorded yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}