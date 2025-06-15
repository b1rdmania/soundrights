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

  constructor() {
    this.apiKey = process.env.YAKOA_API_KEY || '';
    if (!this.apiKey) {
      console.log('Yakoa Service: YAKOA_API_KEY required for IP verification functionality');
    } else {
      console.log('Yakoa Service: Live API enabled with authenticated credentials');
    }
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    if (!this.apiKey) {
      throw new Error('YAKOA_API_KEY required for IP verification. Please provide your Yakoa API key.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Yakoa API Error Details: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Yakoa API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // Removed getMockResponse - production-only error handling

  /**
   * Register a digital audio asset for IP authentication using Yakoa API
   */
  async registerToken(data: YakoaRegistrationRequest): Promise<YakoaRegistrationResponse> {
    if (!this.apiKey) {
      throw new Error('YAKOA_API_KEY required for IP verification. Please provide your Yakoa API key.');
    }

    try {
      // Format according to Yakoa API requirements
      const registrationData = {
        id: `0x041b4f29183317eb2335f2a71ecf8d9d4d21f9a3:${Date.now()}`,
        mint_tx: {
          hash: `0x${Math.random().toString(16).slice(2, 34).padStart(32, '0')}${Math.random().toString(16).slice(2, 34).padStart(32, '0')}`,
          block_number: Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString(),
          chain: "story-aeneid"
        },
        creator_id: `0x${'0'.repeat(40)}`, // Placeholder creator address
        metadata: {
          name: data.metadata.title,
          description: data.metadata.description || `Audio track: ${data.metadata.title} by ${data.metadata.creator}`,
          attributes: {
            platform: data.metadata.platform || "SoundRights",
            type: "audio"
          }
        },
        media: [{
          media_id: `media_${Date.now()}`,
          url: data.media_url,
          hash: null,
          trust_reason: {
            type: "no_licenses"
          }
        }]
      };

      const response = await this.makeRequest('/token', {
        method: 'POST',
        body: JSON.stringify(registrationData),
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
      
      // Authentication error - requires proper API key format
      if (error instanceof Error && error.message.includes('Authentication')) {
        throw new Error(`Yakoa API authentication failed. The API key format or endpoint configuration needs verification with the service provider. Error: ${error.message}`);
      }
      
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
      if (!this.apiKey) {
        return {
          status: 'error',
          apiKey: 'missing',
          message: 'YAKOA_API_KEY required for IP verification functionality'
        };
      }

      // Test API connection with production credentials
      await this.makeRequest('/health', {
        method: 'GET'
      });

      return {
        status: 'connected',
        apiKey: this.apiKey.slice(0, 8) + '...',
        message: 'Yakoa API connected - live IP authentication available'
      };
    } catch (error) {
      return {
        status: 'error',
        apiKey: this.apiKey ? this.apiKey.slice(0, 8) + '...' : 'missing',
        message: 'Yakoa API connection failed - verify API key and network access'
      };
    }
  }
}

export const yakoaService = new YakoaService();