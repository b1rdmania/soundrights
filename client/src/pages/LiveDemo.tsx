import React from 'react';
import { Music, Shield, Zap, Users } from 'lucide-react';
import EnhancedDemoUpload from '@/components/EnhancedDemoUpload';

export default function LiveDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Live Demo Environment
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            <span className="block">Try SoundRights</span>
            <span className="block text-purple-600 text-3xl sm:text-4xl md:text-5xl font-semibold mt-2">
              Upload & Verify Music IP
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our complete music IP verification workflow with real-time blockchain registration,
            Yakoa authentication, and comprehensive analytics.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Yakoa Verification</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">Tomo Social Auth</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Zapper Analytics</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <Music className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Story Protocol</span>
            </div>
          </div>
        </div>
        
        {/* Demo Upload Component */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <EnhancedDemoUpload />
        </div>
        
        {/* Process explanation */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload Audio</h3>
            <p className="text-gray-600">Upload your music file and we'll extract metadata and generate audio fingerprints</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Verify Authenticity</h3>
            <p className="text-gray-600">Yakoa API checks originality and detects potential copyright infringements</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Register on Blockchain</h3>
            <p className="text-gray-600">Create immutable IP asset record on Story Protocol blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}