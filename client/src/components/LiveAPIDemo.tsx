import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Music, CheckCircle, AlertTriangle, ExternalLink, Wallet, Users, BarChart3, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface APIResult {
  service: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
  timestamp?: string;
}

export default function LiveAPIDemo() {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState('0xd8da6bf26964af9d7eed9e03e53415d37aa96045'); // Vitalik's wallet as default
  const [results, setResults] = useState<Record<string, APIResult>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showStoryRegistration, setShowStoryRegistration] = useState(false);

  const steps = [
    { id: 'yakoa', name: 'IP Verification', icon: Shield, service: 'Yakoa' },
    { id: 'zapper', name: 'Portfolio Analysis', icon: BarChart3, service: 'Zapper' },
    { id: 'tomo', name: 'Social Verification', icon: Users, service: 'Tomo' },
    { id: 'wallet', name: 'Wallet Integration', icon: Wallet, service: 'WalletConnect' }
  ];

  // Yakoa IP Verification Test
  const yakoaTest = useMutation({
    mutationFn: async () => await apiRequest('/api/yakoa/test', { method: 'POST' }),
    onSuccess: (data) => {
      setResults(prev => ({
        ...prev,
        yakoa: {
          service: 'Yakoa IP Authentication',
          status: 'success',
          data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      toast({
        title: "IP Verification Complete",
        description: `Token ${data.details?.token_id} created successfully`,
      });
    },
    onError: (error) => {
      setResults(prev => ({
        ...prev,
        yakoa: {
          service: 'Yakoa IP Authentication',
          status: 'error',
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }
  });

  // Zapper Portfolio Analysis
  const zapperTest = useMutation({
    mutationFn: async () => await apiRequest('/api/zapper/test'),
    onSuccess: (data) => {
      setResults(prev => ({
        ...prev,
        zapper: {
          service: 'Zapper Portfolio Analytics',
          status: 'success',
          data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      toast({
        title: "Portfolio Analysis Complete",
        description: `Found $${data.details?.total_value} portfolio value`,
      });
    },
    onError: (error) => {
      setResults(prev => ({
        ...prev,
        zapper: {
          service: 'Zapper Portfolio Analytics',
          status: 'error',
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }
  });

  // Real Wallet Portfolio (using user-provided address)
  const walletTest = useMutation({
    mutationFn: async () => await apiRequest(`/api/wallet/portfolio/${walletAddress}`),
    onSuccess: (data) => {
      setResults(prev => ({
        ...prev,
        wallet: {
          service: 'Wallet Integration',
          status: 'success',
          data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      toast({
        title: "Wallet Analysis Complete",
        description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
    },
    onError: (error) => {
      setResults(prev => ({
        ...prev,
        wallet: {
          service: 'Wallet Integration',
          status: 'error',
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }
  });

  // Story Protocol Registration Test
  const storyTest = useMutation({
    mutationFn: async () => await apiRequest('/api/story/test-register', { 
      method: 'POST',
      body: JSON.stringify({
        name: "Test Music Track",
        description: "Testing Story Protocol blockchain registration",
        mediaUrl: "https://example.com/test-track.mp3",
        attributes: { genre: "Electronic", testMode: true }
      })
    }),
    onSuccess: (data) => {
      setResults(prev => ({
        ...prev,
        story: {
          service: 'Story Protocol Blockchain',
          status: 'success',
          data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      toast({
        title: "Blockchain Registration Test Complete",
        description: data.success ? "Test registration successful" : "Registration test failed",
      });
    },
    onError: (error) => {
      setResults(prev => ({
        ...prev,
        story: {
          service: 'Story Protocol Blockchain',
          status: 'error',
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      toast({
        title: "Blockchain Registration Failed",
        description: "Check console for detailed error logs",
        variant: "destructive"
      });
    }
  });

  // Story Protocol Status Check
  const storyStatusTest = useMutation({
    mutationFn: async () => await apiRequest('/api/story/status'),
    onSuccess: (data) => {
      setResults(prev => ({
        ...prev,
        storyStatus: {
          service: 'Story Protocol Status',
          status: 'success',
          data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    },
    onError: (error) => {
      setResults(prev => ({
        ...prev,
        storyStatus: {
          service: 'Story Protocol Status',
          status: 'error',
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }
  });

  // Mock Tomo verification (since it requires OAuth flow)
  const simulateTomoVerification = () => {
    setResults(prev => ({
      ...prev,
      tomo: {
        service: 'Tomo Social Verification',
        status: 'success',
        data: {
          success: true,
          service: 'tomo',
          message: 'Social verification would require OAuth flow',
          details: {
            provider: 'twitter',
            verification_status: 'requires_oauth',
            available_providers: ['twitter', 'discord', 'github']
          }
        },
        timestamp: new Date().toLocaleTimeString()
      }
    }));
  };

  const runAllTests = async () => {
    setCurrentStep(0);
    setResults({});
    
    // Run tests sequentially with visual progress
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      const step = steps[i];
      
      setResults(prev => ({
        ...prev,
        [step.id]: {
          service: step.service,
          status: 'pending',
          timestamp: new Date().toLocaleTimeString()
        }
      }));

      try {
        switch (step.id) {
          case 'yakoa':
            await yakoaTest.mutateAsync();
            break;
          case 'zapper':
            await zapperTest.mutateAsync();
            break;
          case 'tomo':
            simulateTomoVerification();
            break;
          case 'wallet':
            await walletTest.mutateAsync();
            break;
        }
      } catch (error) {
        console.error(`Error in ${step.id}:`, error);
      }
      
      // Wait between steps for visual effect
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setCurrentStep(steps.length);
    setShowStoryRegistration(true);
  };

  const getStatusIcon = (result: APIResult) => {
    switch (result.status) {
      case 'pending':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatResultData = (result: APIResult) => {
    if (!result.data) return null;
    
    const data = result.data;
    
    switch (result.service) {
      case 'Yakoa IP Authentication':
        return (
          <div className="space-y-2 text-sm">
            <div>Token ID: <span className="font-mono">{data.details?.token_id}</span></div>
            <div>Status: <Badge variant="outline">{data.details?.status}</Badge></div>
            <div>Media URL: <span className="text-blue-600">{data.details?.media_url}</span></div>
          </div>
        );
      
      case 'Zapper Portfolio Analytics':
        return (
          <div className="space-y-2 text-sm">
            <div>Wallet: <span className="font-mono">{data.details?.wallet_address?.slice(0, 6)}...{data.details?.wallet_address?.slice(-4)}</span></div>
            <div>Total Value: <span className="font-semibold text-green-600">${data.details?.total_value}</span></div>
            <div>Tokens: <span className="font-semibold">{data.details?.token_count}</span></div>
            <div>Transactions: <span className="font-semibold">{data.details?.recent_transactions?.length || 0}</span></div>
          </div>
        );
      
      case 'Wallet Integration':
        return (
          <div className="space-y-2 text-sm">
            <div>Address: <span className="font-mono">{data.address}</span></div>
            <div>Total Value: <span className="font-semibold text-green-600">${data.total_value}</span></div>
            <div>Tokens: <span className="font-semibold">{data.tokens?.length || 0}</span></div>
            <div>Updated: <span className="text-gray-500">{data.updated_at}</span></div>
          </div>
        );
      
      case 'Tomo Social Verification':
        return (
          <div className="space-y-2 text-sm">
            <div>Status: <Badge variant="outline">{data.details?.verification_status}</Badge></div>
            <div>Providers: {data.details?.available_providers?.join(', ')}</div>
            <div className="text-blue-600">OAuth flow required for full verification</div>
          </div>
        );

      case 'Story Protocol Blockchain':
        return (
          <div className="space-y-2 text-sm">
            <div>IP Asset ID: <span className="font-mono">{data.details?.ip_asset_id}</span></div>
            <div>TX Hash: <span className="font-mono text-xs">{data.details?.transaction_hash}</span></div>
            <div>Network: <Badge variant="outline">{data.details?.blockchain}</Badge></div>
            <div>Status: <Badge variant="outline" className="bg-green-100">{data.details?.registration_status}</Badge></div>
          </div>
        );
      
      default:
        return <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Live API Integration Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="wallet-address">Test Wallet Address</Label>
            <Input
              id="wallet-address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Default: Vitalik's wallet for live portfolio demonstration
            </p>
          </div>
          
          <Button 
            onClick={runAllTests} 
            className="w-full"
            disabled={yakoaTest.isPending || zapperTest.isPending || walletTest.isPending}
          >
            {currentStep < steps.length ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Live API Tests... ({currentStep + 1}/{steps.length})
              </>
            ) : (
              'Run Live API Integration Test'
            )}
          </Button>
          
          {currentStep > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{width: `${(currentStep / steps.length) * 100}%`}}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      <div className="grid gap-4">
        {steps.map((step, index) => {
          const result = results[step.id];
          const Icon = step.icon;
          
          return (
            <Card key={step.id} className={`transition-all ${currentStep === index ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <CardTitle className="text-lg">{step.name}</CardTitle>
                      <p className="text-sm text-gray-500">{step.service}</p>
                    </div>
                  </div>
                  {result && (
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result)}
                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              {result && (
                <CardContent>
                  {result.status === 'success' && result.data && formatResultData(result)}
                  {result.status === 'error' && (
                    <div className="text-red-600 text-sm">
                      Error: {result.error}
                    </div>
                  )}
                  {result.status === 'pending' && (
                    <div className="text-blue-600 text-sm flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Testing {result.service}...
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Story Protocol Testing Section */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Story Protocol Blockchain Testing</h3>
        <p className="text-sm text-gray-600">
          Test blockchain registration functionality and diagnose connectivity issues
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Status Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.storyStatus ? (
                <div>
                  {results.storyStatus.status === 'success' && results.storyStatus.data && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <Badge variant="outline">{results.storyStatus.data.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>API Key:</span>
                        <Badge variant={results.storyStatus.data.apiKey === 'configured' ? 'default' : 'destructive'}>
                          {results.storyStatus.data.apiKey}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Private Key:</span>
                        <Badge variant={results.storyStatus.data.privateKey === 'configured' ? 'default' : 'destructive'}>
                          {results.storyStatus.data.privateKey}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>API Connection:</span>
                        <Badge variant={results.storyStatus.data.connectivity?.api === 'connected' ? 'default' : 'destructive'}>
                          {results.storyStatus.data.connectivity?.api || 'unknown'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>RPC Connection:</span>
                        <Badge variant={results.storyStatus.data.connectivity?.rpc === 'connected' ? 'default' : 'destructive'}>
                          {results.storyStatus.data.connectivity?.rpc || 'unknown'}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {results.storyStatus.status === 'error' && (
                    <div className="text-red-600 text-sm">
                      Error: {results.storyStatus.error}
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={() => storyStatusTest.mutate()}
                  disabled={storyStatusTest.isPending}
                  variant="outline"
                  size="sm"
                >
                  {storyStatusTest.isPending ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Check Status'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Registration Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Music className="w-4 h-4" />
                Blockchain Registration Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.story ? (
                <div>
                  {results.story.status === 'success' && results.story.data && (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Test Status:</span>
                        <Badge variant="default">Success</Badge>
                      </div>
                      {results.story.data.data?.ipId && (
                        <div className="flex justify-between">
                          <span>IP Asset ID:</span>
                          <code className="text-xs bg-gray-100 px-1 rounded">
                            {results.story.data.data.ipId.slice(0, 8)}...
                          </code>
                        </div>
                      )}
                      {results.story.data.data?.txHash && (
                        <div className="flex justify-between">
                          <span>Transaction:</span>
                          <code className="text-xs bg-gray-100 px-1 rounded">
                            {results.story.data.data.txHash.slice(0, 8)}...
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                  {results.story.status === 'error' && (
                    <div className="text-red-600 text-sm space-y-1">
                      <div>Registration failed:</div>
                      <div className="font-mono text-xs bg-red-50 p-2 rounded">
                        {results.story.error}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  onClick={() => storyTest.mutate()}
                  disabled={storyTest.isPending}
                  size="sm"
                >
                  {storyTest.isPending ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Registration'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}