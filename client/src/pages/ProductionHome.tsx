import React from 'react';
import { Link } from 'wouter';
import { Play, Shield, Zap, Globe, Music, ArrowRight, CheckCircle } from 'lucide-react';

const ProductionHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center">
                <Music className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              SoundRights
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Web3 Music IP Registration & Licensing Platform
            </p>
            
            <p className="text-lg text-purple-300 mb-12 max-w-2xl mx-auto">
              Secure your music rights on the blockchain with Story Protocol. 
              Verify authenticity, register IP assets, and manage licensing with complete transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                Launch Platform
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link href="/live-demo" className="border-2 border-purple-400 text-purple-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Production-Ready Features
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              All integrations verified and operational with live blockchain data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">IP Verification</h3>
              <p className="text-purple-200">Yakoa API integration for authentic content verification</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Blockchain Registry</h3>
              <p className="text-purple-200">Story Protocol integration for NFT-based IP assets</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Wallet Analytics</h3>
              <p className="text-purple-200">Live portfolio data via Zapper API with blockchain fallback</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Social Auth</h3>
              <p className="text-purple-200">Tomo API for seamless social wallet connections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Production Environment Active</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>All API integrations verified operational</span>
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Live blockchain data connections</span>
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Authenticated Story Protocol testnet</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>WalletConnect production ready</span>
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>PostgreSQL database operational</span>
                </div>
                <div className="flex items-center text-green-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Zero mock data tolerance enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Music Rights?
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join the future of music IP management with blockchain-powered transparency and security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
              Start Protecting Your Music
            </Link>
            
            <Link href="/integrations" className="border-2 border-purple-400 text-purple-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all">
              Explore Integrations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionHome;