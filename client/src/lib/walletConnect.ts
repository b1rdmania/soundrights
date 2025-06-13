// Simple wallet connection using backend WalletConnect service
interface WalletConnectionResult {
  address: string;
  chainId: number;
  connected: boolean;
  uri?: string;
}

interface WalletState {
  address: string;
  chainId: number;
  chainName: string;
  balance: string;
  connected: boolean;
}

// Connect wallet using backend API
export const connectWallet = async (): Promise<WalletConnectionResult> => {
  try {
    const response = await fetch('/api/walletconnect/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to connect wallet');
    }

    const data = await response.json();
    
    return {
      address: data.wallet.address,
      chainId: data.wallet.chainId,
      connected: true,
      uri: data.uri
    };
  } catch (error) {
    console.error('Wallet connection failed:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = async () => {
  try {
    const response = await fetch('/api/walletconnect/disconnect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to disconnect wallet');
    }

    return { connected: false };
  } catch (error) {
    console.error('Wallet disconnection failed:', error);
    throw error;
  }
};

// Get wallet connection status
export const getWalletStatus = async (): Promise<{ connected: boolean; wallet?: WalletState }> => {
  try {
    const response = await fetch('/api/walletconnect/status');
    
    if (!response.ok) {
      return { connected: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get wallet status:', error);
    return { connected: false };
  }
};

// Send transaction
export const sendTransaction = async (transaction: any) => {
  try {
    const response = await fetch('/api/walletconnect/send-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Transaction failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};

// Sign message
export const signMessage = async (message: string, address: string) => {
  try {
    const response = await fetch('/api/walletconnect/sign-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message, address })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Message signing failed');
    }

    const data = await response.json();
    return data.signature;
  } catch (error) {
    console.error('Message signing failed:', error);
    throw error;
  }
};

// Legacy compatibility exports
export const getWalletKit = () => null;
export const initializeWalletKit = async () => null;
export const getWalletSessions = () => ({});
export const getWalletState = getWalletStatus;