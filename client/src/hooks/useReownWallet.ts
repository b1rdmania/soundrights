import { useState, useEffect } from 'react';
import { getWalletKit, initializeWalletKit, connectWallet, disconnectWallet, signMessage, sendTransaction, getWalletSessions } from '@/lib/reownConfig';

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

  // Initialize WalletKit and check for existing sessions
  useEffect(() => {
    const initializeAndCheck = async () => {
      try {
        await initializeWalletKit();
        const sessions = getWalletSessions();
        const sessionKeys = Object.keys(sessions);
        
        if (sessionKeys.length > 0) {
          const session = sessions[sessionKeys[0]] as any;
          if (session && session.namespaces?.eip155) {
            const address = session.namespaces.eip155.accounts[0]?.split(':')[2];
            const chainId = parseInt(session.namespaces.eip155.chains[0]?.split(':')[1] || '11155111');
            
            setWalletState({
              address,
              chainId,
              connected: true,
              connecting: false,
              error: null
            });
          }
        }

        // Set up event listeners
        const kit = getWalletKit();
        if (kit) {
          kit.on('session_proposal', (event: any) => {
            console.log('Session proposal:', event);
          });

          kit.on('session_request', (event: any) => {
            console.log('Session request:', event);
          });

          kit.on('session_delete', () => {
            setWalletState({
              address: null,
              chainId: null,
              connected: false,
              connecting: false,
              error: null
            });
          });
        }
      } catch (error) {
        console.error('WalletKit initialization failed:', error);
      }
    };

    initializeAndCheck();
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