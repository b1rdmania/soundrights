import fetch from 'node-fetch';

export interface TomoUser {
  id: string;
  email?: string;
  wallet_address?: string;
  social_profiles?: {
    twitter?: string;
    discord?: string;
    github?: string;
  };
  verified: boolean;
  created_at: string;
}

export interface TomoWallet {
  address: string;
  chain: string;
  balance?: string;
  verified: boolean;
}

export interface TomoAuthResponse {
  access_token: string;
  refresh_token: string;
  user: TomoUser;
  expires_in: number;
}

export class TomoService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.tomo.so/v1';
  private readonly demoMode: boolean;

  constructor() {
    this.apiKey = process.env.TOMO_API_KEY || '';
    this.demoMode = !this.apiKey || process.env.NODE_ENV === 'development';
    
    if (this.demoMode) {
      console.log('Tomo Service running in demo mode - using mock responses');
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
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Tomo API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private getMockResponse(endpoint: string, options: any) {
    // Demo mode responses for testing without API key
    if (endpoint === '/auth/social' && options.method === 'POST') {
      return {
        access_token: `tomo_demo_${Date.now()}`,
        refresh_token: `refresh_demo_${Date.now()}`,
        user: {
          id: `tomo_user_${Math.random().toString(36).substr(2, 9)}`,
          email: 'demo@example.com',
          wallet_address: '0x1234567890123456789012345678901234567890',
          social_profiles: {
            twitter: '@demouser'
          },
          verified: true,
          created_at: new Date().toISOString()
        },
        expires_in: 3600
      };
    }

    if (endpoint.startsWith('/users/')) {
      const userId = endpoint.split('/')[2];
      return {
        id: userId,
        email: 'demo@example.com',
        wallet_address: '0x1234567890123456789012345678901234567890',
        verified: true,
        created_at: new Date().toISOString()
      };
    }

    if (endpoint.startsWith('/wallets/')) {
      return [
        {
          address: '0x1234567890123456789012345678901234567890',
          chain: 'ethereum',
          balance: '1.5',
          verified: true
        }
      ];
    }

    throw new Error('Unknown endpoint in demo mode');
  }

  /**
   * Authenticate user via social login
   */
  async authenticateUser(provider: string, code: string): Promise<TomoAuthResponse> {
    try {
      const response = await this.makeRequest('/auth/social', {
        method: 'POST',
        body: JSON.stringify({
          provider,
          code,
          redirect_uri: `${process.env.BASE_URL}/auth/tomo/callback`
        }),
      });

      return response;
    } catch (error) {
      console.error('Failed to authenticate with Tomo:', error);
      throw new Error('Social authentication failed');
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(userId: string): Promise<TomoUser> {
    try {
      const response = await this.makeRequest(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch user profile from Tomo:', error);
      throw new Error('Failed to retrieve user profile');
    }
  }

  /**
   * Get user's connected wallets
   */
  async getUserWallets(userId: string): Promise<TomoWallet[]> {
    try {
      const response = await this.makeRequest(`/wallets/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch user wallets from Tomo:', error);
      throw new Error('Failed to retrieve wallet information');
    }
  }

  /**
   * Generate social login URL
   */
  generateAuthUrl(provider: 'twitter' | 'discord' | 'github'): string {
    if (this.demoMode) {
      return `/api/auth/tomo/demo?provider=${provider}`;
    }

    const params = new URLSearchParams({
      client_id: this.apiKey,
      response_type: 'code',
      redirect_uri: `${process.env.BASE_URL}/api/auth/tomo/callback`,
      scope: 'profile wallets',
      provider
    });

    return `${this.baseUrl}/auth/authorize?${params.toString()}`;
  }

  /**
   * Verify wallet ownership
   */
  async verifyWallet(address: string, signature: string, message: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('/wallets/verify', {
        method: 'POST',
        body: JSON.stringify({
          address,
          signature,
          message
        }),
      });

      return response.verified;
    } catch (error) {
      console.error('Failed to verify wallet with Tomo:', error);
      return false;
    }
  }
}

export const tomoService = new TomoService();