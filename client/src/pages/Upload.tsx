
import React from 'react';
import { useLocation } from 'wouter';
import TrackUpload from '@/components/TrackUpload';

const Upload = () => {
  const [, setLocation] = useLocation();

  const handleUploadSuccess = (track: any) => {
    setLocation(`/results?trackId=${track.id}`);
  };
            { title: "Similar Track 2", artist: "Artist B", license: "CC BY-NC 4.0" },
            { title: "Similar Track 3", artist: "Artist C", license: "CC0 1.0" }
          ]
        } 
      } 
    });
  };

  const handleVerify = (data: any) => {
    // Mock verification process
    toast.success("Match found! License details retrieved from Story Protocol");
    console.log("Verification data received:", data);
    
    // Navigate to verification results (could be a different page in a full implementation)
    navigate('/results', { 
      state: { 
        resultData: {
          originalTrack: {
            title: "Verified Track",
            artist: "Verified Artist",
            source: "Story Protocol",
            license: "Commercial Remix License",
            licenseTerms: "Attribution Required, Commercial Use Permitted, Remix Allowed",
            registeredBy: "0x1a2b...3c4d"
          }
        } 
      } 
    });
  };

  const connectWallet = () => {
    // Mock wallet connection
    if (isWalletConnected) {
      setIsWalletConnected(false);
      setWalletAddress('');
      toast.success("Wallet disconnected");
    } else {
      setIsWalletConnected(true);
      setWalletAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
      toast.success("Wallet connected successfully");
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold">SoundRightsAI Demo</h1>
              <Button 
                onClick={connectWallet} 
                variant={isWalletConnected ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                <Wallet className="h-5 w-5" />
                {isWalletConnected 
                  ? `Connected: ${truncateAddress(walletAddress)}`
                  : "Connect Wallet"
                }
              </Button>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 text-primary p-4 rounded-md mb-8 text-sm">
              <p>
                This is an interactive demo of the SoundRightsAI platform, built on Story Protocol. 
                Use this interface to register your sound IP with programmable licenses or verify the 
                on-chain license of an existing sound.
              </p>
            </div>
            
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="register">Register Sound IP</TabsTrigger>
                <TabsTrigger value="verify">Verify Sound License</TabsTrigger>
              </TabsList>

              <TabsContent value="register" className="mt-0">
                <div className="bg-card border rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-semibold mb-4">Register Your Sound IP & Define Its License</h2>
                  <UploadForm 
                    onUpload={handleUpload} 
                    mode="register" 
                    isWalletConnected={isWalletConnected}
                  />
                </div>
              </TabsContent>

              <TabsContent value="verify" className="mt-0">
                <div className="bg-card border rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-semibold mb-4">Verify an Existing Sound's License</h2>
                  <UploadForm 
                    onUpload={handleVerify} 
                    mode="verify" 
                    isWalletConnected={isWalletConnected}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-10 bg-secondary/20 border border-secondary/30 rounded-lg p-6 text-left">
              <h2 className="text-2xl font-semibold mb-4">AI-Powered Metadata Generation</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">The AI's Role:</h3>
                  <p className="text-muted-foreground">
                    When a creator registers a new sound IP through SoundRightsAI, we use Google Gemini AI to analyze the 
                    uploaded audio and automatically generate descriptive metadata (like tags, a summary of instrumentation, 
                    mood, context, etc.). The creator can then review, edit, and confirm this AI-generated metadata before 
                    it's included with the IP Asset registered on Story Protocol.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">The Process:</h3>
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <span className="font-medium">Audio File Upload & AI Analysis:</span>
                      <p className="text-muted-foreground">
                        Once you successfully upload your audio file, our system will indicate that AI analysis is in progress with visual feedback.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">Metadata Generation:</span>
                      <p className="text-muted-foreground">
                        When analysis is complete, AI-generated metadata is presented in an editable format. This includes description, tags/keywords, mood, and instrumentation.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">User Review & Customization:</span>
                      <p className="text-muted-foreground">
                        You can review and edit all AI-generated suggestions before proceeding. This ensures the metadata accurately represents your sound.
                      </p>
                    </li>
                    <li>
                      <span className="font-medium">License Selection & Registration:</span>
                      <p className="text-muted-foreground">
                        After finalizing metadata, select your license terms and register your IP on the Story Protocol Testnet.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
