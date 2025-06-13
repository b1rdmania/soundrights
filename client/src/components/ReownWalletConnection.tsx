import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';
import { useReownWallet } from '@/hooks/useReownWallet';
import { useToast } from '@/hooks/use-toast';

interface ReownWalletConnectionProps {
  onConnected?: (address: string) => void;
  showStoryProtocolStatus?: boolean;
}

export function ReownWalletConnection({ 
  onConnected, 
  showStoryProtocolStatus = true 
}: ReownWalletConnectionProps) {
  const { address, chainId, connected, connecting, error, connect, disconnect, signMessage } = useReownWallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [signing, setSigning] = useState(false);

  const handleConnect = async () => {
    try {
      const result = await connect();
      if (result.connected && result.address && onConnected) {
        onConnected(result.address);
      }
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${result.address?.slice(0, 6)}...${result.address?.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet",
      });
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const testSigning = async () => {
    if (!connected) return;
    
    setSigning(true);
    try {
      const message = `SoundRights verification at ${new Date().toISOString()}`;
      const signature = await signMessage(message);
      toast({
        title: "Message Signed",
        description: "Successfully signed verification message",
      });
    } catch (error) {
      toast({
        title: "Signing Failed",
        description: error instanceof Error ? error.message : "Failed to sign message",
        variant: "destructive",
      });
    } finally {
      setSigning(false);
    }
  };

  const getChainName = (chainId: number | null) => {
    switch (chainId) {
      case 11155111: return 'Sepolia Testnet';
      case 1513: return 'Story Protocol Testnet';
      case 1: return 'Ethereum Mainnet';
      default: return `Chain ${chainId}`;
    }
  };

  const getChainColor = (chainId: number | null) => {
    switch (chainId) {
      case 11155111: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 1513: return 'bg-purple-100 text-purple-800 border-purple-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!connected) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            Connect your Web3 wallet to register IP assets and manage licenses on Story Protocol
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleConnect} 
            disabled={connecting}
            className="w-full"
            size="lg"
          >
            {connecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect with Reown WalletKit
              </>
            )}
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            Powered by Reown WalletKit • Supports 400+ wallets
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" />
            Wallet Connected
          </div>
          <Badge variant="outline" className={getChainColor(chainId)}>
            {getChainName(chainId)}
          </Badge>
        </CardTitle>
        <CardDescription>
          Your wallet is connected and ready for blockchain transactions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Wallet Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Connected Address</label>
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <code className="flex-1 text-sm font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Story Protocol Status */}
        {showStoryProtocolStatus && (
          <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-sm text-purple-800 dark:text-purple-200 mb-2">
              Story Protocol Integration
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Ready for IP registration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Testnet environment active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>License smart contracts available</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={testSigning}
            disabled={signing}
            className="flex-1"
          >
            {signing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Signing...
              </>
            ) : (
              'Test Signing'
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open(`https://testnet.storyscan.xyz/address/${address}`, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={handleDisconnect}
          className="w-full"
        >
          Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  );
}