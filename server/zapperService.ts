import fetch from 'node-fetch';

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
  private readonly baseUrl = 'https://api.zapper.fi/v2';
  private readonly demoMode: boolean;

  constructor() {
    this.apiKey = process.env.ZAPPER_API_KEY || '';
    this.demoMode = !this.apiKey || process.env.NODE_ENV === 'development';
    
    if (this.demoMode) {
      console.log('Zapper Service running in demo mode - using mock responses');
    }
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    if (this.demoMode) {
      return this.getMockResponse(endpoint, options);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Zapper API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private getMockResponse(endpoint: string, options: any) {
    // Demo mode responses for testing without API key
    if (endpoint.includes('/portfolio')) {
      const address = endpoint.split('/')[2];
      return {
        address,
        total_value: 1250.75,
        tokens: [
          {
            contract_address: '0x1234567890123456789012345678901234567890',
            token_id: '1',
            name: 'Demo Music NFT',
            description: 'A registered music IP asset on Story Protocol',
            collection_name: 'SoundRights IP Assets',
            owner: address,
            blockchain: 'ethereum',
            estimated_value: 0.5
          }
        ],
        transactions: [
          {
            hash: '0xabcdef1234567890',
            from: '0x0000000000000000000000000000000000000000',
            to: address,
            value: '0',
            gas_used: '150000',
            gas_price: '20000000000',
            timestamp: new Date().toISOString(),
            status: 'success' as const,
            type: 'mint' as const
          }
        ],
        updated_at: new Date().toISOString()
      };
    }

    if (endpoint.includes('/transactions')) {
      return [
        {
          hash: '0xabcdef1234567890',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x1234567890123456789012345678901234567890',
          value: '0',
          gas_used: '150000',
          gas_price: '20000000000',
          timestamp: new Date().toISOString(),
          status: 'success',
          type: 'mint'
        }
      ];
    }

    throw new Error('Unknown endpoint in demo mode');
  }

  /**
   * Get user's portfolio including IP assets and NFTs
   */
  async getUserPortfolio(address: string): Promise<ZapperPortfolio> {
    try {
      const response = await this.makeRequest(`/portfolio/${address}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch portfolio from Zapper:', error);
      throw new Error('Failed to retrieve portfolio data');
    }
  }

  /**
   * Get transaction history for an address
   */
  async getTransactionHistory(address: string, limit: number = 50): Promise<ZapperTransaction[]> {
    try {
      const response = await this.makeRequest(`/transactions/${address}?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch transactions from Zapper:', error);
      throw new Error('Failed to retrieve transaction history');
    }
  }

  /**
   * Get NFT collection data
   */
  async getNFTCollection(contractAddress: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/nft-collections/${contractAddress}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch NFT collection from Zapper:', error);
      throw new Error('Failed to retrieve collection data');
    }
  }

  /**
   * Track Story Protocol IP asset registration
   */
  async trackIPAssetRegistration(txHash: string, userAddress: string): Promise<{
    success: boolean;
    asset_details?: any;
    transaction?: ZapperTransaction;
  }> {
    try {
      // In demo mode, return mock tracking data
      if (this.demoMode) {
        return {
          success: true,
          asset_details: {
            ip_id: `ip_${Date.now()}`,
            registered_at: new Date().toISOString(),
            owner: userAddress,
            blockchain: 'ethereum'
          },
          transaction: {
            hash: txHash,
            from: '0x0000000000000000000000000000000000000000',
            to: userAddress,
            value: '0',
            gas_used: '180000',
            gas_price: '25000000000',
            timestamp: new Date().toISOString(),
            status: 'success',
            type: 'mint'
          }
        };
      }

      // Get transaction details from Zapper
      const response = await this.makeRequest(`/transaction/${txHash}`);
      
      return {
        success: response.status === 'success',
        asset_details: response.decoded_logs?.find((log: any) => 
          log.event_name === 'IPRegistered' || log.event_name === 'Transfer'
        ),
        transaction: response
      };
    } catch (error) {
      console.error('Failed to track IP asset registration:', error);
      return { success: false };
    }
  }

  /**
   * Get analytics for Story Protocol assets owned by user
   */
  async getIPAssetAnalytics(address: string): Promise<{
    total_assets: number;
    total_value: number;
    recent_registrations: number;
    license_revenue: number;
  }> {
    try {
      const portfolio = await this.getUserPortfolio(address);
      
      // Filter for Story Protocol related assets
      const ipAssets = portfolio.tokens.filter(token => 
        token.collection_name?.toLowerCase().includes('story') ||
        token.collection_name?.toLowerCase().includes('ip') ||
        token.description?.toLowerCase().includes('intellectual property')
      );

      const recentTransactions = portfolio.transactions.filter(tx => 
        new Date(tx.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      );

      return {
        total_assets: ipAssets.length,
        total_value: ipAssets.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0),
        recent_registrations: recentTransactions.filter(tx => tx.type === 'mint').length,
        license_revenue: recentTransactions
          .filter(tx => tx.type === 'sale')
          .reduce((sum, tx) => sum + parseFloat(tx.value), 0)
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
}

export const zapperService = new ZapperService();