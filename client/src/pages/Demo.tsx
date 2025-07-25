import { Shield, Music, Building2, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedDemoUpload from '@/components/EnhancedDemoUpload';
import SponsorIntegrations from '@/components/SponsorIntegrations';
import EnhancedIPVerification from '@/components/EnhancedIPVerification';
import { ReownWalletConnection } from '@/components/ReownWalletConnection';

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              SoundRights Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Complete Story Protocol integration with sponsor technology suite
            </p>
          </div>

          <Tabs defaultValue="verification" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                IP Verification
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Upload & Register
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Sponsor Integrations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="verification">
              <EnhancedIPVerification />
            </TabsContent>
            
            <TabsContent value="upload">
              {/* Wallet Connection */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Blockchain Connection (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReownWalletConnection 
                    showStoryProtocolStatus={true}
                  />
                </CardContent>
              </Card>

              {/* Enhanced Upload Component with Dramatic Verification */}
              <EnhancedDemoUpload />
            </TabsContent>
            
            <TabsContent value="integrations">
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6">
                <SponsorIntegrations />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}