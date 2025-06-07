import React, { useState } from 'react';
import { ArrowDown, FileText, Database, Shield, Link, Award, TrendingUp, FileCode, FileAudio, Key, Rocket } from 'lucide-react';
import { Link as RouterLink } from 'wouter';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const WhitePaper = () => {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setSelectedSection(selectedSection === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-28 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Paper Header with skeuomorphic effect */}
            <div className="relative overflow-hidden rounded-xl mb-12 shadow-2xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
              
              <div 
                className="relative z-10 p-8 md:p-12 text-center border-[12px] border-white rounded-xl bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iI2YxZjFmMSIgZmlsbC1vcGFjaXR5PSIwLjQiPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYgMzRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJWOGg4djhoLTJ2LTZoLTR2MnptLTE4IDRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJWOGg4djhoLTJ2LTZoLTR2MnoiLz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==')]" 
                style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.05), 0 15px 25px -10px rgba(0,0,0,0.1)' }}>
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 rounded-lg">
                  <h1 className="text-5xl font-bold mb-4 bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">SoundRightsAI</h1>
                  <h2 className="text-2xl text-muted-foreground">On-Chain Sound IP & Programmable Licensing via Story Protocol</h2>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-6">
                  <a 
                    href="#" 
                    className="group relative inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium text-primary-foreground shadow transition-all duration-200 overflow-hidden"
                    style={{ background: 'linear-gradient(to bottom right, hsl(var(--primary)), hsl(var(--primary)) 65%, hsl(var(--primary)/0.85))' }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="absolute inset-0 w-full h-full bg-primary opacity-0 group-active:opacity-20 transition-opacity"></span>
                    Download White Paper
                    <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                  </a>
                  
                  <RouterLink
                    href="/upload"
                    className="group relative inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium border-2 border-primary text-primary shadow-sm transition-all duration-200 hover:shadow hover:bg-primary/5"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Try the Demo
                  </RouterLink>
                </div>
              </div>
            </div>
            
            {/* Paper Navigation */}
            <div className="mb-12">
              <RadioGroup defaultValue="document" className="flex flex-wrap gap-2 justify-center">
                <div className="relative w-full max-w-[200px]">
                  <RadioGroupItem value="document" id="document" className="peer sr-only" />
                  <label htmlFor="document" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                    <FileText className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Document View</span>
                  </label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Paper Content with skeuomorphic note paper effect */}
            <div 
              className="relative bg-white rounded-lg shadow-xl overflow-hidden transition-all prose prose-stone prose-headings:font-bold prose-headings:text-primary prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-li:text-muted-foreground max-w-none" 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), repeating-linear-gradient(transparent, transparent 31px, rgba(200,200,200,0.3) 31px, rgba(200,200,200,0.3) 32px)',
                boxShadow: '0 5px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 0 75px rgba(255, 255, 255, 0.3)',
                padding: '24px 32px',
                backgroundPositionY: '7px'
              }}
            >
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-br-lg"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-lg"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-lg"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-lg"></div>
              
              {/* Paperclip decoration */}
              <div className="absolute -top-2 left-[15%] rotate-12 transform-gpu w-10 h-20 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 rounded-[2px] rounded-t-[8px] shadow-md" 
                style={{ clipPath: 'polygon(0% 0%, 30% 0%, 30% 100%, 70% 100%, 70% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
                <div className="absolute top-[15%] left-[15%] w-[70%] h-[5px] bg-slate-500/30 rounded-full"></div>
                <div className="absolute top-[25%] left-[15%] w-[70%] h-[3px] bg-slate-500/20 rounded-full"></div>
              </div>

              {/* Content sections with collapsible functionality */}
              <div className="relative z-10 pt-8">
                <section className="mb-8">
                  <div onClick={() => toggleSection(0)} className="flex items-center cursor-pointer group">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-2xl font-bold mb-0 group-hover:text-primary transition-colors">1. Abstract</h2>
                    <div className={`ml-auto transform transition-transform ${selectedSection === 0 ? 'rotate-180' : ''}`}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                  <div className={`mt-2 transition-all overflow-hidden ${selectedSection === 0 ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                      <p>
                        SoundRightsAI leverages Story Protocol to provide a robust infrastructure for on-chain sound intellectual property (IP) management. It enables the registration of audio assets as unique IP Assets on Story Protocol, enriched with AI-generated (Google Gemini) metadata. Creators attach granular, on-chain Programmable IP Licenses (PILs). A verification module utilizes audio fingerprinting (AcoustID) to identify registered assets and query their authoritative PILs directly from Story Protocol. The MVP, developed for the Surreal World Assets bounty, demonstrates this core loop on the Story Testnet.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <div onClick={() => toggleSection(1)} className="flex items-center cursor-pointer group">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-2xl font-bold mb-0 group-hover:text-primary transition-colors">2. Problem Domain: Deficiencies in Current Sound IP Mechanisms</h2>
                    <div className={`ml-auto transform transition-transform ${selectedSection === 1 ? 'rotate-180' : ''}`}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                  <div className={`mt-2 transition-all overflow-hidden ${selectedSection === 1 ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                      <p>
                        Existing sound IP licensing models lack programmatic control, transparent on-chain verification, and granular permissioning adaptable to Web3 and AI contexts. Challenges include:
                      </p>
                      <ul className="pl-6 list-disc space-y-2 mt-2">
                        <li>Limited control beyond static license terms.</li>
                        <li>Inefficient off-chain verification and enforcement.</li>
                        <li>Friction in bespoke or micro-licensing transactions.</li>
                        <li>Absence of standardized, machine-readable rights for derivative works or AI training.</li>
                        <li>Centralized platform risks and lack of interoperability.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <div onClick={() => toggleSection(2)} className="flex items-center cursor-pointer group">
                    <Database className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-2xl font-bold mb-0 group-hover:text-primary transition-colors">3. SoundRightsAI: Technical Solution Architecture</h2>
                    <div className={`ml-auto transform transition-transform ${selectedSection === 2 ? 'rotate-180' : ''}`}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                  <div className={`mt-2 transition-all overflow-hidden ${selectedSection === 2 ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                      <p>
                        SoundRightsAI implements an on-chain IP management system using Story Protocol as its foundational layer.
                      </p>
                      <h3 className="text-xl font-semibold mt-4 mb-2 flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Creator Workflow (Registration & Licensing):
                      </h3>
                      <ul className="pl-6 list-disc space-y-2">
                        <li><strong>Authentication:</strong> User connects via Web3 wallet (MetaMask/Keplr, utilizing ethers.js/cosmjs).</li>
                        <li><strong>Asset Ingestion:</strong> Audio file upload to a FastAPI backend.</li>
                        <li><strong>Metadata Enrichment:</strong> Google Gemini API call generates descriptive metadata (instrumentation, mood, context). User confirms/edits alongside manual inputs (title, artist).</li>
                        <li><strong>License Definition:</strong> Creator selects a predefined Story Protocol PIL template (e.g., Non-Commercial Remix, Commercial Use).</li>
                        <li><strong>On-Chain Transaction:</strong> Backend utilizes Story Protocol SDK (Python) to:
                          <ul className="pl-6 list-disc mt-1">
                            <li>Mint the sound as an IP Asset NFT on Story Protocol (Testnet).</li>
                            <li>Attach the selected PIL to the IP Asset.</li>
                          </ul>
                        </li>
                        <li><strong>Local Indexing:</strong> An audio fingerprint (AcoustID/Chromaprint) is generated and stored in a PostgreSQL/SQLite database, mapped to the returned on-chain ipAssetId.</li>
                      </ul>

                      <h3 className="text-xl font-semibold mt-4 mb-2 flex items-center">
                        <FileSearch className="h-4 w-4 mr-2" />
                        User Workflow (License Verification):
                      </h3>
                      <ul className="pl-6 list-disc space-y-2">
                        <li><strong>Asset Submission:</strong> Audio file upload to the FastAPI backend.</li>
                        <li><strong>Fingerprint Matching:</strong> AcoustID fingerprint generated and queried against the local database to retrieve the associated ipAssetId.</li>
                        <li><strong>On-Chain Query:</strong> If ipAssetId is found, the Story Protocol SDK is used to query the blockchain directly for the PIL terms associated with that IP Asset.</li>
                        <li><strong>Data Presentation:</strong> The React frontend displays the authoritative on-chain license terms.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <div onClick={() => toggleSection(3)} className="flex items-center cursor-pointer group">
                    <FileCode className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-2xl font-bold mb-0 group-hover:text-primary transition-colors">4. MVP Core Modules & Functionality</h2>
                    <div className={`ml-auto transform transition-transform ${selectedSection === 3 ? 'rotate-180' : ''}`}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                  <div className={`mt-2 transition-all overflow-hidden ${selectedSection === 3 ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="mb-4 p-4 border border-primary/20 rounded-lg bg-primary/5 shadow-inner">
                        <h3 className="text-xl font-semibold mb-2 flex items-center">
                          <Link className="h-4 w-4 mr-2" />
                          Wallet Integration Module (Frontend):
                        </h3>
                        <ul className="pl-6 list-disc space-y-1">
                          <li>Connection to EVM/Cosmos compatible wallets via ethers.js/cosmjs.</li>
                          <li>Signature provision for Story Protocol transactions.</li>
                        </ul>
                      </div>

                      <div className="mb-4 p-4 border border-primary/20 rounded-lg bg-primary/5 shadow-inner">
                        <h3 className="text-xl font-semibold mb-2 flex items-center">
                          <FileAudio className="h-4 w-4 mr-2" />
                          IP Registration Module (Backend: FastAPI; Frontend: React):
                        </h3>
                        <ul className="pl-6 list-disc space-y-1">
                          <li>API endpoint for audio upload and metadata submission.</li>
                          <li>Integration with Google Gemini API for metadata generation.</li>
                          <li>Interface for PIL template selection.</li>
                          <li>Story Protocol SDK calls: registerIpAsset, attachLicenseToIpAsset.</li>
                          <li>AcoustID fingerprinting and PostgreSQL/SQLite for fingerprint:ipAssetId mapping.</li>
                        </ul>
                      </div>

                      <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 shadow-inner">
                        <h3 className="text-xl font-semibold mb-2 flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          IP License Verification Module (Backend: FastAPI; Frontend: React):
                        </h3>
                        <ul className="pl-6 list-disc space-y-1">
                          <li>API endpoint for audio upload for verification.</li>
                          <li>AcoustID fingerprinting and local DB lookup.</li>
                          <li>Story Protocol SDK call: getLicenseTerms (or equivalent) for an ipAssetId.</li>
                          <li>Frontend component for displaying fetched on-chain license data.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <div onClick={() => toggleSection(4)} className="flex items-center cursor-pointer group">
                    <LayersIcon className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-2xl font-bold mb-0 group-hover:text-primary transition-colors">5. Technology Stack</h2>
                    <div className={`ml-auto transform transition-transform ${selectedSection === 4 ? 'rotate-180' : ''}`}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                  <div className={`mt-2 transition-all overflow-hidden ${selectedSection === 4 ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">Blockchain Protocol:</p>
                          <p>Story Protocol (Layer 1; Testnet for MVP)</p>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">Smart Contracts/Protocol Interaction:</p>
                          <p>Story Protocol SDK (Python)</p>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">AI Services:</p>
                          <p>Google Gemini API (HTTP requests)</p>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">Audio Fingerprinting:</p>
                          <p>AcoustID, Chromaprint libraries</p>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">Backend:</p>
                          <p>Python 3.x, FastAPI (ASGI), Uvicorn/Gunicorn</p>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">Frontend:</p>
                          <p>TypeScript, React (Vite), Tailwind CSS, ethers.js/cosmjs</p>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">Database:</p>
                          <p>PostgreSQL (production) / SQLite (MVP development)</p>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-white/50">
                          <p className="font-semibold">DevOps:</p>
                          <p>Docker, Vercel (frontend), Railway (backend)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <div onClick={() => toggleSection(5)} className="flex items-center cursor-pointer group">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-2xl font-bold mb-0 group-hover:text-primary transition-colors">6. Surreal World Assets Bounty Alignment</h2>
                    <div className={`ml-auto transform transition-transform ${selectedSection === 5 ? 'rotate-180' : ''}`}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                  <div className={`mt-2 transition-all overflow-hidden ${selectedSection === 5 ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                      <p className="mb-4">
                        SoundRightsAI directly targets the following bounty tracks by implementing core Story Protocol functionalities:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-50 border-l-4 border-primary">
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Database className="h-4 w-4 mr-2" />
                            Data
                          </h3>
                          <p className="text-sm">
                            Enables registration of sound datasets as programmable IP on Story, enhancing them with AI-generated metadata. Focuses on IP registration, protection, and discoverability.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-50 border-l-4 border-primary">
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Coins className="h-4 w-4 mr-2" />
                            IPFi
                          </h3>
                          <p className="text-sm">
                            Establishes a framework for creator-defined, programmable licenses (PILs), laying groundwork for future on-chain monetization models using $IP tokens.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-50 border-l-4 border-primary">
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            IP Detection & Enforcement
                          </h3>
                          <p className="text-sm">
                            The verification module acts as a tool for detecting usage rights by querying immutable on-chain license data, promoting transparent IP enforcement.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-50 border-l-4 border-primary">
                          <h3 className="text-lg font-semibold mb-2 flex items-center">
                            <Link className="h-4 w-4 mr-2" />
                            Core Story Usage
                          </h3>
                          <p className="text-sm">
                            Deep integration with Story SDK for minting IP Assets, managing PILs, and querying the on-chain IP graph.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <div onClick={() => toggleSection(6)} className="flex items-center cursor-pointer group">
                    <Rocket className="h-5 w-5 mr-2 text-primary" />
                    <h2 className="text-2xl font-bold mb-0 group-hover:text-primary transition-colors">7. Roadmap</h2>
                    <div className={`ml-auto transform transition-transform ${selectedSection === 6 ? 'rotate-180' : ''}`}>
                      <ArrowDown size={16} />
                    </div>
                  </div>
                  <div className={`mt-2 transition-all overflow-hidden ${selectedSection === 6 ? 'max-h-[1000px]' : 'max-h-0'}`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="relative border-l-2 border-primary/50 pl-6 pb-2 before:content-[''] before:absolute before:left-[-5px] before:top-0 before:w-2 before:h-2 before:rounded-full before:bg-primary">
                        <h3 className="text-lg font-semibold flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Phase 1 (MVP - Bounty Submission)
                        </h3>
                        <p className="text-sm mt-1">
                          Deliver core registration (with AI metadata via Gemini), PIL selection (from Story templates), and on-chain verification modules operating on Story Protocol Testnet.
                        </p>
                      </div>
                      
                      <div className="relative border-l-2 border-primary/50 pl-6 py-2 before:content-[''] before:absolute before:left-[-5px] before:top-0 before:w-2 before:h-2 before:rounded-full before:bg-primary">
                        <h3 className="text-lg font-semibold flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Phase 2 (Post-Bounty - Q3-Q4 2025)
                        </h3>
                        <ul className="pl-4 list-disc space-y-1 mt-1 text-sm">
                          <li>Implement direct $IP token payments for commercial PILs via smart contract interactions on Story.</li>
                          <li>Expand PIL customization options within the UI.</li>
                          <li>Mainnet deployment strategy and execution on Story Protocol.</li>
                          <li>User account system for managing registered IP portfolios.</li>
                        </ul>
                      </div>
                      
                      <div className="relative border-l-2 border-primary/30 pl-6 pt-2 before:content-[''] before:absolute before:left-[-5px] before:top-0 before:w-2 before:h-2 before:rounded-full before:bg-primary">
                        <h3 className="text-lg font-semibold flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Phase 3 (Growth - 2026+)
                        </h3>
                        <ul className="pl-4 list-disc space-y-1 mt-1 text-sm">
                          <li>Batch registration capabilities for large sound catalogs.</li>
                          <li>API development for third-party integrations (DAWs, marketplaces, other dApps on Story).</li>
                          <li>Explore advanced IPFi mechanisms (e.g., license token fractionalization, royalty stream management) as enabled by Story Protocol evolution.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-br from-primary to-primary/70">
                <RouterLink
                  to="/upload"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-base font-medium bg-white text-primary shadow hover:bg-primary/10 transition-colors"
                >
                  Try SoundRightsAI Demo
                </RouterLink>
              </div>
              
              <p className="mt-4 text-sm text-muted-foreground">
                Experience the future of sound IP management built on Story Protocol
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Custom icon component for file search
const FileSearch = ({ className }: { className?: string }) => {
  return (
    <span className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
        <circle cx="11.5" cy="14.5" r="2.5"/>
        <path d="M13.25 16.25 15 18"/>
      </svg>
    </span>
  );
};

// Custom icon component for coins
const Coins = ({ className }: { className?: string }) => {
  return (
    <span className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6"/>
        <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
        <path d="M7 6h1v4"/>
        <path d="m16.71 13.88.7.71-2.82 2.82"/>
      </svg>
    </span>
  );
};

// Custom Layers icon component
const LayersIcon = ({ className }: { className?: string }) => {
  return (
    <span className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    </span>
  );
};

export default WhitePaper;
