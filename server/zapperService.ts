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
    this.demoMode = !this.apiKey; // Use live data when API key is available
    
    if (this.demoMode) {
      console.log('Zapper Service: No API key provided, using demo data');
    } else {
      console.log('Zapper Service: Live API enabled with provided key');
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
        'X-API-KEY': this.apiKey,
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
        total_value: 15420.85,
        tokens: [
          {
            contract_address: '0x1A2B3C4D5E6F7890123456789ABCDEF012345678',
            token_id: '101',
            name: 'Electric Dreams - Single',
            description: 'Synthwave track registered as Story Protocol IP asset',
            collection_name: 'SoundRights Music Catalog',
            owner: address,
            blockchain: 'ethereum',
            estimated_value: 2450.30
          },
          {
            contract_address: '0x2B3C4D5E6F7890123456789ABCDEF0123456789A',
            token_id: '102',
            name: 'Midnight Jazz - Album',
            description: 'Full jazz album with 12 tracks, licensing rights included',
            collection_name: 'SoundRights Music Catalog',
            owner: address,
            blockchain: 'ethereum',
            estimated_value: 8970.25
          },
          {
            contract_address: '0x3C4D5E6F7890123456789ABCDEF0123456789AB',
            token_id: '103',
            name: 'Acoustic Sessions - EP',
            description: '4-track acoustic EP with sync licensing potential',
            collection_name: 'SoundRights Music Catalog',
            owner: address,
            blockchain: 'ethereum',
            estimated_value: 3200.15
          },
          {
            contract_address: '0x4D5E6F7890123456789ABCDEF0123456789ABC',
            token_id: '104',
            name: 'Corporate Intro Theme',
            description: 'Licensed background music for commercial use',
            collection_name: 'SoundRights Music Catalog',
            owner: address,
            blockchain: 'ethereum',
            estimated_value: 800.15
          }
        ],
        transactions: [
          {
            hash: '0xabc123def456789012345678901234567890abcd',
            from: '0x0000000000000000000000000000000000000000',
            to: address,
            value: '0',
            gas_used: '180000',
            gas_price: '25000000000',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'success' as const,
            type: 'mint' as const
          },
          {
            hash: '0xdef456789012345678901234567890abcdef123',
            from: address,
            to: '0x9876543210987654321098765432109876543210',
            value: '1500000000000000000',
            gas_used: '120000',
            gas_price: '22000000000',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            status: 'success' as const,
            type: 'sale' as const
          },
          {
            hash: '0x123456789abcdef0123456789abcdef0123456789',
            from: '0x0000000000000000000000000000000000000000',
            to: address,
            value: '0',
            gas_used: '165000',
            gas_price: '20000000000',
            timestamp: new Date(Date.now() - 259200000).toISOString(),
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
          hash: '0xabc123def456789012345678901234567890abcd',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x1234567890123456789012345678901234567890',
          value: '0',
          gas_used: '180000',
          gas_price: '25000000000',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'success',
          type: 'mint'
        },
        {
          hash: '0xdef456789012345678901234567890abcdef123',
          from: '0x1234567890123456789012345678901234567890',
          to: '0x9876543210987654321098765432109876543210',
          value: '1500000000000000000',
          gas_used: '120000',
          gas_price: '22000000000',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: 'success',
          type: 'sale'
        },
        {
          hash: '0x123456789abcdef0123456789abcdef0123456789',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x1234567890123456789012345678901234567890',
          value: '0',
          gas_used: '165000',
          gas_price: '20000000000',
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          status: 'success',
          type: 'mint'
        },
        {
          hash: '0x789abcdef0123456789abcdef0123456789abcdef',
          from: '0x1234567890123456789012345678901234567890',
          to: '0x5678901234567890123456789012345678901234',
          value: '750000000000000000',
          gas_used: '110000',
          gas_price: '21000000000',
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          status: 'success',
          type: 'transfer'
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
      const response = await this.makeRequest(`/balances/${address}?api_key=${this.apiKey}`);
      
      // Transform Zapper API response to our portfolio format
      const tokens = response.balances?.map((balance: any) => ({
        contract_address: balance.token?.contractAddress || 'unknown',
        token_id: balance.token?.tokenId || '0',
        name: balance.token?.name || 'Unknown Token',
        description: balance.token?.symbol || '',
        collection_name: balance.token?.collection?.name || 'Portfolio Assets',
        owner: address,
        blockchain: balance.network || 'ethereum',
        estimated_value: balance.balanceUSD || 0
      })) || [];

      return {
        address,
        total_value: response.meta?.total || 0,
        tokens,
        transactions: [], // Will be populated separately
        updated_at: new Date().toISOString()
      };
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
      const response = await this.makeRequest(`/transactions/${address}?api_key=${this.apiKey}&limit=${limit}`);
      
      // Transform Zapper transaction data to our format
      return response.data?.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value || '0',
        gas_used: tx.gasUsed || '0',
        gas_price: tx.gasPrice || '0',
        timestamp: tx.timeStamp ? new Date(parseInt(tx.timeStamp) * 1000).toISOString() : new Date().toISOString(),
        status: tx.isError === '0' ? 'success' : 'failed',
        type: this.determineTransactionType(tx)
      })) || [];
    } catch (error) {
      console.error('Failed to fetch transactions from Zapper:', error);
      throw new Error('Failed to retrieve transaction history');
    }
  }

  private determineTransactionType(tx: any): 'mint' | 'transfer' | 'sale' {
    if (tx.from === '0x0000000000000000000000000000000000000000') return 'mint';
    if (tx.value && parseInt(tx.value) > 0) return 'sale';
    return 'transfer';
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
        token.collection_name?.includes('SoundRights') ||
        token.collection_name?.includes('Music') ||
        token.description?.includes('Story Protocol') ||
        token.description?.includes('IP asset')
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

  /**
   * Test API connection and get service status
   */
  async testConnection(): Promise<{ status: string; apiKey: string; message: string }> {
    if (this.demoMode) {
      return {
        status: 'demo',
        apiKey: 'Demo Analytics',
        message: 'Zapper Analytics: Using comprehensive demo data for portfolio visualization'
      };
    }

    try {
      // Test API connection with a simple request
      const response = await this.makeRequest(`/protocols?api_key=${this.apiKey}`);
      return {
        status: 'live',
        apiKey: this.apiKey.slice(0, 8) + '...' + this.apiKey.slice(-8),
        message: 'Zapper API connected - live portfolio data available'
      };
    } catch (error) {
      return {
        status: 'error',
        apiKey: 'Invalid',
        message: 'Failed to connect to Zapper API - check API key'
      };
    }
  }
}

export const zapperService = new ZapperService();