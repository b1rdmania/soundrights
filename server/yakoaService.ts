import fetch from 'node-fetch';

export interface YakoaToken {
  id: string;
  status: 'pending' | 'complete' | 'failed';
  media_url: string;
  metadata: {
    title?: string;
    creator?: string;
    description?: string;
  };
  infringements?: {
    total: number;
    high_confidence: number;
    results: Array<{
      confidence: number;
      source: string;
      description: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export interface YakoaRegistrationRequest {
  media_url: string;
  metadata: {
    title: string;
    creator: string;
    description?: string;
    platform?: string;
  };
  authorizations?: Array<{
    brand_id: string;
    permission_type: string;
  }>;
}

export interface YakoaRegistrationResponse {
  token: YakoaToken;
  message: string;
}

export class YakoaService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.yakoa.io/v1';
  private readonly demoMode: boolean;

  constructor() {
    this.apiKey = process.env.YAKOA_API_KEY || '';
    this.demoMode = !this.apiKey || process.env.NODE_ENV === 'development';
    
    if (this.demoMode) {
      console.log('Yakoa Service running in demo mode - using mock responses');
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
      throw new Error(`Yakoa API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private getMockResponse(endpoint: string, options: any) {
    // Demo mode responses for testing without API key
    if (endpoint === '/tokens' && options.method === 'POST') {
      const body = JSON.parse(options.body);
      return {
        token: {
          id: `yakoa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'complete',
          media_url: body.media_url,
          metadata: body.metadata,
          infringements: {
            total: 0,
            high_confidence: 0,
            results: []
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        message: 'Token registered successfully (demo mode)'
      };
    }

    if (endpoint.startsWith('/tokens/')) {
      const tokenId = endpoint.split('/')[2];
      return {
        id: tokenId,
        status: 'complete',
        media_url: 'https://example.com/audio.mp3',
        metadata: {
          title: 'Demo Track',
          creator: 'Demo Creator'
        },
        infringements: {
          total: 0,
          high_confidence: 0,
          results: []
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    throw new Error('Unknown endpoint in demo mode');
  }

  /**
   * Register a digital audio asset for IP authentication
   */
  async registerToken(data: YakoaRegistrationRequest): Promise<YakoaRegistrationResponse> {
    try {
      const response = await this.makeRequest('/tokens', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response;
    } catch (error) {
      console.error('Failed to register token with Yakoa:', error);
      throw new Error('IP authentication check failed');
    }
  }

  /**
   * Get the status and results of a registered token
   */
  async getToken(tokenId: string): Promise<YakoaToken> {
    try {
      const response = await this.makeRequest(`/tokens/${tokenId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch token from Yakoa:', error);
      throw new Error('Failed to retrieve IP authentication results');
    }
  }

  /**
   * Check if content is original (no high-confidence infringements)
   */
  async checkOriginality(mediaUrl: string, metadata: any): Promise<{
    isOriginal: boolean;
    confidence: number;
    yakoaTokenId: string;
    infringements: any[];
  }> {
    const registrationData: YakoaRegistrationRequest = {
      media_url: mediaUrl,
      metadata: {
        title: metadata.title || 'Untitled',
        creator: metadata.artist || metadata.creator || 'Unknown',
        description: metadata.description || `Audio track uploaded for IP verification`,
        platform: 'SoundRights'
      }
    };

    const registration = await this.registerToken(registrationData);
    let token = registration.token;

    // Wait for processing if still pending
    let attempts = 0;
    while (token.status === 'pending' && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      token = await this.getToken(token.id);
      attempts++;
    }

    const isOriginal = !token.infringements || token.infringements.high_confidence === 0;
    const confidence = isOriginal ? 1.0 : (1.0 - (token.infringements?.high_confidence || 0) / (token.infringements?.total || 1));

    return {
      isOriginal,
      confidence,
      yakoaTokenId: token.id,
      infringements: token.infringements?.results || []
    };
  }
}

export const yakoaService = new YakoaService();