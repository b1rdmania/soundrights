import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, CheckCircle, Shield, Users, BarChart3, Wallet, AlertTriangle, Key, Play, RefreshCw } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Integrations() {
  const [testWalletAddress, setTestWalletAddress] = useState('0x742d35Cc6641C3aa5DdAabE8C68c08C5a5D4A58A');

  const { data: integrationStatuses, isLoading, refetch } = useQuery({
    queryKey: ['/api/sponsors/status'],
    refetchInterval: 30000,
  });

  // Test API integrations
  const yakoaTest = useMutation({
    mutationFn: async () => await apiRequest('/api/yakoa/test', { method: 'POST' }),
    onSuccess: () => toast.success('Yakoa API test successful - IP verification working'),
    onError: (error) => toast.error(`Yakoa test failed: ${error.message}`)
  });

  const zapperTest = useMutation({
    mutationFn: async () => await apiRequest(`/api/zapper/portfolio/${testWalletAddress}`),
    onSuccess: () => toast.success('Zapper API test successful - Portfolio data retrieved'),
    onError: (error) => toast.error(`Zapper test failed: ${error.message}`)
  });

  const storyTest = useMutation({
    mutationFn: async () => await apiRequest('/api/story/test', { method: 'POST' }),
    onSuccess: () => toast.success('Story Protocol test successful - Blockchain connection verified'),
    onError: (error) => toast.error(`Story Protocol test failed: ${error.message}`)
  });

  const getStatusBadge = (serviceKey: string) => {
    if (!integrationStatuses?.integrations) return <Badge variant="secondary">Loading...</Badge>;
    
    const service = (integrationStatuses.integrations as any)[serviceKey];
    if (!service) return <Badge variant="destructive">Unknown</Badge>;
    
    if (service.status === 'live') {
      return <Badge variant="default" className="bg-green-500">Live</Badge>;
    } else if (service.status.includes('requires')) {
      return <Badge variant="destructive">Needs API Key</Badge>;
    } else {
      return <Badge variant="secondary">{service.status}</Badge>;
    }
  };

  const integrations = [
    {
      id: 'yakoa',
      name: 'Yakoa IP Authentication',
      description: 'Advanced IP verification and originality detection for music content',
      icon: Shield,
      features: ['100% confidence verification', 'Real-time authenticity checks', 'Comprehensive infringement detection'],
      apiEndpoint: '/api/yakoa/test',
      docsUrl: 'https://docs.yakoa.io',
      color: 'blue',
      details: 'Live API integration using provided credentials for production IP verification.',
      testFunction: yakoaTest
    },
    {
      id: 'tomo',
      name: 'Tomo Social Verification',
      description: 'Enhanced user authentication and social reputation scoring',
      icon: Users,
      features: ['Multi-platform social verification', 'Reputation scoring', 'Identity authentication'],
      apiEndpoint: '/api/tomo/test',
      docsUrl: 'https://tomo.inc',
      color: 'green',
      details: 'Live OAuth integration with buildathon credentials for social authentication.',
      testFunction: null
    },
    {
      id: 'zapper',
      name: 'Zapper Portfolio Analytics',
      description: 'Comprehensive Web3 portfolio tracking and NFT analytics',
      icon: BarChart3,
      features: ['Portfolio tracking', 'Transaction history', 'NFT valuation'],
      apiEndpoint: '/api/zapper/test',
      docsUrl: 'https://zapper.fi',
      color: 'purple',
      details: 'Requires ZAPPER_API_KEY for live portfolio data. Falls back to blockchain RPC.',
      testFunction: zapperTest
    },
    {
      id: 'story_protocol',
      name: 'Story Protocol Blockchain',
      description: 'IP asset registration and licensing on blockchain',
      icon: Wallet,
      features: ['IP asset minting', 'Licensing automation', 'Revenue tracking'],
      apiEndpoint: '/api/story/test',
      docsUrl: 'https://docs.story.foundation',
      color: 'orange',
      details: 'Live testnet integration for blockchain IP registration.',
      testFunction: storyTest
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect Integration',
      description: 'Seamless Web3 wallet connectivity supporting 400+ wallets',
      icon: Wallet,
      features: ['400+ wallet support', 'Cross-chain compatibility', 'Secure transactions'],
      apiEndpoint: '/api/walletconnect/status',
      docsUrl: 'https://walletconnect.com',
      color: 'indigo',
      details: 'Live wallet connectivity with buildathon project ID.',
      testFunction: null
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Live API Integrations</h1>
        <p className="text-xl text-gray-600 mb-6">
          Real-time demonstrations of our production integrations with blockchain and Web3 services.
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
          
          {integrationStatuses && (
            <div className="flex items-center gap-2">
              {integrationStatuses.production_ready ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Production Ready
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Needs Configuration
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Integration Overview</TabsTrigger>
          <TabsTrigger value="testing">Live API Testing</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className={`h-6 w-6 text-${integration.color}-500`} />
                      {getStatusBadge(integration.id)}
                    </div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {integration.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 mb-3">{integration.details}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Docs
                            </a>
                          </Button>
                          {integration.testFunction && (
                            <Button 
                              size="sm" 
                              onClick={() => integration.testFunction?.mutate()}
                              disabled={integration.testFunction?.isPending}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Test API
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live API Testing Console</CardTitle>
              <CardDescription>
                Test real API integrations with live data. All tests use production endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wallet-address">Test Wallet Address</Label>
                    <Input
                      id="wallet-address"
                      value={testWalletAddress}
                      onChange={(e) => setTestWalletAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">API Tests</h3>
                    
                    <Button 
                      onClick={() => yakoaTest.mutate()}
                      disabled={yakoaTest.isPending}
                      className="w-full justify-start"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Test Yakoa IP Verification
                      {yakoaTest.isPending && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
                    </Button>
                    
                    <Button 
                      onClick={() => zapperTest.mutate()}
                      disabled={zapperTest.isPending}
                      className="w-full justify-start"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Test Zapper Portfolio
                      {zapperTest.isPending && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
                    </Button>
                    
                    <Button 
                      onClick={() => storyTest.mutate()}
                      disabled={storyTest.isPending}
                      className="w-full justify-start"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Test Story Protocol
                      {storyTest.isPending && <RefreshCw className="h-4 w-4 ml-2 animate-spin" />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Integration Workflow</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>1. Upload Audio</strong> → Yakoa IP verification
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <strong>2. Connect Wallet</strong> → Portfolio analysis via Zapper
                    </div>
                    <div className="p-3 bg-orange-50 rounded">
                      <strong>3. Register IP</strong> → Story Protocol blockchain
                    </div>
                    <div className="p-3 bg-purple-50 rounded">
                      <strong>4. Social Verify</strong> → Tomo authentication
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Integration Status</CardTitle>
              <CardDescription>
                Real-time status of all production integrations and API connections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {integrationStatuses ? (
                <div className="space-y-4">
                  {Object.entries((integrationStatuses.integrations as any) || {}).map(([key, service]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium capitalize">{key.replace('_', ' ')}</h3>
                        <p className="text-sm text-gray-600">{service.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {service.api_key && (
                          <Badge variant="outline">
                            <Key className="h-3 w-3 mr-1" />
                            {service.api_key}
                          </Badge>
                        )}
                        {getStatusBadge(key)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Overall Status</span>
                      {integrationStatuses.production_ready ? (
                        <Badge variant="default" className="bg-green-500">Production Ready</Badge>
                      ) : (
                        <Badge variant="destructive">Needs Configuration</Badge>
                      )}
                    </div>
                    {integrationStatuses.requires_configuration?.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Missing: {integrationStatuses.requires_configuration.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Loading integration status...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}