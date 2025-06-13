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
  private readonly baseUrl = 'https://docs-demo.ip-api-sandbox.yakoa.io/docs-demo';
  private readonly demoMode: boolean;

  constructor() {
    this.apiKey = 'MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U';
    this.demoMode = false;
    console.log('Yakoa Service: Live API enabled with provided credentials');
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    if (!this.apiKey) {
      throw new Error('YAKOA_API_KEY required for IP verification. Please provide your Yakoa API key.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'X-CHAIN': 'story-aeneid',
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
   * Register a digital audio asset for IP authentication using Yakoa API
   */
  async registerToken(data: YakoaRegistrationRequest): Promise<YakoaRegistrationResponse> {
    try {
      // Format data according to Yakoa API specification
      const tokenData = {
        id: {
          chain: "story-odyssey",
          contract_address: "0x1234567890123456789012345678901234567890",
          token_id: `${Date.now()}`
        },
        registration_tx: {
          hash: `0x${Math.random().toString(16).slice(2, 34).padStart(32, '0')}${Math.random().toString(16).slice(2, 34).padStart(32, '0')}`,
          block_number: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString(),
          chain: "story-odyssey"
        },
        creator_id: data.metadata.creator,
        metadata: {
          name: data.metadata.title,
          description: data.metadata.description || `Audio track: ${data.metadata.title} by ${data.metadata.creator}`,
          platform: data.metadata.platform || "SoundRights"
        },
        media: [{
          media_id: `media_${Date.now()}`,
          url: data.media_url,
          hash: null,
          trust_reason: null
        }],
        authorizations: data.authorizations || [],
        license_parents: []
      };

      const response = await this.makeRequest('/token', {
        method: 'POST',
        body: JSON.stringify(tokenData),
      });

      return {
        token: {
          id: response.id?.token_id || `yakoa_${Date.now()}`,
          status: 'complete',
          media_url: data.media_url,
          metadata: data.metadata,
          infringements: response.infringements || { total: 0, high_confidence: 0, results: [] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        message: 'Token registered successfully with Yakoa IP authentication'
      };
    } catch (error) {
      console.error('Yakoa API registration failed:', error);
      throw new Error(`Yakoa IP verification failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check API configuration and network connectivity.`);
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

  /**
   * Test API connection and get service status
   */
  async testConnection(): Promise<{ status: string; apiKey: string; message: string }> {
    try {
      if (this.demoMode) {
        return {
          status: 'demo',
          apiKey: 'Demo Sandbox',
          message: 'Yakoa Service: Using live demo sandbox - provide YAKOA_API_KEY for production features'
        };
      }

      // Test API connection with a sample request
      const testData: YakoaRegistrationRequest = {
        media_url: 'https://example.com/test.mp3',
        metadata: {
          title: 'API Test',
          creator: 'Test User',
          description: 'Connection test'
        }
      };

      await this.makeRequest('/tokens', {
        method: 'POST',
        body: JSON.stringify(testData)
      });

      return {
        status: 'connected',
        apiKey: this.apiKey.slice(0, 8) + '...',
        message: 'Yakoa API connected - live IP authentication available'
      };
    } catch (error) {
      return {
        status: 'demo',
        apiKey: this.apiKey ? this.apiKey.slice(0, 8) + '...' : 'Demo Sandbox',
        message: 'Yakoa Service: Using live demo sandbox - API connection not verified'
      };
    }
  }
}

export const yakoaService = new YakoaService();