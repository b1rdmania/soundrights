import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Shield, Users, BarChart3, Wallet, AlertTriangle, Key } from 'lucide-react';

export default function Integrations() {
  const { data: integrationStatuses, isLoading } = useQuery({
    queryKey: ['/api/integration-status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const integrations = [
    {
      id: 'yakoa',
      name: 'Yakoa IP Authentication',
      description: 'Advanced IP verification and originality detection for music content',
      icon: Shield,
      status: 'Live',
      features: ['100% confidence verification', 'Real-time authenticity checks', 'Comprehensive infringement detection'],
      demoUrl: '/live-demo#yakoa',
      docsUrl: 'https://docs.yakoa.io',
      color: 'blue'
    },
    {
      id: 'tomo',
      name: 'Tomo Social Verification',
      description: 'Enhanced user authentication and social reputation scoring',
      icon: Users,
      status: 'Live',
      features: ['Multi-platform social verification', 'Reputation scoring', 'Identity authentication'],
      demoUrl: '/live-demo#tomo',
      docsUrl: 'https://tomo.inc',
      color: 'green'
    },
    {
      id: 'zapper',
      name: 'Zapper Portfolio Analytics',
      description: 'Comprehensive Web3 portfolio tracking and NFT analytics',
      icon: BarChart3,
      status: 'Live',
      features: ['Portfolio tracking', 'Transaction history', 'NFT valuation'],
      demoUrl: '/analytics',
      docsUrl: 'https://zapper.fi',
      color: 'purple'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect Integration',
      description: 'Seamless Web3 wallet connectivity supporting 400+ wallets',
      icon: Wallet,
      status: 'Live',
      features: ['400+ wallet support', 'Cross-chain compatibility', 'Secure transactions'],
      demoUrl: '/live-demo#wallet',
      docsUrl: 'https://walletconnect.com',
      color: 'orange'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-800';
      case 'Beta': return 'bg-yellow-100 text-yellow-800';
      case 'Coming Soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'green': return 'text-green-600 bg-green-50 border-green-200';
      case 'purple': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'orange': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Live Integrations
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">Platform</span>
            <span className="block text-purple-600 text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
              Integrations
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience authentic sponsor integrations with live APIs and real-time verification 
            showcasing the complete SoundRights ecosystem.
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const status = integrationStatuses?.[integration.id];
            const isLive = status?.status === 'live';
            const isDemo = status?.status === 'demo';
            
            return (
              <Card key={integration.id} className={`hover:shadow-lg transition-all duration-200 border-2 ${getColorClasses(integration.color)}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${getColorClasses(integration.color)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{integration.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {status && (
                            <Badge className={isLive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                              {isLive ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                              {isLive ? 'Live API' : 'Demo Mode'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 mt-3">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {status && (
                    <div className={`p-3 rounded-lg border ${isLive ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <p className="text-sm font-medium text-gray-900">Current Status:</p>
                      <p className="text-sm text-gray-700 mt-1">{status.message}</p>
                      {status.apiKey && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          Key: {status.apiKey}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {isLive ? 'Live Features Active:' : 'Available Features:'}
                    </h4>
                    <ul className="space-y-1">
                      {integration.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isDemo && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Key className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Enable Live Features</p>
                          <p className="text-xs text-blue-700 mt-1">
                            This integration uses a live demo environment. Contact support for production API access.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      asChild
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <a href={integration.demoUrl}>
                        {isLive ? 'Try Live Demo' : 'Try Demo'}
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Docs
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Status Summary */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-8 pb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Live Integration Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Tomo</h4>
                  <p className="text-sm text-green-600">Live API Active</p>
                  <p className="text-xs text-gray-500 mt-1">Buildathon credentials</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Zapper</h4>
                  <p className="text-sm text-green-600">Live API Active</p>
                  <p className="text-xs text-gray-500 mt-1">Live portfolio data</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">WalletConnect</h4>
                  <p className="text-sm text-green-600">Live API Active</p>
                  <p className="text-xs text-gray-500 mt-1">400+ wallets supported</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Yakoa</h4>
                  <p className="text-sm text-yellow-600">Live Sandbox</p>
                  <p className="text-xs text-gray-500 mt-1">Demo environment</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Integration Authenticity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600 mb-2">✓ Live APIs (3/4)</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Tomo: Real social verification</li>
                      <li>• Zapper: Live portfolio tracking</li>
                      <li>• WalletConnect: Real wallet connections</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-600 mb-2">⚡ Sandbox Environment (1/4)</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Yakoa: Live sandbox for IP verification</li>
                      <li>• Full functionality with test data</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Experience authentic sponsor integrations with live APIs and real-time verification.
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                  <a href="/live-demo">
                    Test Live Integrations
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}