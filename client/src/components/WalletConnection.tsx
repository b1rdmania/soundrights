import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useStoryProtocol } from '@/hooks/useStoryProtocol';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WalletConnectionProps {
  onConnected?: (address: string) => void;
  showStoryProtocolStatus?: boolean;
}

export function WalletConnection({ onConnected, showStoryProtocolStatus = true }: WalletConnectionProps) {
  const { address, isConnected } = useAccount();
  const { isLoading: storyLoading, error: storyError } = useStoryProtocol();

  // Notify parent component when wallet connects
  if (isConnected && address && onConnected) {
    onConnected(address);
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Web3 Wallet</CardTitle>
        <CardDescription>
          Connect your wallet to register IP assets on Story Protocol
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        
        {isConnected && address && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            
            {showStoryProtocolStatus && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Story Protocol:</span>
                {storyLoading ? (
                  <Badge variant="secondary">Connecting...</Badge>
                ) : storyError ? (
                  <Badge variant="destructive">Error</Badge>
                ) : (
                  <Badge variant="default">Ready</Badge>
                )}
              </div>
            )}
          </div>
        )}
        
        {!isConnected && (
          <div className="text-sm text-muted-foreground text-center">
            Connect your wallet to access blockchain features
          </div>
        )}
      </CardContent>
    </Card>
  );
}