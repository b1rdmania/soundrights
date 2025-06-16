
import React from 'react';
import { Github, Twitter, MessageCircle, Code, Music, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About SoundRights</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transforming music licensing through blockchain technology for independent labels
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Creator Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border-2 border-purple-200">
                  <span className="text-2xl">🐦</span>
                </div>
                <div>
                  <CardTitle className="text-xl">b1rdmania</CardTitle>
                  <p className="text-purple-600 font-medium">Creator & Developer</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Music className="w-3 h-3 mr-1" />
                  Music Industry
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Code className="w-3 h-3 mr-1" />
                  Web3 Developer
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Sonic Labs
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Web3 native with 2+ years at Sonic Labs building blockchain infrastructure. 
                SoundRights addresses real problems in the $42 billion music rights market, 
                providing independent labels with tools for IP registration, licensing automation, 
                and seamless website integration.
              </p>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Development Activity</h4>
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-green-600">938</div>
                  <div className="text-sm text-gray-600">contributions in the last year</div>
                </div>
                
                {/* GitHub-style contribution grid */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-12 gap-1 mb-2">
                    {Array.from({ length: 84 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-sm ${
                          i % 4 === 0 ? 'bg-green-600' : 
                          i % 3 === 0 ? 'bg-green-400' : 
                          i % 2 === 0 ? 'bg-green-200' : 
                          'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Jan</span>
                    <span>Jun</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <a 
                  href="https://github.com/b1rdmania" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a 
                  href="https://twitter.com/b1rdmania" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter/X
                </a>
                <a 
                  href="https://t.me/birdman1a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Telegram
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Platform Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                Platform Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                SoundRights transforms music licensing through blockchain technology, enabling labels 
                to register IP ownership, automate licensing workflows, and connect directly with 
                sync buyers through SDK integration tools.
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Innovations</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Account abstraction hiding web3 complexity</li>
                  <li>• Real-time IP verification via Yakoa API</li>
                  <li>• SDK integration for existing label websites</li>
                  <li>• Story Protocol blockchain registration</li>
                  <li>• Automated licensing and revenue tracking</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Background</h4>
                <p className="text-sm text-gray-600">
                  Built with TypeScript, React, PostgreSQL, and blockchain infrastructure. 
                  Integrates with Yakoa, Zapper, Tomo, and Story Protocol APIs for 
                  authentic data and real-time verification.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Market Impact</h4>
                <p className="text-sm text-gray-600">
                  Addresses the $42 billion music rights market by providing independent 
                  labels with enterprise-grade tools previously only available to major labels.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Music className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">IP Registration</h3>
                <p className="text-sm text-gray-600">
                  Timestamped blockchain registration for verifiable IP ownership through Story Protocol
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">SDK Integration</h3>
                <p className="text-sm text-gray-600">
                  Labels embed licensing capabilities into existing websites for seamless payments
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Automated Licensing</h3>
                <p className="text-sm text-gray-600">
                  Dynamic pricing and automated revenue tracking for sync licensing deals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledgements */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acknowledgements</h3>
            <p className="text-gray-700">
              Built for the Surreal World Assets bounty, leveraging Story Protocol's innovative 
              programmable IP infrastructure. Special thanks to the Story Protocol team and 
              buildathon organizers for providing the opportunity to solve real music industry challenges.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
