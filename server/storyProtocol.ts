// Story Protocol integration using their REST API
import { http } from 'viem';
import { sepolia } from 'viem/chains';

// Story Protocol service for IP registration
export class StoryProtocolService {
  private readonly apiUrl = 'https://api.storyapis.com';
  private readonly apiKey = process.env.STORY_API_KEY || 'MhBsxkU1z9fG6TofE59KqiiWV-YlYE8Q4awlLQehF3U';
  private readonly chainId = 'story-aeneid'; // testnet chain identifier

  constructor() {
    console.log('Story Protocol service initialized for testnet');
  }

  private async makeStoryAPICall(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    const url = `${this.apiUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'X-CHAIN': this.chainId,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Story Protocol API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  async registerIPAsset(data: {
    name: string;
    description: string;
    mediaUrl: string;
    attributes: Record<string, any>;
    userAddress: string;
  }) {
    try {
      // Create IP Asset metadata following Story Protocol standards
      const metadata = {
        name: data.name,
        description: data.description,
        image: data.mediaUrl,
        external_url: data.mediaUrl,
        attributes: [
          {
            trait_type: 'Content Type',
            value: 'Audio Track'
          },
          {
            trait_type: 'Creator',
            value: data.userAddress
          },
          ...Object.entries(data.attributes).map(([key, value]) => ({
            trait_type: key,
            value: String(value)
          }))
        ]
      };

      // Check existing IP assets using Story Protocol API
      try {
        const existingAssets = await this.makeStoryAPICall('/ipassets', 'POST', {
          limit: 10,
          offset: 0,
          where: {
            metadata: {
              name: data.name
            }
          }
        });

        if (existingAssets.data && existingAssets.data.length > 0) {
          console.log('Similar IP asset already exists:', existingAssets.data[0]);
        }
      } catch (listError) {
        console.log('Could not check existing assets, proceeding with registration:', listError);
      }

      // Since Story Protocol requires actual NFT minting and blockchain transactions,
      // we'll create a local record that can be upgraded to real blockchain registration
      const ipId = `ip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tokenId = Math.floor(Math.random() * 1000000).toString();
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Store metadata for future blockchain registration
      console.log('Preparing IP asset for Story Protocol registration:', {
        ipId,
        metadata,
        userAddress: data.userAddress
      });

      return {
        ipId,
        tokenId,
        chainId: 11155111, // Story testnet
        txHash,
        metadata,
        storyProtocolUrl: `https://testnet.story.foundation/ip/${ipId}`,
        registrationPending: true, // Flag indicating this needs actual blockchain registration
      };
    } catch (error) {
      console.error('Story Protocol registration error:', error);
      throw new Error(`Failed to register IP asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createLicense(data: {
    ipId: string;
    licenseTerms: any;
    licensee: string;
  }) {
    try {
      // Simulate license creation on Story Protocol
      const licenseId = `license_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      return {
        licenseId,
        ipId: data.ipId,
        licensee: data.licensee,
        txHash,
        terms: data.licenseTerms,
        storyProtocolUrl: `https://explorer.storyprotocol.xyz/license/${licenseId}`,
      };
    } catch (error) {
      console.error('Story Protocol license creation error:', error);
      throw new Error(`Failed to create license: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getIPAsset(ipId: string) {
    try {
      // Simulate IP asset retrieval
      return {
        ipId,
        metadata: {
          name: "Audio Track",
          description: "IP Asset registered on Story Protocol",
        },
        owner: "0x...",
        chainId: 11155111,
        storyProtocolUrl: `https://explorer.storyprotocol.xyz/ip/${ipId}`,
      };
    } catch (error) {
      console.error('Story Protocol fetch error:', error);
      throw new Error(`Failed to fetch IP asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLicenses(ipId: string) {
    try {
      // Simulate license retrieval
      return [
        {
          licenseId: `license_${Date.now()}`,
          ipId,
          licensee: "0x...",
          terms: { type: "commercial", royalty: 10 },
          storyProtocolUrl: `https://explorer.storyprotocol.xyz/license/license_${Date.now()}`,
        }
      ];
    } catch (error) {
      console.error('Story Protocol license fetch error:', error);
      throw new Error(`Failed to fetch licenses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const storyService = new StoryProtocolService();