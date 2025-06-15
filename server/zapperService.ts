import { blockchainService } from './blockchainService';

export interface ZapperToken {
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

export interface ZapperTransaction {
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

export interface ZapperPortfolio {
  address: string;
  total_value: number;
  tokens: ZapperToken[];
  transactions: ZapperTransaction[];
  updated_at: string;
}

export class ZapperService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://public.zapper.xyz/graphql';

  constructor() {
    this.apiKey = process.env.ZAPPER_API_KEY || '';
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    if (!this.apiKey) {
      throw new Error('Zapper API key required for portfolio data. Please configure ZAPPER_API_KEY.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
        ...options.headers,
      },
      body: JSON.stringify(options.body),
    });

    if (!response.ok) {
      throw new Error(`Zapper API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserPortfolio(address: string): Promise<ZapperPortfolio> {
    try {
      const graphqlQuery = {
        query: `
          query GetPortfolio($address: String!) {
            portfolio(address: $address) {
              tokenBalances {
                token {
                  address
                  name
                  symbol
                  network
                }
                balanceUSD
              }
            }
          }
        `,
        variables: { address }
      };

      const response = await this.makeRequest('', { body: graphqlQuery });
      
      const tokenBalances = response.data?.portfolio?.tokenBalances || [];
      const tokens = tokenBalances.map((balance: any) => ({
        contract_address: balance.token?.address || 'unknown',
        token_id: '0',
        name: balance.token?.name || balance.token?.symbol || 'Unknown Token',
        description: balance.token?.symbol || '',
        collection_name: 'Portfolio Assets',
        owner: address,
        blockchain: balance.token?.network?.toLowerCase() || 'ethereum',
        estimated_value: balance.balanceUSD || 0
      }));

      const totalValue = tokens.reduce((sum: number, token: any) => sum + token.estimated_value, 0);

      return {
        address,
        total_value: totalValue,
        tokens,
        transactions: [],
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Zapper API failed, attempting blockchain fallback:', error);
      return await blockchainService.getWalletPortfolio(address);
    }
  }

  async getTransactionHistory(address: string, limit: number = 50): Promise<ZapperTransaction[]> {
    try {
      const response = await this.makeRequest(`/transactions/${address}?limit=${limit}`);
      
      return response.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gas_used: tx.gasUsed,
        gas_price: tx.gasPrice,
        timestamp: tx.timestamp,
        status: tx.status,
        type: this.determineTransactionType(tx, address)
      }));
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      throw new Error(`Transaction history unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private determineTransactionType(tx: any, address: string): 'mint' | 'transfer' | 'sale' {
    if (tx.from === '0x0000000000000000000000000000000000000000') return 'mint';
    if (tx.value && parseFloat(tx.value) > 0) return 'sale';
    return 'transfer';
  }

  async getNFTCollection(contractAddress: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/collections/${contractAddress}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch NFT collection:', error);
      throw new Error(`NFT collection data unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async trackIPAssetRegistration(txHash: string, userAddress: string): Promise<{
    success: boolean;
    asset_details?: any;
    transaction?: ZapperTransaction;
  }> {
    try {
      const portfolio = await this.getUserPortfolio(userAddress);
      const transaction = portfolio.transactions.find(tx => tx.hash === txHash);
      
      if (!transaction) {
        throw new Error(`Transaction ${txHash} not found for address ${userAddress}`);
      }

      return {
        success: true,
        asset_details: {
          contract_address: transaction.to,
          token_id: 'pending',
          registration_tx: txHash,
          owner: userAddress,
          status: 'registered'
        },
        transaction
      };
    } catch (error) {
      console.error('Failed to track IP asset registration:', error);
      throw new Error(`IP asset tracking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getIPAssetAnalytics(address: string): Promise<{
    total_assets: number;
    total_value: number;
    recent_registrations: number;
    license_revenue: number;
  }> {
    try {
      const portfolio = await this.getUserPortfolio(address);
      
      const ipAssets = portfolio.tokens.filter((token: any) => 
        token.collection_name.includes('IP') || 
        token.description?.includes('license') ||
        token.name.includes('Rights')
      );

      const recentTransactions = portfolio.transactions.filter((tx: any) => 
        new Date(tx.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      return {
        total_assets: ipAssets.length,
        total_value: ipAssets.reduce((sum: number, asset: any) => sum + (asset.estimated_value || 0), 0),
        recent_registrations: recentTransactions.filter((tx: any) => tx.type === 'mint').length,
        license_revenue: recentTransactions
          .filter((tx: any) => tx.type === 'sale')
          .reduce((sum: number, tx: any) => sum + parseFloat(tx.value || '0'), 0)
      };
    } catch (error) {
      console.error('Failed to get IP asset analytics:', error);
      return {
        total_assets: 0,
        total_value: 0,
        recent_registrations: 0,
        license_revenue: 0
      };
    }
  }

  async testConnection(): Promise<{ status: string; apiKey: string; message: string }> {
    try {
      if (!this.apiKey) {
        return {
          status: 'error',
          apiKey: 'missing',
          message: 'ZAPPER_API_KEY environment variable not configured'
        };
      }

      const testQuery = {
        query: `query { portfolio(address: "0x0000000000000000000000000000000000000000") { tokenBalances { token { name } } } }`
      };

      await this.makeRequest('', { body: testQuery });
      
      return {
        status: 'connected',
        apiKey: this.apiKey.substring(0, 8) + '...',
        message: 'Zapper API connection successful'
      };
    } catch (error) {
      return {
        status: 'error',
        apiKey: this.apiKey ? 'present' : 'missing',
        message: `Zapper API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export const zapperService = new ZapperService();