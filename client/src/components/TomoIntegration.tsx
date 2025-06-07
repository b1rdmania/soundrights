import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Twitter, Github, MessageCircle, Wallet, ExternalLink, CheckCircle } from 'lucide-react';

interface TomoWallet {
  address: string;
  chain: string;
  balance?: string;
  verified: boolean;
}

interface TomoUser {
  id: string;
  email?: string;
  wallet_address?: string;
  social_profiles?: {
    twitter?: string;
    discord?: string;
    github?: string;
  };
  verified: boolean;
  created_at: string;
}

export default function TomoIntegration() {
  const [user, setUser] = useState<TomoUser | null>(null);
  const [wallets, setWallets] = useState<TomoWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  const socialProviders = [
    { 
      name: 'Twitter', 
      key: 'twitter',
      icon: Twitter, 
      color: 'bg-blue-500',
      description: 'Connect with Twitter for social verification'
    },
    { 
      name: 'Discord', 
      key: 'discord',
      icon: MessageCircle, 
      color: 'bg-indigo-500',
      description: 'Connect with Discord communities'
    },
    { 
      name: 'GitHub', 
      key: 'github',
      icon: Github, 
      color: 'bg-gray-800',
      description: 'Connect with GitHub for developer verification'
    }
  ];

  const connectSocialLogin = async (provider: string) => {
    setConnecting(provider);
    try {
      const response = await fetch(`/api/tomo/auth/${provider}`);
      if (response.ok) {
        const data = await response.json();
        window.open(data.authUrl, '_blank', 'width=500,height=600');
        
        toast({
          title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Authentication`,
          description: 'Social login window opened. Complete authentication to continue.',
          variant: 'default'
        });
      } else {
        throw new Error(`Failed to initiate ${provider} login`);
      }
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect with ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setConnecting(null);
    }
  };

  const testTomoConnection = async () => {
    setLoading(true);
    try {
      // Test with demo callback to verify Tomo integration
      const response = await fetch('/api/tomo/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'demo',
          code: 'demo_auth_code_for_testing'
        })
      });

      if (response.ok) {
        const authResult = await response.json();
        setUser(authResult.user);
        
        // Fetch user wallets
        if (authResult.user.id) {
          const walletsResponse = await fetch(`/api/tomo/wallets/${authResult.user.id}`);
          if (walletsResponse.ok) {
            const walletsData = await walletsResponse.json();
            setWallets(walletsData);
          }
        }

        toast({
          title: 'Tomo Integration Test',
          description: 'Successfully connected to Tomo service with demo data',
          variant: 'default'
        });
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      toast({
        title: 'Tomo Integration Test',
        description: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Tomo Wallet Integration</h3>
        <p className="text-muted-foreground">
          Social login and wallet management for Web3 onboarding
        </p>
      </div>

      {/* Tomo Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tomo Service Status
          </CardTitle>
          <CardDescription>
            Connected to Tomo API for Surreal World Assets Buildathon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
              <span className="text-sm text-muted-foreground">
                Using official Buildathon API token
              </span>
            </div>
            <Button
              onClick={testTomoConnection}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Login Options */}
      <Card>
        <CardHeader>
          <CardTitle>Social Login Options</CardTitle>
          <CardDescription>
            Connect with your social accounts for seamless Web3 onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialProviders.map((provider) => {
              const Icon = provider.icon;
              return (
                <div key={provider.key} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${provider.color} bg-opacity-10`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {provider.description}
                  </p>
                  <Button
                    onClick={() => connectSocialLogin(provider.key)}
                    disabled={connecting === provider.key}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {connecting === provider.key ? 'Connecting...' : `Connect ${provider.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Profile Display */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Connected User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">User ID:</span>
                <p className="text-sm text-muted-foreground">{user.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p className="text-sm text-muted-foreground">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Wallet Address:</span>
                <p className="text-sm text-muted-foreground font-mono">
                  {user.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : 'Not connected'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">Verified:</span>
                <Badge variant={user.verified ? "default" : "secondary"}>
                  {user.verified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
            </div>

            {user.social_profiles && (
              <div>
                <span className="text-sm font-medium">Social Profiles:</span>
                <div className="flex gap-2 mt-1">
                  {user.social_profiles.twitter && (
                    <Badge variant="outline">Twitter: {user.social_profiles.twitter}</Badge>
                  )}
                  {user.social_profiles.discord && (
                    <Badge variant="outline">Discord: {user.social_profiles.discord}</Badge>
                  )}
                  {user.social_profiles.github && (
                    <Badge variant="outline">GitHub: {user.social_profiles.github}</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Connected Wallets */}
      {wallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Connected Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wallets.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium font-mono">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{wallet.chain}</p>
                  </div>
                  <div className="text-right">
                    {wallet.balance && (
                      <p className="font-medium">{wallet.balance} ETH</p>
                    )}
                    <Badge variant={wallet.verified ? "default" : "secondary"}>
                      {wallet.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentation Link */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Tomo Documentation</h4>
              <p className="text-sm text-muted-foreground">
                Learn more about Tomo EVM Kit integration
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://docs.tomo.inc/tomo-sdk/tomoevmkit', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}