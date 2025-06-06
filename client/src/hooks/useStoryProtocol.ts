import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';

export interface IPRegistrationData {
  name: string;
  description: string;
  mediaUrl: string;
  attributes: Record<string, any>;
}

export interface IPAsset {
  ipId: string;
  tokenId: string;
  chainId: number;
  metadata: {
    name: string;
    description: string;
    mediaUrl: string;
  };
  blockchainTxHash?: string;
}

export function useStoryProtocol() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simplified Story Protocol integration using direct API calls
  const storyApiCall = useCallback(async (endpoint: string, data: any) => {
    const response = await fetch(`/api/story/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        userAddress: address,
      }),
    });

    if (!response.ok) {
      throw new Error(`Story Protocol API error: ${response.statusText}`);
    }

    return response.json();
  }, [address]);

  const registerIP = useCallback(async (data: IPRegistrationData): Promise<IPAsset> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await storyApiCall('register-ip', {
        name: data.name,
        description: data.description,
        mediaUrl: data.mediaUrl,
        attributes: data.attributes,
      });

      const ipAsset: IPAsset = {
        ipId: response.ipId,
        tokenId: response.tokenId,
        chainId: response.chainId,
        blockchainTxHash: response.txHash,
        metadata: {
          name: data.name,
          description: data.description,
          mediaUrl: data.mediaUrl,
        },
      };

      return ipAsset;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register IP';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, storyApiCall]);

  const createLicense = useCallback(async (ipId: string, licenseTerms: any) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await storyApiCall('create-license', {
        ipId,
        licenseTerms,
        licensee: address,
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create license';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, storyApiCall]);

  const getIPAsset = useCallback(async (ipId: string) => {
    try {
      const response = await storyApiCall('get-ip-asset', { ipId });
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch IP asset';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [storyApiCall]);

  return {
    registerIP,
    createLicense,
    getIPAsset,
    isLoading,
    error,
    isConnected,
  };
}