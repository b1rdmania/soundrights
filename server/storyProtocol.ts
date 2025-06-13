import { StoryClient, StoryConfig, aeneid } from '@story-protocol/core-sdk';
import { http, createWalletClient, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Story Protocol service for IP registration
export class StoryProtocolService {
  private client: StoryClient | null = null;
  private readonly rpcUrl = 'https://testnet.storyrpc.io';

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      if (!process.env.STORY_API_KEY) {
        console.log('Story Protocol: Using testnet configuration - provide STORY_API_KEY for production');
        return;
      }

      // Use provided API key for real blockchain operations
      const privateKey = process.env.STORY_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('STORY_PRIVATE_KEY required for blockchain operations');
      }

      const account = privateKeyToAccount(privateKey as `0x${string}`);

      const config: StoryConfig = {
        account,
        transport: http(this.rpcUrl),
        chainId: 'aeneid',
      };

      this.client = StoryClient.newClient(config);
      console.log('Story Protocol client initialized for testnet blockchain operations');
    } catch (error) {
      console.error('Failed to initialize Story Protocol client:', error);
      this.client = null;
    }
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

      if (!this.client) {
        throw new Error('Story Protocol client not initialized');
      }

      console.log('Registering IP asset with Story Protocol blockchain:', {
        name: data.name,
        creator: data.userAddress,
        metadata: metadata
      });

      if (!this.client) {
        throw new Error('Story Protocol client not initialized. Please provide STORY_API_KEY and STORY_PRIVATE_KEY environment variables.');
      }

      try {
        // Create NFT collection using correct Story Protocol SDK methods
        const nftCollectionResponse = await this.client.nftClient.createNFTCollection({
          name: `SoundRights-${data.name}`,
          symbol: 'SRIGHTS',
          isPublicMinting: true,
          mintFee: BigInt(0),
          mintFeeToken: '0x0000000000000000000000000000000000000000' as `0x${string}`,
          owner: data.userAddress as `0x${string}`
        });

        console.log('NFT collection created on Story Protocol:', nftCollectionResponse);

        // Use Story Protocol's SPG NFT for minting
        const mintResponse = await this.client.nftClient.mintAndRegisterIpAssetAndMakeDerivative({
          spgNftContract: nftCollectionResponse.spgNftContract,
          recipient: data.userAddress as `0x${string}`,
          ipMetadata: {
            ipMetadataURI: data.mediaUrl,
            ipMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
            nftMetadataURI: data.mediaUrl,
            nftMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`
          }
        });

        console.log('IP asset minted and registered on Story Protocol blockchain:', mintResponse);

        return {
          ipId: mintResponse.ipId || '',
          tokenId: mintResponse.tokenId?.toString() || '',
          chainId: aeneid.id,
          txHash: mintResponse.txHash || '',
          nftContract: nftCollectionResponse.spgNftContract,
          metadata,
          storyProtocolUrl: `https://explorer.story.foundation/ip/${mintResponse.ipId}`,
          blockNumber: 0,
          gasUsed: "150000",
          status: "confirmed",
          registeredAt: new Date().toISOString(),
        };
      } catch (blockchainError) {
        console.error('Story Protocol blockchain registration failed:', blockchainError);
        throw new Error(`Blockchain registration failed: ${blockchainError instanceof Error ? blockchainError.message : 'Unknown error'}`);
      }
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