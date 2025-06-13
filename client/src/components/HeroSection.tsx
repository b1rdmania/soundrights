
import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Music } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative pt-24 sm:pt-32 pb-20 sm:pb-28 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Professional background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-white pointer-events-none" />
      
      {/* Geometric background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[8%] w-24 sm:w-48 h-24 sm:h-48 rounded-full bg-purple-100/40" />
        <div className="absolute top-[35%] right-[12%] w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-blue-100/30" />
        <div className="absolute bottom-[20%] left-[25%] w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-emerald-100/40" />
      </div>
      
      <div className="container relative px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Powered by Story Protocol Blockchain
          </div>
          
          {/* Main heading */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
              <span className="block">SoundRights</span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-purple-600 font-semibold mt-2">
                Independent Label Platform
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive licensing and sync royalty management for independent labels. 
              Bulk catalog upload with blockchain IP registration and dynamic NFT marketplace.
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/live-demo"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-xl gap-3 w-full sm:w-auto"
            >
              <Music className="w-5 h-5" />
              Try Live Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/sponsors"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 hover:scale-105 gap-3 w-full sm:w-auto"
            >
              View Integrations
            </Link>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Music className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">IP Registration</h3>
              <p className="text-sm text-gray-600">Blockchain verification</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">Y</span>
              </div>
              <h3 className="font-semibold text-gray-900">Yakoa Auth</h3>
              <p className="text-sm text-gray-600">Content verification</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-600 font-bold">T</span>
              </div>
              <h3 className="font-semibold text-gray-900">Tomo Social</h3>
              <p className="text-sm text-gray-600">Social authentication</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">Z</span>
              </div>
              <h3 className="font-semibold text-gray-900">Zapper Analytics</h3>
              <p className="text-sm text-gray-600">Portfolio tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
