import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  DollarSign, 
  Music, 
  Shield,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useReownWallet } from '@/hooks/useReownWallet';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export default function Analytics() {
  const { address, connected } = useReownWallet();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [analysisAddress, setAnalysisAddress] = useState('');

  // Use wallet address as default if connected
  useEffect(() => {
    if (connected && address) {
      setSelectedAddress(address);
      setAnalysisAddress(address);
    }
  }, [connected, address]);

  // Fetch portfolio data
  const { data: portfolio, isLoading: portfolioLoading, refetch: refetchPortfolio } = useQuery({
    queryKey: ['/api/zapper/portfolio', analysisAddress],
    enabled: !!analysisAddress,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch transaction history
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/zapper/transactions', analysisAddress],
    enabled: !!analysisAddress,
  });

  // Fetch IP asset analytics
  const { data: ipAnalytics, isLoading: ipLoading } = useQuery({
    queryKey: ['/api/zapper/ip-analytics', analysisAddress],
    enabled: !!analysisAddress,
  });

  const handleAnalyzeAddress = () => {
    if (selectedAddress) {
      setAnalysisAddress(selectedAddress);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Prepare chart data with proper type checking
  const portfolioChartData = (portfolio as any)?.tokens?.slice(0, 5).map((token: any) => ({
    name: token.collection_name || token.name,
    value: token.estimated_value || 0,
    tokens: 1
  })) || [];

  const transactionChartData = (transactions as any)?.slice(0, 10).map((tx: any, index: number) => ({
    date: new Date(tx.timestamp).toLocaleDateString(),
    value: parseFloat(tx.value) || 0,
    type: tx.type,
    index
  })) || [];

  const ipAssetDistribution = ipAnalytics ? [
    { name: 'Story Protocol Assets', value: (ipAnalytics as any)?.story_assets || 0 },
    { name: 'Music NFTs', value: (ipAnalytics as any)?.music_nfts || 0 },
    { name: 'Other IP', value: (ipAnalytics as any)?.other_ip || 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Portfolio Analytics
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comprehensive Web3 portfolio analysis powered by Zapper API
            </p>
          </div>

          {/* Address Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Analyze Wallet Portfolio
              </CardTitle>
              <CardDescription>
                Enter a wallet address to analyze their Web3 portfolio and IP assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    placeholder="0x1234...5678 or connect wallet"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleAnalyzeAddress}
                  disabled={!selectedAddress}
                  className="mb-0"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Analyze
                </Button>
                {analysisAddress && (
                  <Button 
                    variant="outline"
                    onClick={() => refetchPortfolio()}
                    className="mb-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {connected && address && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 dark:text-green-200">
                      Connected wallet: {formatAddress(address)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {analysisAddress && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="ip-assets">IP Assets</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Portfolio Value */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {portfolioLoading ? '...' : formatCurrency((portfolio as any)?.total_value || 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Powered by Zapper API
                      </p>
                    </CardContent>
                  </Card>

                  {/* Total Assets */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                      <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {portfolioLoading ? '...' : (portfolio as any)?.tokens?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        NFTs and tokens
                      </p>
                    </CardContent>
                  </Card>

                  {/* Transactions */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {transactionsLoading ? '...' : transactions?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Last 50 transactions
                      </p>
                    </CardContent>
                  </Card>

                  {/* IP Assets */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">IP Assets</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {ipLoading ? '...' : (ipAnalytics?.story_assets || 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Story Protocol assets
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Portfolio Distribution Chart */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Portfolio Distribution</CardTitle>
                    <CardDescription>Top assets by estimated value</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={portfolioChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Portfolio</CardTitle>
                    <CardDescription>
                      Detailed view of all NFTs and tokens in wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {portfolioLoading ? (
                      <div className="text-center py-8">Loading portfolio...</div>
                    ) : portfolio?.tokens?.length ? (
                      <div className="space-y-4">
                        {portfolio.tokens.map((token: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              {token.image_url && (
                                <img 
                                  src={token.image_url} 
                                  alt={token.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <h3 className="font-semibold">{token.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {token.collection_name}
                                </p>
                                <Badge variant="secondary" className="text-xs">
                                  {token.blockchain}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {formatCurrency(token.estimated_value || 0)}
                              </div>
                              {token.last_sale_price && (
                                <div className="text-sm text-muted-foreground">
                                  Last sale: {formatCurrency(token.last_sale_price)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No assets found in this wallet
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      Recent blockchain transactions and activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {transactionsLoading ? (
                      <div className="text-center py-8">Loading transactions...</div>
                    ) : transactions?.length ? (
                      <div className="space-y-4">
                        {transactions.slice(0, 20).map((tx: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={tx.type === 'mint' ? 'default' : tx.type === 'sale' ? 'destructive' : 'secondary'}
                                >
                                  {tx.type}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(tx.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-sm font-mono mt-1">
                                {formatAddress(tx.from)} → {formatAddress(tx.to)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {parseFloat(tx.value).toFixed(4)} ETH
                              </div>
                              <Button variant="ghost" size="sm" asChild>
                                <a 
                                  href={`https://etherscan.io/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ip-assets">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* IP Asset Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>IP Asset Distribution</CardTitle>
                      <CardDescription>Breakdown of intellectual property assets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={ipAssetDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {ipAssetDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Story Protocol Integration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Story Protocol Assets</CardTitle>
                      <CardDescription>IP assets registered on Story Protocol</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ipLoading ? (
                        <div className="text-center py-8">Loading IP analytics...</div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                            <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                              Registered IP Assets
                            </h3>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                              {ipAnalytics?.story_assets || 0}
                            </p>
                          </div>
                          
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                              Music NFTs
                            </h3>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                              {ipAnalytics?.music_nfts || 0}
                            </p>
                          </div>

                          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                            <h3 className="font-semibold text-green-800 dark:text-green-200">
                              Total IP Value
                            </h3>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                              {formatCurrency(ipAnalytics?.total_ip_value || 0)}
                            </p>
                          </div>

                          <Button asChild className="w-full">
                            <a 
                              href="https://testnet.storyscan.xyz" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on Story Protocol Explorer
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!analysisAddress && (
            <Card className="text-center py-12">
              <CardContent>
                <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Enter a wallet address above to start analyzing their Web3 portfolio and IP assets
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}