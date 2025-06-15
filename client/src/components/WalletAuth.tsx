import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Check, AlertCircle } from 'lucide-react';
import { connectWallet as reownConnect, disconnectWallet as reownDisconnect } from '@/lib/reownConfig';

interface WalletContextType {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

// Type for ethereum provider
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const result = await reownConnect();
      setAddress(result.address);
      setChainId(result.chainId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Fallback to MetaMask if WalletConnect fails
      const ethereum = (window as any).ethereum as EthereumProvider;
      if (ethereum) {
        try {
          const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
          });
          const chainId = await ethereum.request({
            method: 'eth_chainId',
          });
          setAddress(accounts[0]);
          setChainId(parseInt(chainId, 16));
        } catch (fallbackError) {
          console.error('MetaMask fallback failed:', fallbackError);
        }
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await reownDisconnect();
    } catch (error) {
      console.error('WalletConnect disconnect failed:', error);
    }
    setAddress(null);
    setChainId(null);
  };

  const checkConnection = async () => {
    try {
      // Check AppKit connection first
      const account = (window as any).appKit?.getAccount?.();
      if (account?.isConnected && account?.address) {
        setAddress(account.address);
        setChainId(1); // Default to mainnet
        return;
      }

      // Fallback to MetaMask check
      const ethereum = (window as any).ethereum as EthereumProvider;
      if (ethereum) {
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const chainId = await ethereum.request({
            method: 'eth_chainId',
          });
          setAddress(accounts[0]);
          setChainId(parseInt(chainId, 16));
        }
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error);
    }
  };

  useEffect(() => {
    checkConnection();

    // Subscribe to AppKit account changes
    let unsubscribeAppKit: (() => void) | undefined;
    try {
      unsubscribeAppKit = (window as any).appKit?.subscribeAccount?.((account: any) => {
        if (account?.isConnected && account?.address) {
          setAddress(account.address);
          setChainId(1);
        } else {
          setAddress(null);
          setChainId(null);
        }
      });
    } catch (error) {
      console.log('AppKit subscription not available, using MetaMask fallback');
    }

    // MetaMask fallback listeners
    const ethereum = (window as any).ethereum as EthereumProvider;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null);
          setChainId(null);
        } else {
          setAddress(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        unsubscribeAppKit?.();
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }

    return () => {
      unsubscribeAppKit?.();
    };
  }, []);

  const value = {
    address,
    chainId,
    isConnected: !!address,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const WalletConnect: React.FC = () => {
  const { address, chainId, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const getChainName = (chainId: number | null) => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 137:
        return 'Polygon';
      case 8453:
        return 'Base';
      case 11155111:
        return 'Sepolia Testnet';
      default:
        return `Chain ${chainId}`;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Address:</span>
              <Badge variant="secondary">{formatAddress(address!)}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Network:</span>
              <Badge variant="outline">{getChainName(chainId)}</Badge>
            </div>
          </div>
          <Button
            onClick={disconnectWallet}
            variant="outline"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Connect Your Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Connect your Web3 wallet to access SoundRights platform features including track upload, 
          IP registration, and portfolio analytics.
        </p>
        
        {typeof window !== 'undefined' && typeof window.ethereum === 'undefined' && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-800">
              Please install MetaMask or another Web3 wallet to continue
            </span>
          </div>
        )}

        <Button
          onClick={connectWallet}
          disabled={isConnecting || (typeof window !== 'undefined' && typeof window.ethereum === 'undefined')}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </CardContent>
    </Card>
  );
};