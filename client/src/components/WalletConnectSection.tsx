import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Users, Link as LinkIcon, CheckCircle } from 'lucide-react';

export default function WalletConnectSection() {
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  const handleWalletConnect = async () => {
    setConnecting('wallet');
    try {
      const response = await fetch('/api/walletconnect/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Wallet Connected',
          description: `Connected to ${data.wallet.chainName}`,
        });
      } else {
        throw new Error('Failed to connect wallet');
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Unable to connect wallet - provide WALLETCONNECT_PROJECT_ID for full integration',
        variant: 'destructive'
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleTomoConnect = async () => {
    setConnecting('tomo');
    try {
      const response = await fetch('/api/tomo/test');
      
      if (response.ok) {
        toast({
          title: 'Tomo Connected',
          description: 'Successfully connected to Tomo social authentication',
        });
      } else {
        throw new Error('Failed to connect to Tomo');
      }
    } catch (error) {
      toast({
        title: 'Tomo Connection Failed',
        description: 'Unable to connect to Tomo service',
        variant: 'destructive'
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleReplitAuth = () => {
    window.location.href = '/api/login';
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Connect & Get Started</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose your preferred connection method to access SoundRights platform features
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WalletConnect */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">WalletConnect</CardTitle>
                <CardDescription>
                  Connect your Web3 wallet for blockchain transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="mb-4">
                  Web3 Standard
                </Badge>
                <Button
                  onClick={handleWalletConnect}
                  disabled={connecting === 'wallet'}
                  className="w-full"
                >
                  {connecting === 'wallet' ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </CardContent>
            </Card>

            {/* Tomo Social Login */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Tomo Social</CardTitle>
                <CardDescription>
                  Social authentication with Twitter, Discord, or GitHub
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="mb-4">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
                <Button
                  onClick={handleTomoConnect}
                  disabled={connecting === 'tomo'}
                  variant="outline"
                  className="w-full"
                >
                  {connecting === 'tomo' ? 'Testing...' : 'Test Connection'}
                </Button>
              </CardContent>
            </Card>

            {/* Replit Auth */}
            <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <LinkIcon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Secure Sign In</CardTitle>
                <CardDescription>
                  Standard authentication for platform access
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="mb-4">
                  OpenID Connect
                </Badge>
                <Button
                  onClick={handleReplitAuth}
                  className="w-full"
                  variant="secondary"
                >
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              All authentication methods provide secure access to SoundRights platform features
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}