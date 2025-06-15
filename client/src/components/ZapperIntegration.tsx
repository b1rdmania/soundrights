import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Wallet, ExternalLink, Search, Coins, Activity, Copy } from 'lucide-react';

interface ZapperToken {
  contract_address: string;
  token_id: string;
  name: string;
  description?: string;
  image_url?: string;
  collection_name: string;
  owner: string;
  blockchain: string;
  estimated_value?: number;
  last_sale_price?: number;
}

interface ZapperTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gas_used: string;
  gas_price: string;
  timestamp: string;
  status: 'success' | 'failed';
  type: 'mint' | 'transfer' | 'sale';
}

interface ZapperPortfolio {
  address: string;
  total_value: number;
  tokens: ZapperToken[];
  transactions: ZapperTransaction[];
  updated_at: string;
}

export default function ZapperIntegration() {
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<ZapperPortfolio | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'transactions' | 'analytics'>('portfolio');
  const { toast } = useToast();

  const fetchPortfolio = async () => {
    if (!walletAddress || !walletAddress.startsWith('0x')) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum wallet address',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/zapper/portfolio/${walletAddress}`);
      
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
        
        toast({
          title: 'Portfolio Loaded',
          description: `Found ${data.tokens.length} tokens with total value $${data.total_value.toLocaleString()}`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch portfolio');
      }
    } catch (error) {
      toast({
        title: 'Portfolio Fetch Failed',
        description: error instanceof Error ? error.message : 'Unable to fetch portfolio data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const trackIPRegistration = async () => {
    if (!walletAddress) {
      toast({
        title: 'Address Required',
        description: 'Please enter a wallet address first',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const demoTxHash = `0x${Math.random().toString(16).slice(2, 34).padStart(32, '0')}${Math.random().toString(16).slice(2, 34).padStart(32, '0')}`;
      
      const response = await fetch('/api/zapper/track-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: demoTxHash,
          userAddress: walletAddress
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: 'Registration Tracked',
          description: `IP asset registration tracked successfully`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to track registration');
      }
    } catch (error) {
      toast({
        title: 'Tracking Failed',
        description: error instanceof Error ? error.message : 'Unable to track IP registration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Address copied to clipboard',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Zapper Portfolio Analytics</h3>
        <p className="text-muted-foreground">
          Multi-chain portfolio tracking and IP asset analytics powered by Zapper API
        </p>
        <Badge variant="outline" className="mt-2">
          <BarChart3 className="w-3 h-3 mr-1" />
          Demo Environment Active
        </Badge>
      </div>

      {/* Address Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Portfolio Lookup
          </CardTitle>
          <CardDescription>
            Enter a wallet address to analyze portfolio and track IP assets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="address" className="sr-only">Wallet Address</Label>
              <Input
                id="address"
                placeholder="0x742B24aB32B6f9b6E2170df9b21845a7Ad5B6fDa"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button onClick={fetchPortfolio} disabled={loading}>
              {loading ? 'Loading...' : 'Analyze'}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setWalletAddress('0x742B24aB32B6f9b6E2170df9b21845a7Ad5B6fDa')}
              size="sm"
            >
              Demo Address
            </Button>
            <Button
              variant="outline"
              onClick={trackIPRegistration}
              disabled={loading || !walletAddress}
              size="sm"
            >
              <Activity className="h-3 w-3 mr-1" />
              Track IP Registration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Results */}
      {portfolio && (
        <div className="space-y-6">
          {/* Portfolio Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Portfolio Overview
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <span>{formatAddress(portfolio.address)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(portfolio.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatValue(portfolio.total_value)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {portfolio.tokens.length}
                  </div>
                  <div className="text-sm text-muted-foreground">NFTs/Tokens</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {portfolio.transactions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(portfolio.tokens.map(t => t.blockchain)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Chains</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="flex space-x-1 border-b">
            {[
              { id: 'portfolio', label: 'Assets', icon: Coins },
              { id: 'transactions', label: 'Activity', icon: Activity },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.tokens.map((token, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium truncate">{token.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {token.blockchain}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {token.collection_name}
                      </p>
                      
                      {token.estimated_value && (
                        <div className="text-lg font-semibold text-primary">
                          {formatValue(token.estimated_value)}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Token ID: {token.token_id}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-2">
              {portfolio.transactions.map((tx, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={tx.type === 'mint' ? 'default' : 'secondary'}>
                            {tx.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm font-mono">
                          {formatAddress(tx.hash)}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">{tx.value} ETH</div>
                        <Badge variant={tx.status === 'success' ? 'default' : 'destructive'}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(
                    portfolio.tokens.reduce((acc, token) => {
                      acc[token.blockchain] = (acc[token.blockchain] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([chain, count]) => (
                    <div key={chain} className="flex justify-between py-2">
                      <span>{chain}</span>
                      <Badge variant="secondary">{count} assets</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Value Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average Asset Value</span>
                    <span className="font-medium">
                      {formatValue(portfolio.total_value / portfolio.tokens.length)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Transactions</span>
                    <span className="font-medium">{portfolio.transactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update</span>
                    <span className="font-medium">
                      {new Date(portfolio.updated_at).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* API Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Zapper Portfolio API</h4>
              <p className="text-sm text-muted-foreground">
                Multi-chain DeFi and NFT portfolio analytics
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://docs.zapper.fi', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                API Docs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://zapper.fi', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Zapper.fi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}