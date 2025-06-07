import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, BarChart3, Wallet, CheckCircle, AlertCircle, ExternalLink, Settings } from 'lucide-react';
import TomoIntegration from './TomoIntegration';
import YakoaIntegration from './YakoaIntegration';
import WalletConnectIntegration from './WalletConnectIntegration';

interface SponsorStatus {
  yakoa: string;
  tomo: string;
  zapper: string;
  walletconnect: string;
  story_protocol: string;
}

interface SponsorIntegrationsData {
  sponsor_integrations: SponsorStatus;
  demo_mode: boolean;
  timestamp: string;
}

export default function SponsorIntegrations() {
  const [status, setStatus] = useState<SponsorIntegrationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSponsorStatus();
  }, []);

  const fetchSponsorStatus = async () => {
    try {
      const response = await fetch('/api/sponsors/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch sponsor status:', error);
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (sponsor: string, endpoint: string) => {
    setTesting(sponsor);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          mediaUrl: 'https://example.com/test-audio.mp3',
          metadata: { title: 'Test Track', artist: 'Test Artist' }
        })
      });

      if (response.ok) {
        toast({
          title: `${sponsor} Integration Test`,
          description: 'Successfully connected to service',
          variant: 'default'
        });
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      toast({
        title: `${sponsor} Integration Test`,
        description: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setTesting(null);
    }
  };

  const getStatusBadge = (statusValue: string) => {
    if (statusValue === 'connected') {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
    } else if (statusValue === 'configured') {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Configured</Badge>;
    } else {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Demo Mode</Badge>;
    }
  };

  const sponsorDetails = {
    yakoa: {
      name: 'Yakoa IP API',
      description: 'Audio originality and IP authentication',
      icon: Shield,
      color: 'bg-blue-500',
      testEndpoint: '/api/yakoa/check-originality',
      docs: 'https://docs.yakoa.io'
    },
    tomo: {
      name: 'Tomo Wallet',
      description: 'Social login and wallet management',
      icon: Users,
      color: 'bg-purple-500',
      testEndpoint: '/api/tomo/auth/demo',
      docs: 'https://docs.tomo.inc'
    },
    zapper: {
      name: 'Zapper Analytics',
      description: 'On-chain portfolio and transaction analytics',
      icon: BarChart3,
      color: 'bg-green-500',
      testEndpoint: '/api/zapper/portfolio/0x1234567890123456789012345678901234567890',
      docs: 'https://docs.zapper.fi'
    },
    walletconnect: {
      name: 'WalletConnect',
      description: 'Web3 wallet connectivity protocol',
      icon: Wallet,
      color: 'bg-orange-500',
      testEndpoint: null,
      docs: 'https://docs.walletconnect.com'
    },
    story_protocol: {
      name: 'Story Protocol',
      description: 'Blockchain IP registration and licensing',
      icon: Shield,
      color: 'bg-indigo-500',
      testEndpoint: '/api/story/test-register',
      docs: 'https://docs.story.foundation'
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading sponsor integrations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Hackathon Sponsor Integrations</h2>
        <p className="text-muted-foreground">
          Complete integration suite demonstrating all sponsor technologies
        </p>
        {status?.demo_mode && (
          <Badge variant="outline" className="mt-2">
            <AlertCircle className="w-3 h-3 mr-1" />
            Some services in demo mode - Tomo fully connected
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tomo" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tomo
          </TabsTrigger>
          <TabsTrigger value="yakoa" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Yakoa
          </TabsTrigger>
          <TabsTrigger value="walletconnect" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            WalletConnect
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {status && Object.entries(status.sponsor_integrations).map(([key, value]) => {
              const details = sponsorDetails[key as keyof typeof sponsorDetails];
              if (!details) return null;

              const Icon = details.icon;

              return (
                <Card key={key} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 ${details.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${details.color} bg-opacity-10`}>
                          <Icon className={`h-5 w-5 text-white`} style={{ filter: 'brightness(0) saturate(100%)' }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{details.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {details.description}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(value)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm capitalize">{value.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {details.testEndpoint && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testIntegration(details.name, details.testEndpoint)}
                          disabled={testing === details.name}
                          className="flex-1"
                        >
                          {testing === details.name ? 'Testing...' : 'Test API'}
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(details.docs, '_blank')}
                        className="px-3"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {status && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Integration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {Object.values(status.sponsor_integrations).filter(s => s === 'connected').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Connected</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.values(status.sponsor_integrations).filter(s => s === 'configured').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Configured</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {Object.values(status.sponsor_integrations).filter(s => s.includes('demo')).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Demo Mode</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Object.keys(status.sponsor_integrations).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Services</div>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  Last updated: {new Date(status.timestamp).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tomo" className="mt-6">
          <TomoIntegration />
        </TabsContent>

        <TabsContent value="yakoa" className="mt-6">
          <YakoaIntegration />
        </TabsContent>

        <TabsContent value="walletconnect" className="mt-6">
          <WalletConnectIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
}