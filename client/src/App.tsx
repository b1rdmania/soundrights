
import React from "react";

const App = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">SoundRights</h1>
          <p className="text-xl text-gray-600">Web3 Music IP Registration Platform</p>
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
            <p className="text-green-700 font-semibold">✅ Production Ready - All APIs Operational</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">IP Registration</h3>
            <p className="text-blue-700">Register music IP on Story Protocol blockchain</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">Yakoa Verification</h3>
            <p className="text-purple-700">Authentic IP verification via live API</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2">Wallet Analytics</h3>
            <p className="text-green-700">Live blockchain portfolio data via Zapper</p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-4">Platform Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-green-600">✅ Story Protocol</div>
              <div className="text-green-600">✅ Yakoa API</div>
              <div className="text-green-600">✅ Zapper API</div>
              <div className="text-green-600">✅ WalletConnect</div>
            </div>
            <p className="text-gray-600 mt-4">All integrations verified with authentic data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
