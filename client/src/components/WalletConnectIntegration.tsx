import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Link, Unlink, Send, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';

interface WalletState {
  address: string;
  chainId: number;
  chainName: string;
  balance: string;
  connected: boolean;
}

interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
}

export default function WalletConnectIntegration() {
  const [walletState, setWalletState] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [transactionForm, setTransactionForm] = useState<TransactionRequest>({
    to: '',
    value: '0.001',
    data: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const response = await fetch('/api/walletconnect/status');
      if (response.ok) {
        const data = await response.json();
        if (data.connected) {
          setWalletState(data.wallet);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/walletconnect/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setWalletState(data.wallet);
        
        toast({
          title: 'Wallet Connected',
          description: `Connected to ${data.wallet.chainName} (${data.wallet.address.slice(0, 6)}...${data.wallet.address.slice(-4)})`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to connect wallet');
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Unable to connect wallet',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/walletconnect/disconnect', {
        method: 'POST'
      });

      if (response.ok) {
        setWalletState(null);
        setTxHash('');
        
        toast({
          title: 'Wallet Disconnected',
          description: 'Successfully disconnected from wallet',
        });
      }
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: 'Unable to disconnect wallet',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async () => {
    if (!walletState || !transactionForm.to || !transactionForm.value) {
      toast({
        title: 'Invalid Transaction',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/walletconnect/send-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionForm)
      });

      if (response.ok) {
        const data = await response.json();
        setTxHash(data.txHash);
        
        toast({
          title: 'Transaction Sent',
          description: `Transaction hash: ${data.txHash.slice(0, 10)}...`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Transaction failed');
      }
    } catch (error) {
      toast({
        title: 'Transaction Failed',
        description: error instanceof Error ? error.message : 'Unable to send transaction',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">WalletConnect Integration</h3>
        <p className="text-muted-foreground">
          Secure wallet connection and transaction signing using WalletConnect 2.0 protocol
        </p>
        <Badge variant="outline" className="mt-2">
          <Wallet className="w-3 h-3 mr-1" />
          Sign API v2.0
        </Badge>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {walletState?.connected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
            Wallet Connection Status
          </CardTitle>
          <CardDescription>
            {walletState?.connected 
              ? 'Your wallet is connected and ready for transactions'
              : 'Connect your wallet to interact with blockchain features'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {walletState?.connected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Wallet Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {walletState.address.slice(0, 6)}...{walletState.address.slice(-4)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(walletState.address, 'Address')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Network</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{walletState.chainName}</Badge>
                    <span className="text-sm text-muted-foreground">({walletState.chainId})</span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Balance</Label>
                  <div className="text-lg font-semibold text-primary mt-1">
                    {walletState.balance} ETH
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={disconnectWallet}
                    disabled={loading}
                    className="w-full"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No wallet connected</p>
              <Button onClick={connectWallet} disabled={loading} size="lg">
                <Link className="h-4 w-4 mr-2" />
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Testing */}
      {walletState?.connected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Transaction Test
            </CardTitle>
            <CardDescription>
              Test transaction signing using WalletConnect protocol
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="to">To Address</Label>
                <Input
                  id="to"
                  placeholder="0x..."
                  value={transactionForm.to}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">Amount (ETH)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.001"
                  placeholder="0.001"
                  value={transactionForm.value}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data">Data (Optional)</Label>
              <Input
                id="data"
                placeholder="0x..."
                value={transactionForm.data}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, data: e.target.value }))}
              />
            </div>
            
            <Button
              onClick={sendTransaction}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending Transaction...' : 'Send Transaction'}
            </Button>
            
            {txHash && (
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">Transaction Sent!</p>
                    <p className="text-sm text-green-600">Hash: {txHash.slice(0, 20)}...</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(txHash, 'Transaction hash')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* API Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">WalletConnect 2.0</h4>
              <p className="text-sm text-muted-foreground">
                Secure wallet connectivity protocol
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://specs.walletconnect.com/2.0/specs/clients/sign', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Sign API
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://docs.walletconnect.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Full Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}