
import React from 'react';
import { Github, Twitter, MessageCircle, Code, Music, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import profileImage from '@assets/CleanShot 2025-06-16 at 12.43.19@2x_1750074212115.png';
import contributionsImage from '@assets/CleanShot 2025-06-16 at 12.43.08@2x_1750074214348.png';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About Me</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Web3 developer with music industry background building the future of IP rights
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          
          {/* Creator Profile */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src={profileImage} 
                  alt="b1rdmania profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                />
                <div>
                  <CardTitle className="text-2xl mb-2">b1rdmania</CardTitle>
                  <p className="text-purple-600 font-medium text-lg">Creator & Web3 Developer</p>
                  <div className="flex flex-wrap gap-2 mt-3">
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
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Web3 native with 2+ years at Sonic Labs building blockchain infrastructure. 
                I'm passionate about the intersection of music technology and decentralized systems. 
                SoundRights was born from my desire to solve real-world challenges for audio creators 
                in the $42 billion music rights market.
              </p>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">GitHub Development Activity</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <img 
                    src={contributionsImage} 
                    alt="GitHub contributions showing 938 contributions in the last year"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Connect With Me</h4>
                <div className="flex gap-4">
                  <a 
                    href="https://github.com/b1rdmania" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors font-medium"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                  <a 
                    href="https://twitter.com/b1rdmania" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors font-medium"
                  >
                    <Twitter className="w-5 h-5" />
                    Twitter/X
                  </a>
                  <a 
                    href="https://t.me/birdman1a" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Telegram
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SoundRights Project */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Music className="w-6 h-6 text-purple-600" />
                SoundRights Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                My submission to the Surreal World Assets bounty, SoundRights transforms music licensing 
                through blockchain technology. It enables independent labels to register IP ownership, 
                automate licensing workflows, and connect directly with sync buyers through SDK integration tools.
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Technical Innovations</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    Account abstraction hiding web3 complexity from end users
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    Real-time IP verification through Yakoa API integration
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    SDK tools for labels to embed licensing on their websites
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    Story Protocol blockchain registration for verifiable ownership
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Tech Stack</h4>
                <p className="text-sm text-gray-600">
                  TypeScript, React, PostgreSQL, Express.js, Story Protocol, Yakoa API, 
                  Zapper API, Tomo API, WalletConnect, Drizzle ORM
                </p>
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
    </div>
  );
};

export default About;
