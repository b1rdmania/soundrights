import { WalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';

// Initialize Core instance with provided project ID
const core = new Core({
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '1c6eba6fc7f6b210609dbd6cccef8199'
});

// Reown WalletKit metadata configuration
const metadata = {
  name: 'SoundRights',
  description: 'Web3 Music IP Registration and Licensing Platform',
  url: 'https://soundrights.app',
  icons: ['https://assets.reown.com/reown-profile-pic.png']
};

// Initialize WalletKit instance with proper async init
let walletKit: any = null;

export const initializeWalletKit = async () => {
  if (!walletKit) {
    walletKit = await WalletKit.init({
      core,
      metadata
    });
  }
  return walletKit;
};

export const getWalletKit = () => walletKit;

// Wallet connection utilities with real WalletConnect integration
export const connectWallet = async () => {
  try {
    const kit = await initializeWalletKit();
    
    // Create session proposal
    const { uri, approval } = await kit.connect({
      requiredNamespaces: {
        eip155: {
          methods: ['eth_sendTransaction', 'personal_sign'],
          chains: ['eip155:11155111', 'eip155:1513'], // Sepolia + Story Protocol testnets
          events: ['accountsChanged', 'chainChanged']
        }
      }
    });

    // Return connection info
    const session = await approval();
    const address = session.namespaces.eip155.accounts[0]?.split(':')[2];
    const chainId = parseInt(session.namespaces.eip155.chains[0]?.split(':')[1] || '11155111');

    return {
      address,
      chainId,
      connected: true,
      uri // For QR code display if needed
    };
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};

export const disconnectWallet = async () => {
  try {
    const kit = getWalletKit();
    if (kit) {
      const sessions = kit.getActiveSessions();
      for (const session of Object.values(sessions) as any[]) {
        await kit.disconnect({
          topic: session.topic,
          reason: { code: 6000, message: 'User disconnected' }
        });
      }
    }
    return { connected: false };
  } catch (error) {
    console.error('Wallet disconnection failed:', error);
    throw error;
  }
};

export const getWalletSessions = () => {
  try {
    const kit = getWalletKit();
    return kit ? kit.getActiveSessions() : {};
  } catch (error) {
    console.error('Failed to get sessions:', error);
    return {};
  }
};

export const signMessage = async (message: string, address: string) => {
  try {
    // Demo implementation for message signing
    return `0x${'a'.repeat(130)}`; // Mock signature
  } catch (error) {
    console.error('Message signing failed:', error);
    throw error;
  }
};

export const sendTransaction = async (transaction: any) => {
  try {
    // Demo implementation for transaction sending
    return { 
      txHash: `0x${'b'.repeat(64)}`, 
      status: 'pending' as const 
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};