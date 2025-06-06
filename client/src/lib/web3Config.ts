import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, polygonMumbai } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SoundRights',
  projectId: process.env.WALLETCONNECT_PROJECT_ID || 'a1b2c3d4e5f6g7h8i9j0',
  chains: [sepolia, polygonMumbai],
  ssr: false,
});

// Story Protocol configuration
export const STORY_CONFIG = {
  chainId: sepolia.id, // Story Protocol runs on Sepolia testnet
  rpcUrl: 'https://rpc.sepolia.org',
  storyProtocolGateway: 'https://api.storyprotocol.xyz',
};