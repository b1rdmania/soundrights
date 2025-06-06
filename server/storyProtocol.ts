import { StoryAPIClient } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { sepolia } from 'viem/chains';

// Story Protocol configuration
const STORY_CONFIG = {
  chainId: sepolia.id,
  rpcUrl: 'https://rpc.sepolia.org',
  apiKey: process.env.STORY_API_KEY || '',
};

export class StoryProtocolService {
  private client: StoryAPIClient;

  constructor() {
    this.client = new StoryAPIClient({
      chainId: STORY_CONFIG.chainId,
      transport: http(STORY_CONFIG.rpcUrl),
      apiKey: STORY_CONFIG.apiKey,
    });
  }

  async registerIPAsset(data: {
    name: string;
    description: string;
    mediaUrl: string;
    attributes: Record<string, any>;
    userAddress: string;
  }) {
    try {
      // Create IP Asset metadata
      const metadata = {
        name: data.name,
        description: data.description,
        image: data.mediaUrl,
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
            value: value
          }))
        ]
      };

      // Register IP Asset on Story Protocol
      const response = await this.client.ipAsset.register({
        nftContract: process.env.NFT_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
        tokenId: BigInt(Math.floor(Math.random() * 1000000)),
        metadata,
        owner: data.userAddress,
      });

      return {
        ipId: response.ipId,
        tokenId: response.tokenId.toString(),
        chainId: STORY_CONFIG.chainId,
        txHash: response.txHash,
        metadata,
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
      const response = await this.client.license.create({
        ipId: data.ipId,
        licenseTerms: data.licenseTerms,
        licensee: data.licensee,
      });

      return {
        licenseId: response.licenseId,
        ipId: data.ipId,
        licensee: data.licensee,
        txHash: response.txHash,
        terms: data.licenseTerms,
      };
    } catch (error) {
      console.error('Story Protocol license creation error:', error);
      throw new Error(`Failed to create license: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getIPAsset(ipId: string) {
    try {
      const response = await this.client.ipAsset.get(ipId);
      return response;
    } catch (error) {
      console.error('Story Protocol fetch error:', error);
      throw new Error(`Failed to fetch IP asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLicenses(ipId: string) {
    try {
      const response = await this.client.license.getByIpId(ipId);
      return response;
    } catch (error) {
      console.error('Story Protocol license fetch error:', error);
      throw new Error(`Failed to fetch licenses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const storyService = new StoryProtocolService();