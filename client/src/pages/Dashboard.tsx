import React from 'react';
import { Link } from 'wouter';
import { Upload, Shield, Zap, BarChart3, Music, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your music IP assets and track registrations</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/upload" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Quick Action</p>
                <p className="text-xl font-semibold">Upload Track</p>
              </div>
              <Upload className="w-8 h-8 opacity-80" />
            </div>
          </Link>

          <Link href="/live-demo" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Try Platform</p>
                <p className="text-xl font-semibold text-gray-900">Live Demo</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </Link>

          <Link href="/integrations" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Status</p>
                <p className="text-xl font-semibold text-gray-900">Integrations</p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </Link>

          <Link href="/marketplace" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Browse</p>
                <p className="text-xl font-semibold text-gray-900">Marketplace</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Tracks</h3>
              <Music className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Total uploaded tracks</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">IP Assets</h3>
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Registered on blockchain</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Verifications</h3>
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Completed authenticity checks</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
            <Link href="/upload" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload Track
            </Link>
          </div>

          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No tracks uploaded yet</h4>
            <p className="text-gray-600 mb-6">Start by uploading your first track to begin the IP registration process</p>
            <Link href="/upload" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all inline-flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your First Track
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Story Protocol</span>
              </div>
              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Yakoa IP API</span>
              </div>
              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Zapper API</span>
              </div>
              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;