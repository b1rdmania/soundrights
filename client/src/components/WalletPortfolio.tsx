import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, ArrowUp, ArrowDown, DollarSign, Music, Clock } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/ErrorHandler';

interface WalletData {
  address: string;
  totalValue: number;
  tokens: Array<{
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
  }>;
  transactions: Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    gas_used: string;
    gas_price: string;
    timestamp: string;
    status: 'success' | 'failed';
    type: 'mint' | 'transfer' | 'sale';
  }>;
  updated_at: string;
}

interface WalletPortfolioProps {
  walletAddress?: string;
}

export default function WalletPortfolio({ walletAddress }: WalletPortfolioProps) {
  const { data: portfolioData, isLoading, error } = useQuery({
    queryKey: ['/api/wallet/portfolio', walletAddress],
    enabled: !!walletAddress,
    retry: false,
  });

  const portfolio = portfolioData as WalletData | undefined;

  if (!walletAddress) {
    return (
      <EmptyState
        icon={Wallet}
        title="No wallet connected"
        description="Connect your wallet to view portfolio analytics"
        actionLabel="Connect Wallet"
        actionHref="/dashboard"
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading portfolio data..." />;
  }

  if (error) {
    const errorMessage = error?.message || 'Unknown error';
    const isCredentialsError = errorMessage.includes('credentials') || errorMessage.includes('API access');
    
    return (
      <EmptyState
        icon={Wallet}
        title={isCredentialsError ? "API Access Required" : "Unable to load portfolio"}
        description={isCredentialsError ? 
          "Portfolio analytics require updated Zapper API credentials. Contact support for access." : 
          "Please check your wallet connection and try again"
        }
      />
    );
  }

  if (!portfolio) {
    return (
      <EmptyState
        icon={Wallet}
        title="No portfolio data"
        description="No portfolio information found for this wallet address"
      />
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mint':
        return <Music className="w-4 h-4 text-green-600" />;
      case 'sale':
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <ArrowUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'mint':
        return 'bg-green-100 text-green-800';
      case 'sale':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
              <p className="font-mono text-sm">{formatAddress(portfolio.address)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(portfolio.totalValue)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolio.tokens.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Music IP Assets & NFTs</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.tokens.length === 0 ? (
            <EmptyState
              icon={Music}
              title="No assets found"
              description="Your wallet doesn't contain any music IP assets or NFTs yet"
            />
          ) : (
            <div className="space-y-4">
              {portfolio.tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    {token.image_url ? (
                      <img
                        src={token.image_url}
                        alt={token.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-purple-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{token.name}</h3>
                      <p className="text-sm text-gray-600">{token.collection_name}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {token.blockchain}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    {token.estimated_value && (
                      <p className="font-semibold">
                        {formatCurrency(token.estimated_value)}
                      </p>
                    )}
                    {token.last_sale_price && (
                      <p className="text-sm text-gray-600">
                        Last: {formatCurrency(token.last_sale_price)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.transactions.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No transactions found"
              description="No recent transaction history available"
            />
          ) : (
            <div className="space-y-3">
              {portfolio.transactions.slice(0, 10).map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(tx.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className={getTransactionColor(tx.type)}>
                          {tx.type}
                        </Badge>
                        <Badge variant="outline" className={tx.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 font-mono mt-1">
                        {formatAddress(tx.hash)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {parseFloat(tx.value).toFixed(4)} ETH
                    </p>
                    <p className="text-sm text-gray-600">
                      Gas: {parseFloat(tx.gas_used).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">IP Asset Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Music NFTs</span>
                  <span className="text-sm font-medium">
                    {portfolio.tokens.filter(t => t.collection_name.toLowerCase().includes('music')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Other Assets</span>
                  <span className="text-sm font-medium">
                    {portfolio.tokens.filter(t => !t.collection_name.toLowerCase().includes('music')).length}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Transaction Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Mints</span>
                  <span className="text-sm font-medium">
                    {portfolio.transactions.filter(tx => tx.type === 'mint').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sales</span>
                  <span className="text-sm font-medium">
                    {portfolio.transactions.filter(tx => tx.type === 'sale').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Transfers</span>
                  <span className="text-sm font-medium">
                    {portfolio.transactions.filter(tx => tx.type === 'transfer').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}