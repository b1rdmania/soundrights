import { Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DemoUpload from '@/components/DemoUpload';
import { WalletConnection } from '@/components/WalletConnection';

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Story Protocol Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Upload music and register IP rights on the blockchain
            </p>
          </div>

          {/* Wallet Connection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Blockchain Connection (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WalletConnection 
                showStoryProtocolStatus={true}
              />
            </CardContent>
          </Card>

          {/* Upload Component */}
          <DemoUpload />
        </div>
      </div>
    </div>
  );
}