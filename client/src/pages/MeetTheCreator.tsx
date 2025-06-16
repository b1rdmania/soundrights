import React from 'react';
import { Github, Twitter, MessageCircle, Calendar, Code, Music, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function MeetTheCreator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full rounded-full border-4 border-purple-200 shadow-lg bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl">🐦</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">b1rdmania</h1>
          <p className="text-lg text-purple-600 font-medium mb-4">Creator of SoundRights</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
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

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/b1rdmania" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://twitter.com/b1rdmania" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter/X
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://t.me/birdman1a" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Telegram
              </a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                About the Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                SoundRights emerged from my experience working with independent music labels who struggle 
                with rights management and licensing in the digital age. Having spent 2+ years at Sonic Labs 
                building blockchain infrastructure, I saw an opportunity to solve real problems in the music industry.
              </p>
              
              <p className="text-gray-700">
                The platform addresses the $42 billion music rights market by providing labels with tools 
                to register IP ownership on blockchain, automate licensing workflows, and integrate 
                seamlessly into existing websites through our SDK.
              </p>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Key Innovations</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Account abstraction hiding web3 complexity</li>
                  <li>• Real-time IP verification via Yakoa API</li>
                  <li>• SDK integration for existing label websites</li>
                  <li>• Story Protocol blockchain registration</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Development Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-green-600" />
                Development Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-green-600">938</div>
                <div className="text-sm text-gray-600">contributions in the last year</div>
              </div>
              
              {/* GitHub-style contribution grid visualization */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-12 gap-1 mb-2">
                  {/* Simulated contribution squares */}
                  {Array.from({ length: 84 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
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
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Most active day</span>
                  <span className="font-medium">15 contributions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Longest streak</span>
                  <span className="font-medium">23 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current streak</span>
                  <span className="font-medium">7 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Technical Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Sonic Labs Experience</h4>
                <p className="text-gray-700 text-sm">
                  2+ years building blockchain infrastructure and developer tools. Deep experience 
                  with web3 protocols, smart contracts, and enterprise blockchain solutions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Music Industry Focus</h4>
                <p className="text-gray-700 text-sm">
                  Specialized in solving real-world problems for independent labels, focusing on 
                  rights management, licensing automation, and marketplace integration.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tech Stack Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">TypeScript</Badge>
                  <Badge variant="outline" className="text-xs">React</Badge>
                  <Badge variant="outline" className="text-xs">Node.js</Badge>
                  <Badge variant="outline" className="text-xs">PostgreSQL</Badge>
                  <Badge variant="outline" className="text-xs">Blockchain</Badge>
                  <Badge variant="outline" className="text-xs">Web3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                SoundRights Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-sm">Platform Launched</div>
                    <div className="text-xs text-gray-600">June 2025</div>
                    <div className="text-xs text-gray-500">Live API integrations verified</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-sm">Sponsor Integrations</div>
                    <div className="text-xs text-gray-600">May 2025</div>
                    <div className="text-xs text-gray-500">Yakoa, Zapper, Tomo, Story Protocol</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-sm">Core Platform</div>
                    <div className="text-xs text-gray-600">April 2025</div>
                    <div className="text-xs text-gray-500">MVP development and testing</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5"></div>
                  <div>
                    <div className="font-medium text-sm">Concept & Research</div>
                    <div className="text-xs text-gray-600">March 2025</div>
                    <div className="text-xs text-gray-500">Music industry problem analysis</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Interested in the Technology?
              </h3>
              <p className="text-gray-700 mb-6">
                SoundRights demonstrates real-world blockchain solutions for the music industry. 
                Explore the live platform and see authentic API integrations in action.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <a href="/live-demo">Try Live Demo</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/integrations">View Integrations</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/b1rdmania" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    Follow on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}