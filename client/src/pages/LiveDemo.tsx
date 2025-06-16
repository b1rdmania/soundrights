import React from 'react';
import { Music, Shield, Zap, Users, BarChart3, Wallet } from 'lucide-react';
import LiveAPIDemo from '@/components/LiveAPIDemo';

export default function LiveDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Live API Integration Testing
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            <span className="block">SoundRights Live Demo</span>
            <span className="block text-purple-600 text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
              Real API Integration Testing
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Test our live API integrations with real data from Yakoa, Zapper, Tomo, and WalletConnect. 
            Story Protocol registration available as optional final step.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Yakoa IP Verification</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Zapper Portfolio</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Tomo Social Auth</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Wallet className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Wallet Integration</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Music className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Story Protocol (Optional)</span>
            </div>
          </div>
        </div>
        
        {/* Live API Demo Component */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <LiveAPIDemo />
        </div>
        
        {/* Process explanation */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">1. IP Verification</h3>
            <p className="text-gray-600">Yakoa API performs authentic IP verification with real token registration</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Portfolio Analysis</h3>
            <p className="text-gray-600">Live blockchain portfolio data from Zapper API or direct RPC calls</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Social Verification</h3>
            <p className="text-gray-600">Tomo social authentication demonstrates OAuth integration capability</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Blockchain Registration</h3>
            <p className="text-gray-600">Optional Story Protocol IP asset registration on testnet blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}