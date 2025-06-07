import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, polygonMumbai } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'SoundRights',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains: [sepolia, polygonMumbai],
  ssr: false,
});

// Story Protocol configuration
export const STORY_CONFIG = {
  chainId: sepolia.id, // Story Protocol runs on Sepolia testnet
  rpcUrl: 'https://rpc.sepolia.org',
  storyProtocolGateway: 'https://api.storyprotocol.xyz',
};