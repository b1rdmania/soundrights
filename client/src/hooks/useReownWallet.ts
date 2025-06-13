import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, getWalletStatus, signMessage, sendTransaction } from '@/lib/walletConnect';

interface WalletState {
  address: string | null;
  chainId: number | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

export function useReownWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    connected: false,
    connecting: false,
    error: null
  });

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        const status = await getWalletStatus();
        if (status.connected && status.wallet) {
          setWalletState({
            address: status.wallet.address,
            chainId: status.wallet.chainId,
            connected: true,
            connecting: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Failed to check wallet status:', error);
      }
    };

    checkWalletStatus();
  }, []);

  const connect = async () => {
    setWalletState(prev => ({ ...prev, connecting: true, error: null }));
    
    try {
      const result = await connectWallet();
      setWalletState({
        address: result.address,
        chainId: result.chainId,
        connected: result.connected,
        connecting: false,
        error: null
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setWalletState(prev => ({
        ...prev,
        connecting: false,
        error: errorMessage
      }));
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setWalletState({
        address: null,
        chainId: null,
        connected: false,
        connecting: false,
        error: null
      });
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const sign = async (message: string) => {
    if (!walletState.connected || !walletState.address) {
      throw new Error('Wallet not connected');
    }
    return await signMessage(message, walletState.address);
  };

  const sendTx = async (transaction: any) => {
    if (!walletState.connected) {
      throw new Error('Wallet not connected');
    }
    return await sendTransaction(transaction);
  };

  return {
    ...walletState,
    connect,
    disconnect,
    signMessage: sign,
    sendTransaction: sendTx
  };
}