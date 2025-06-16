import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Shield, Users, BarChart3, Wallet, AlertTriangle, RefreshCw, XCircle, Clock } from 'lucide-react';

export default function Integrations() {
  const { data: integrationStatuses, isLoading, refetch } = useQuery({
    queryKey: ['/api/sponsors/status'],
    refetchInterval: 30000,
  });

  const getStatusInfo = (serviceKey: string) => {
    if (!integrationStatuses?.integrations) {
      return { badge: <Badge variant="secondary">Loading...</Badge>, dataSource: 'loading' };
    }
    
    const service = (integrationStatuses.integrations as any)[serviceKey];
    if (!service) {
      return { badge: <Badge variant="destructive">Unknown</Badge>, dataSource: 'error' };
    }
    
    if (service.status === 'live') {
      return { 
        badge: <Badge variant="default" className="bg-green-500">Live Data</Badge>, 
        dataSource: 'authentic',
        details: service.message 
      };
    } else if (service.status.includes('requires')) {
      return { 
        badge: <Badge variant="destructive">Needs API Key</Badge>, 
        dataSource: 'missing_credentials',
        details: service.message 
      };
    } else if (service.status.includes('error') || service.status.includes('failed')) {
      return { 
        badge: <Badge variant="destructive">Connection Failed</Badge>, 
        dataSource: 'error',
        details: service.message 
      };
    } else {
      return { 
        badge: <Badge variant="secondary">{service.status}</Badge>, 
        dataSource: 'unknown',
        details: service.message 
      };
    }
  };

  const integrations = [
    {
      id: 'yakoa',
      name: 'Yakoa IP Authentication',
      description: 'Advanced IP verification and originality detection for music content',
      icon: Shield,
      features: ['Authentic IP verification', 'Real-time originality checks', 'Comprehensive infringement detection'],
      docsUrl: 'https://docs.yakoa.io',
      color: 'blue',
      purpose: 'Verifies music authenticity and detects potential copyright infringement during upload process.',
      dataPolicy: 'Only returns authentic verification results from Yakoa API. No dummy confidence scores.'
    },
    {
      id: 'tomo',
      name: 'Tomo Social Verification', 
      description: 'Enhanced user authentication and social reputation scoring',
      icon: Users,
      features: ['Multi-platform social verification', 'Reputation scoring', 'Identity authentication'],
      docsUrl: 'https://tomo.inc',
      color: 'green',
      purpose: 'Enables social login and wallet verification for enhanced user authentication.',
      dataPolicy: 'Connects to real social accounts only. No fake user profiles or demo authentication.'
    },
    {
      id: 'zapper',
      name: 'Zapper Portfolio Analytics',
      description: 'Comprehensive Web3 portfolio tracking and NFT analytics',
      icon: BarChart3,
      features: ['Real portfolio tracking', 'Transaction history', 'NFT valuation'],
      docsUrl: 'https://zapper.fi',
      color: 'purple',
      purpose: 'Displays authentic wallet portfolio data for user verification and analytics.',
      dataPolicy: 'Shows real wallet balances and transactions. Falls back to direct blockchain calls if API unavailable.'
    },
    {
      id: 'story_protocol',
      name: 'Story Protocol Blockchain',
      description: 'IP asset registration and licensing on blockchain (Testnet)',
      icon: Wallet,
      features: ['IP asset registration', 'Licensing automation', 'Revenue tracking'],
      docsUrl: 'https://docs.story.foundation',
      color: 'orange',
      purpose: 'Registers music IP assets on Story Protocol testnet blockchain for verifiable ownership.',
      dataPolicy: 'Currently experiencing connectivity issues with testnet RPC. Registration may fail until resolved.'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect Integration',
      description: 'Web3 wallet connectivity supporting 400+ wallets',
      icon: Wallet,
      features: ['400+ wallet support', 'Cross-chain compatibility', 'Secure transactions'],
      docsUrl: 'https://walletconnect.com',
      color: 'indigo',
      purpose: 'Enables users to connect their Web3 wallets for blockchain interactions.',
      dataPolicy: 'Only connects to real user wallets. No simulated wallet connections.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">API Integrations</h1>
        <p className="text-xl text-gray-600 mb-6">
          Production API integrations powering SoundRights platform functionality.
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
              {(integrationStatuses as any).production_ready ? (
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

      <div className="space-y-8">
        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const statusInfo = getStatusInfo(integration.id);
            
            return (
              <Card key={integration.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${integration.color}-100 dark:bg-${integration.color}-900/30`}>
                        <Icon className={`h-5 w-5 text-${integration.color}-600 dark:text-${integration.color}-400`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription className="mt-1">{integration.description}</CardDescription>
                      </div>
                    </div>
                    {statusInfo.badge}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Purpose */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Purpose:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{integration.purpose}</p>
                  </div>

                  {/* Data Policy */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Data Policy:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{integration.dataPolicy}</p>
                  </div>

                  {/* Current Status Details */}
                  {statusInfo.details && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-gray-100">Current Status:</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{statusInfo.details}</p>
                    </div>
                  )}
                  
                  {/* Key Features */}
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Key Features:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {integration.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          {statusInfo.dataSource === 'authentic' ? (
                            <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                          ) : statusInfo.dataSource === 'error' ? (
                            <XCircle className="h-3 w-3 mr-2 text-red-500" />
                          ) : (
                            <Clock className="h-3 w-3 mr-2 text-gray-400" />
                          )}
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Actions */}
                  <div className="pt-2 border-t">
                    <Button size="sm" variant="outline" asChild>
                      <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Documentation
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>



        {/* Integration Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Integration Workflow</CardTitle>
            <CardDescription>How services work together in the SoundRights platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-1">1. Upload & Verify</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Yakoa IP authentication</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
                <Wallet className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-1">2. Connect Wallet</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">WalletConnect integration</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-1">3. Portfolio Analysis</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Zapper analytics</p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-center">
                <Wallet className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-1">4. Register IP</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Story Protocol blockchain</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}