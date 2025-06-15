import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, ExternalLink, Shield, Users, BarChart3, Wallet, Key } from 'lucide-react';

interface IntegrationStatus {
  name: string;
  status: 'live' | 'requires_api_key' | 'error';
  apiKey: string;
  message: string;
}

export default function IntegrationStatus() {
  const { data: integrationStatuses, isLoading } = useQuery({
    queryKey: ['/api/integration-status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200';
      case 'requires_api_key': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'requires_api_key': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const integrationDetails = [
    {
      id: 'yakoa',
      name: 'Yakoa IP Authentication',
      description: 'Advanced IP verification and originality detection',
      icon: Shield,
      liveFeatures: ['Real-time IP verification', 'Originality scanning', 'Infringement detection'],
      productionFeatures: ['Authenticated API access required for full functionality'],
      apiKeyRequired: 'YAKOA_API_KEY',
      docsUrl: 'https://docs.yakoa.io'
    },
    {
      id: 'tomo',
      name: 'Tomo Social Verification',
      description: 'Enhanced user authentication and social reputation',
      icon: Users,
      liveFeatures: ['Live social verification', 'Real reputation scoring', 'OAuth integration'],
      productionFeatures: ['Authenticated API access required for full functionality'],
      apiKeyRequired: 'TOMO_API_KEY',
      docsUrl: 'https://tomo.inc'
    },
    {
      id: 'zapper',
      name: 'Zapper Portfolio Analytics',
      description: 'Comprehensive Web3 portfolio tracking',
      icon: BarChart3,
      liveFeatures: ['Live portfolio data', 'Real transaction history', 'NFT valuations'],
      productionFeatures: ['Authenticated API access required for full functionality'],
      apiKeyRequired: 'ZAPPER_API_KEY',
      docsUrl: 'https://zapper.fi/docs'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect Integration',
      description: 'Seamless Web3 wallet connectivity',
      icon: Wallet,
      liveFeatures: ['400+ wallet support', 'Live transactions', 'Cross-chain compatibility'],
      productionFeatures: ['Authenticated API access required for full functionality'],
      apiKeyRequired: 'WALLETCONNECT_PROJECT_ID',
      docsUrl: 'https://walletconnect.com/docs'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking integration status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Live Integration Status
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">Integration</span>
            <span className="block text-blue-600 text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
              Status Dashboard
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time status of all platform integrations. Live APIs provide authentic data, 
            All integrations require valid API keys for full functionality.
          </p>
        </div>

        {/* Integration Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {integrationDetails.map((integration) => {
            const Icon = integration.icon;
            const status = integrationStatuses?.[integration.id];
            const isLive = status?.status === 'live';
            
            return (
              <Card key={integration.id} className="hover:shadow-lg transition-all duration-200 border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{integration.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {status && (
                            <Badge className={getStatusColor(status.status)}>
                              {getStatusIcon(status.status)}
                              <span className="ml-1 capitalize">{status.status}</span>
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
                    <div className="p-3 rounded-lg bg-gray-50 border">
                      <p className="text-sm text-gray-700 font-medium">Current Status:</p>
                      <p className="text-sm text-gray-600 mt-1">{status.message}</p>
                      {status.apiKey && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          Key: {status.apiKey}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {isLive ? 'Live Features Active:' : 'Production Requirements:'}
                    </h4>
                    <ul className="space-y-1">
                      {(isLive ? integration.liveFeatures : integration.productionFeatures).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!isLive && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <Key className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Enable Live Features</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Provide <code className="bg-yellow-100 px-1 rounded">{integration.apiKeyRequired}</code> for full functionality
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      asChild
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <a href="/live-demo">
                        Try Integration
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

        {/* Summary Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-8 pb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Integration Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {integrationStatuses ? Object.values(integrationStatuses).filter((s: any) => s.status === 'live').length : 0}
                </div>
                <p className="text-gray-600">Live Integrations</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {integrationStatuses ? Object.values(integrationStatuses).filter((s: any) => s.status === 'requires_api_key').length : 0}
                </div>
                <p className="text-gray-600">Require API Keys</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {integrationStatuses ? Object.keys(integrationStatuses).length : 0}
                </div>
                <p className="text-gray-600">Total Integrations</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                <a href="/live-demo">
                  Test All Integrations
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}