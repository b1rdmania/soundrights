
import React from 'react';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';

const WhitePaper = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 bg-clip-text text-transparent">
            SoundMatch Whitepaper
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Revolutionizing Audio Recognition Through Advanced AI and Machine Learning
          </p>
        </div>
        
        <ScrollArea className="h-[70vh] pr-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 shadow-xl">
          <div className="p-8">
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">1</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Executive Summary</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                SoundMatch is a revolutionary audio recognition platform that leverages cutting-edge AI and machine learning technologies to identify, analyze, and match audio content with unprecedented accuracy. Our solution addresses the growing demand for advanced audio identification in various industries, including music, media, content creation, and copyright protection.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This whitepaper outlines our technological approach, market positioning, and growth strategy as we aim to become the leading provider of audio recognition solutions globally.
              </p>
            </section>
            
            <Separator className="my-10 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 h-0.5 rounded-full" />
            
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">2</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">The Problem</h2>
              </div>
              
              <div className="pl-4 border-l-4 border-purple-500 mb-6">
                <p className="italic text-gray-600 dark:text-gray-400 text-xl">
                  "In the digital age, audio content is being created, shared, and consumed at an unprecedented rate, yet accurate identification remains a significant challenge."
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Current Market Limitations</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Existing audio recognition solutions struggle with accuracy in noisy environments</li>
                  <li>Limited capabilities in identifying remixes, covers, and modified versions</li>
                  <li>Slow processing times for real-time applications</li>
                  <li>Inadequate metadata integration and contextual understanding</li>
                  <li>Poor performance with non-mainstream or niche content</li>
                </ul>
              </div>
            </section>
            
            <Separator className="my-10 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 h-0.5 rounded-full" />
            
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">3</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Our Solution</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-purple-600 dark:text-purple-400">Advanced Neural Architecture</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our proprietary deep learning models employ convolutional neural networks specifically optimized for audio pattern recognition, enabling identification even in challenging acoustic environments.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Multi-Source Database</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    SoundMatch integrates multiple comprehensive audio databases, covering millions of tracks across genres, languages, and time periods for unmatched recognition scope.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-teal-600 dark:text-teal-400">Real-Time Processing</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Optimized algorithms deliver match results in milliseconds, making our technology suitable for live applications where instant feedback is crucial.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Contextual Analysis</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Beyond simple matching, our AI provides rich contextual information, identifying musical elements, instruments, and structural components.
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="my-10 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 h-0.5 rounded-full" />
            
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">4</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Technology Overview</h2>
              </div>
              
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Core Components</h3>
                <ol className="list-decimal pl-6 space-y-4 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong className="text-purple-600 dark:text-purple-400">Audio Fingerprinting Engine:</strong> Creates unique digital signatures for audio content that remain consistent despite variations in quality or format
                  </li>
                  <li>
                    <strong className="text-blue-600 dark:text-blue-400">Neural Network Analysis:</strong> Multiple specialized neural networks process different aspects of audio signals to extract comprehensive feature sets
                  </li>
                  <li>
                    <strong className="text-teal-600 dark:text-teal-400">Pattern Recognition System:</strong> Advanced algorithms identify patterns within audio signals that correspond to specific sounds, instruments, or tracks
                  </li>
                  <li>
                    <strong className="text-indigo-600 dark:text-indigo-400">Metadata Integration Layer:</strong> Combines recognition results with extensive metadata from multiple sources for rich contextual outputs
                  </li>
                </ol>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Technical Specifications</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Feature</th>
                        <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-200">Specification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Recognition Speed</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Under 500ms for standard queries</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Database Size</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">100+ million unique audio signatures</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Accuracy Rate</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">98.7% in clean audio, 92.3% in noisy environments</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Minimum Sample Length</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">3 seconds for high-confidence matches</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            
            <Separator className="my-10 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 h-0.5 rounded-full" />
            
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">5</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Market Applications</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-purple-500">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Music Industry</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Copyright protection</li>
                    <li>Royalty tracking</li>
                    <li>Artist discovery</li>
                    <li>Streaming analytics</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-blue-500">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Media & Entertainment</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Content identification</li>
                    <li>Broadcast monitoring</li>
                    <li>Second-screen applications</li>
                    <li>Audience analytics</li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-t-4 border-teal-500">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Consumer Applications</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Music discovery apps</li>
                    <li>Smart home integration</li>
                    <li>Personal audio cataloging</li>
                    <li>Social sharing platforms</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <Separator className="my-10 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 h-0.5 rounded-full" />
            
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">6</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Business Model & Growth Strategy</h2>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Revenue Streams</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="font-medium text-purple-700 dark:text-purple-300 mb-2">API Access Licensing</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Tiered subscription model for developers and businesses integrating our technology into their applications
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">Enterprise Solutions</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Custom implementations for large media companies, streaming platforms, and content distributors
                    </p>
                  </div>
                  
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <p className="font-medium text-teal-700 dark:text-teal-300 mb-2">Consumer Applications</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Direct-to-consumer mobile apps with freemium revenue model
                    </p>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Data & Analytics</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Anonymized insights from recognition patterns for industry researchers and analytics companies
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Growth Roadmap</h3>
                <div className="relative border-l-2 border-purple-500 pl-6 ml-4">
                  <div className="mb-8 relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Phase 1: Market Entry (Year 1)</p>
                    <p className="text-gray-700 dark:text-gray-300">Initial API launch, focusing on music recognition capabilities and strategic partnerships</p>
                  </div>
                  
                  <div className="mb-8 relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Phase 2: Expansion (Years 2-3)</p>
                    <p className="text-gray-700 dark:text-gray-300">Broadening recognition capabilities to include ambient sounds, voice patterns, and advanced audio analysis</p>
                  </div>
                  
                  <div className="mb-8 relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Phase 3: Vertical Integration (Years 4-5)</p>
                    <p className="text-gray-700 dark:text-gray-300">Developing industry-specific solutions for sectors like broadcasting, live events, and content creation</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[29px] h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">Phase 4: Global Expansion (Year 5+)</p>
                    <p className="text-gray-700 dark:text-gray-300">Targeting international markets with localized solutions and expanded language support</p>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator className="my-10 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 h-0.5 rounded-full" />
            
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">7</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Competitive Advantage</h2>
              </div>
              
              <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  SoundMatch differentiates itself through four key competitive advantages:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">Superior Accuracy</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Our advanced neural networks deliver 15-20% higher accuracy rates than leading competitors, particularly in challenging audio environments
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">Processing Speed</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Recognition in milliseconds rather than seconds, enabling real-time applications that competitors cannot support
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">Comprehensive Database</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Unified database approach that integrates multiple sources for unmatched breadth of coverage across genres and time periods
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <p className="font-bold text-gray-800 dark:text-gray-200 mb-2">Contextual Analysis</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Going beyond simple matching to provide rich metadata and insights about identified audio content
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator className="my-10 bg-gradient-to-r from-purple-300 to-blue-300 dark:from-purple-800 dark:to-blue-800 h-0.5 rounded-full" />
            
            <section>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold">8</div>
                <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Conclusion</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                SoundMatch represents a significant leap forward in audio recognition technology, offering unprecedented accuracy, speed, and contextual understanding. As the volume of audio content continues to grow exponentially across platforms and formats, our solution addresses critical needs for creators, distributors, and consumers.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Our strategic roadmap positions us to capture substantial market share in this rapidly evolving sector while continuously advancing our technological capabilities to stay ahead of market demands.
              </p>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border-l-4 border-purple-500">
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  We invite potential partners, investors, and customers to join us in revolutionizing how the world identifies, categorizes, and interacts with audio content.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
        
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 SoundMatch Technology, Inc. All rights reserved. Confidential document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhitePaper;
