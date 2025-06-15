import React from 'react';
import { Link } from 'wouter';
import { Music, Github, Twitter, Mail } from 'lucide-react';

const SafeFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SoundRights</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Web3 music IP registration and licensing platform powered by Story Protocol, 
              providing secure, transparent, and innovative solutions for independent music creators.
            </p>
            <div className="flex space-x-4">
              <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <div className="space-y-2">
              <Link href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/live-demo" className="block text-gray-400 hover:text-white transition-colors">
                Demo
              </Link>
              <Link href="/integrations" className="block text-gray-400 hover:text-white transition-colors">
                Integrations
              </Link>
              <Link href="/marketplace" className="block text-gray-400 hover:text-white transition-colors">
                Marketplace
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <Link href="/whitepaper" className="block text-gray-400 hover:text-white transition-colors">
                Whitepaper
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/sponsors" className="block text-gray-400 hover:text-white transition-colors">
                Sponsors
              </Link>
              <Link href="/invest" className="block text-gray-400 hover:text-white transition-colors">
                Invest
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SoundRights. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Built for Surreal World Assets Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SafeFooter;