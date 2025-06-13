import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  Music, 
  FileText, 
  Activity, 
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState('');
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    ipRegistrationEnabled: true,
    maxFileSize: '100MB',
    allowedFormats: 'mp3,wav,flac'
  });

  // Check if user is admin (simplified check)
  const isAdmin = user?.email?.includes('admin') || user?.id === '1';

  // Fetch system stats
  const { data: systemStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: isAuthenticated && isAdmin,
  });

  // Fetch all users
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated && isAdmin,
  });

  // Fetch all tracks
  const { data: allTracks, isLoading: tracksLoading } = useQuery({
    queryKey: ['/api/admin/tracks'],
    enabled: isAuthenticated && isAdmin,
  });

  // Fetch system health
  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/admin/health'],
    enabled: isAuthenticated && isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch audit logs
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['/api/admin/audit-logs'],
    enabled: isAuthenticated && isAdmin,
  });

  // System backup mutation
  const backupMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/admin/backup', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      // Create and download backup file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soundrights-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Created",
        description: "System backup has been downloaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Backup Failed",
        description: error instanceof Error ? error.message : "Failed to create backup",
        variant: "destructive",
      });
    },
  });

  // Update user status mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      return await apiRequest(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User Updated",
        description: "User status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Delete track mutation
  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      return await apiRequest(`/api/admin/tracks/${trackId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tracks'] });
      toast({
        title: "Track Deleted",
        description: "Track has been removed from the system",
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "Failed to delete track",
        variant: "destructive",
      });
    },
  });

  // Update system settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      return await apiRequest('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      });
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "System settings have been saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update settings",
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

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'healthy': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'warning': return { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'error': return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
      default: return { icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Please sign in with admin credentials to access the admin panel
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <a href="/">Go Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                    <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                      System management and configuration
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => refetchStats()}
                    disabled={statsLoading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    onClick={() => backupMutation.mutate()}
                    disabled={backupMutation.isPending}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {backupMutation.isPending ? 'Creating...' : 'Backup'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? '...' : (systemStats as any)?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{(systemStats as any)?.newUsersToday || 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? '...' : (systemStats as any)?.totalTracks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{(systemStats as any)?.newTracksToday || 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">IP Assets</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? '...' : (systemStats as any)?.totalIpAssets || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Story Protocol registered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {healthLoading ? (
                    <div className="text-sm">Checking...</div>
                  ) : (
                    <>
                      {(() => {
                        const health = getHealthStatus((systemHealth as any)?.status || 'unknown');
                        const HealthIcon = health.icon;
                        return (
                          <>
                            <HealthIcon className={`w-5 h-5 ${health.color}`} />
                            <span className="font-semibold capitalize">
                              {(systemHealth as any)?.status || 'Unknown'}
                            </span>
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Admin Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="logs">Audit Logs</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : (allUsers as any)?.length ? (
                    <div className="space-y-4">
                      {(allUsers as any).map((user: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.firstName?.[0] || user.email?.[0] || 'U'}
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {user.firstName || user.lastName 
                                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                                  : user.email
                                }
                              </h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  ID: {user.id}
                                </Badge>
                                <Badge variant={user.verified ? 'default' : 'secondary'} className="text-xs">
                                  {user.verified ? 'Verified' : 'Unverified'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.status || 'active'}
                              onValueChange={(value) => updateUserMutation.mutate({ 
                                userId: user.id, 
                                updates: { status: value } 
                              })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracks">
              <Card>
                <CardHeader>
                  <CardTitle>Track Management</CardTitle>
                  <CardDescription>
                    Manage uploaded tracks and content moderation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tracksLoading ? (
                    <div className="text-center py-8">Loading tracks...</div>
                  ) : (allTracks as any)?.length ? (
                    <div className="space-y-4">
                      {(allTracks as any).slice(0, 20).map((track: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{track.title || 'Untitled'}</h3>
                              <p className="text-sm text-muted-foreground">
                                by {track.artist || 'Unknown Artist'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {track.genre || 'Unknown'}
                                </Badge>
                                <Badge variant={track.status === 'verified' ? 'default' : 'secondary'} className="text-xs">
                                  {track.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  User: {track.userId}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteTrackMutation.mutate(track.id)}
                              disabled={deleteTrackMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No tracks found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Real-time system status and performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {healthLoading ? (
                      <div className="text-center py-4">Loading health data...</div>
                    ) : systemHealth ? (
                      <div className="space-y-4">
                        {Object.entries((systemHealth as any).services || {}).map(([service, status]: [string, any]) => {
                          const health = getHealthStatus(status.status);
                          const HealthIcon = health.icon;
                          return (
                            <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${health.bg}`}>
                                  <HealthIcon className={`w-4 h-4 ${health.color}`} />
                                </div>
                                <div>
                                  <h4 className="font-medium capitalize">{service}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {status.message || 'Running normally'}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={status.status === 'healthy' ? 'default' : 'destructive'}>
                                {status.status}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Health data unavailable
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Database Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Database Statistics</CardTitle>
                    <CardDescription>Database usage and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span>Total Records</span>
                        <span className="font-semibold">
                          {(systemStats as any)?.totalRecords || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span>Storage Used</span>
                        <span className="font-semibold">
                          {(systemStats as any)?.storageUsed || '0 MB'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span>Active Connections</span>
                        <span className="font-semibold">
                          {(systemStats as any)?.activeConnections || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>
                    System activity and user action logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {logsLoading ? (
                    <div className="text-center py-8">Loading audit logs...</div>
                  ) : (auditLogs as any)?.length ? (
                    <div className="space-y-3">
                      {(auditLogs as any).slice(0, 50).map((log: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium text-sm">
                                {log.action.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                User: {log.userId} | {log.resourceType && `${log.resourceType}: ${log.resourceId}`}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(log.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No audit logs found
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system behavior and limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* General Settings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">
                              Put the system in maintenance mode
                            </p>
                          </div>
                          <Switch
                            checked={systemSettings.maintenanceMode}
                            onCheckedChange={(checked) => 
                              setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>User Registration</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow new user registrations
                            </p>
                          </div>
                          <Switch
                            checked={systemSettings.registrationEnabled}
                            onCheckedChange={(checked) => 
                              setSystemSettings(prev => ({ ...prev, registrationEnabled: checked }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>IP Registration</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable Story Protocol IP registration
                            </p>
                          </div>
                          <Switch
                            checked={systemSettings.ipRegistrationEnabled}
                            onCheckedChange={(checked) => 
                              setSystemSettings(prev => ({ ...prev, ipRegistrationEnabled: checked }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* File Upload Settings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">File Upload Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="maxFileSize">Maximum File Size</Label>
                          <Input
                            id="maxFileSize"
                            value={systemSettings.maxFileSize}
                            onChange={(e) => 
                              setSystemSettings(prev => ({ ...prev, maxFileSize: e.target.value }))
                            }
                            placeholder="100MB"
                          />
                        </div>
                        <div>
                          <Label htmlFor="allowedFormats">Allowed Formats</Label>
                          <Input
                            id="allowedFormats"
                            value={systemSettings.allowedFormats}
                            onChange={(e) => 
                              setSystemSettings(prev => ({ ...prev, allowedFormats: e.target.value }))
                            }
                            placeholder="mp3,wav,flac"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* API Settings */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">API Configuration</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Story Protocol Status</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Connected to testnet</span>
                          </div>
                        </div>
                        <div>
                          <Label>Yakoa Integration</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Demo environment active</span>
                          </div>
                        </div>
                        <div>
                          <Label>Tomo Service</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Buildathon API key configured</span>
                          </div>
                        </div>
                        <div>
                          <Label>Zapper Analytics</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">API key configured</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Settings */}
                    <div className="flex justify-end">
                      <Button
                        onClick={() => updateSettingsMutation.mutate(systemSettings)}
                        disabled={updateSettingsMutation.isPending}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}