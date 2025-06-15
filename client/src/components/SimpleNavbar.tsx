import React from 'react';
import { Link } from 'wouter';
import { Music, Menu, X } from 'lucide-react';

const SimpleNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SoundRights</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium">
              Dashboard
            </Link>
            <Link href="/live-demo" className="text-gray-700 hover:text-purple-600 font-medium">
              Demo
            </Link>
            <Link href="/integrations" className="text-gray-700 hover:text-purple-600 font-medium">
              Integrations
            </Link>
            <Link href="/marketplace" className="text-gray-700 hover:text-purple-600 font-medium">
              Marketplace
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-purple-600">
              Dashboard
            </Link>
            <Link href="/live-demo" className="block py-2 text-gray-700 hover:text-purple-600">
              Demo
            </Link>
            <Link href="/integrations" className="block py-2 text-gray-700 hover:text-purple-600">
              Integrations
            </Link>
            <Link href="/marketplace" className="block py-2 text-gray-700 hover:text-purple-600">
              Marketplace
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SimpleNavbar;