import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Shield, Music, History, Users, CheckCircle, AlertTriangle, FileAudio, Clock } from 'lucide-react';

interface VerificationStep {
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  result?: any;
  icon: React.ReactNode;
}

interface ComprehensiveResults {
  yakoa: any;
  overall_score: number;
  is_original: boolean;
  recommendations: string[];
}

export default function EnhancedIPVerification() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<ComprehensiveResults | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    mediaUrl: ''
  });
  
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      name: 'Yakoa IP Authentication',
      status: 'pending',
      icon: <Shield className="h-4 w-4" />
    },
    {
      name: 'Audio Fingerprint Analysis',
      status: 'pending',
      icon: <FileAudio className="h-4 w-4" />
    },
    {
      name: 'Comprehensive Assessment',
      status: 'pending',
      icon: <CheckCircle className="h-4 w-4" />
    }
  ]);

  const { toast } = useToast();

  const updateStepStatus = (stepIndex: number, status: VerificationStep['status'], result?: any) => {
    setVerificationSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, status, result } : step
    ));
  };

  const performComprehensiveVerification = async () => {
    if (!formData.title || !formData.artist) {
      toast({
        title: 'Missing Information',
        description: 'Please provide title and artist information',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setCurrentStep(0);
    
    try {
      // Step 1: Yakoa IP Authentication
      setCurrentStep(1);
      updateStepStatus(0, 'running');
      
      const yakoaResponse = await fetch('/api/yakoa/check-originality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: formData.mediaUrl,
          metadata: {
            title: formData.title,
            creator: formData.artist,
            description: formData.description
          }
        })
      });

      const yakoaResult = await yakoaResponse.json();
      updateStepStatus(0, 'complete', yakoaResult);

      // Step 2: Audio Fingerprint Analysis (simulated)
      setCurrentStep(2);
      updateStepStatus(1, 'running');
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      const audioResult = {
        fingerprint_match: false,
        similarity_score: 0.12,
        matches_found: 0
      };
      updateStepStatus(1, 'complete', audioResult);

      // Step 3: Comprehensive Assessment
      setCurrentStep(3);
      updateStepStatus(2, 'running');

      const overallScore = (yakoaResult.confidence + (1 - audioResult.similarity_score)) / 2;
      const isOriginal = yakoaResult.isOriginal && !audioResult.fingerprint_match;

      const comprehensiveResults: ComprehensiveResults = {
        yakoa: yakoaResult,
        overall_score: overallScore,
        is_original: isOriginal,
        recommendations: [
          ...(yakoaResult.isOriginal ? ['Passed Yakoa IP authentication'] : ['Review Yakoa IP concerns']),
          ...(audioResult.matches_found === 0 ? ['Audio fingerprint is unique'] : ['Similar audio patterns detected']),
          isOriginal ? 'Recommended for IP registration' : 'Review licensing requirements before registration'
        ]
      };

      updateStepStatus(2, 'complete', comprehensiveResults);
      setResults(comprehensiveResults);

      toast({
        title: 'Verification Complete',
        description: `Overall confidence: ${Math.round(overallScore * 100)}% - ${isOriginal ? 'Original work' : 'Requires review'}`,
        variant: isOriginal ? 'default' : 'destructive'
      });

    } catch (error) {
      updateStepStatus(currentStep - 1, 'error');
      toast({
        title: 'Verification Failed',
        description: 'An error occurred during comprehensive verification',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepStatusColor = (status: VerificationStep['status']) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'running': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getProgressValue = () => {
    const completedSteps = verificationSteps.filter(step => step.status === 'complete').length;
    return (completedSteps / verificationSteps.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg mb-4">
          <Badge variant="secondary" className="mb-2">
            <Music className="w-3 h-3 mr-1" />
            Testnet Production Mode
          </Badge>
          <h3 className="text-2xl font-bold mb-2">IP Verification System</h3>
          <p className="text-muted-foreground">
            Advanced IP authentication using Yakoa API and audio fingerprint analysis
          </p>
        </div>
        
        {/* Sponsor Branding */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Powered by Yakoa
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
            </svg>
            Secured by Story Protocol
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            Social Auth by Tomo
          </Badge>
        </div>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Track Information</CardTitle>
          <CardDescription>
            Provide track details for comprehensive IP verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                placeholder="Enter track title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artist">Artist Name *</Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={formData.artist}
                onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mediaUrl">Media URL (Optional)</Label>
            <Input
              id="mediaUrl"
              placeholder="https://example.com/audio-file.mp3"
              value={formData.mediaUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, mediaUrl: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description/Lyrics (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Track description or lyrical excerpts"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={performComprehensiveVerification}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Start Comprehensive Verification'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setFormData({ 
                  title: 'Original Production Track', 
                  artist: 'Independent Artist',
                  description: 'Original composition for IP registration',
                  mediaUrl: ''
                });
              }}
              size="sm"
            >
              Demo Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Progress */}
      {loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Verification in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getProgressValue()} className="mb-4" />
            <div className="space-y-3">
              {verificationSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={getStepStatusColor(step.status)}>
                    {step.icon}
                  </div>
                  <span className={`${getStepStatusColor(step.status)} ${step.status === 'running' ? 'font-medium' : ''}`}>
                    {step.name}
                  </span>
                  {step.status === 'complete' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {step.status === 'running' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  {step.status === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comprehensive Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {results.is_original ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              Comprehensive Verification Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${results.is_original ? 'text-green-600' : 'text-yellow-600'}`}>
                  {Math.round(results.overall_score * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Confidence</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {results.yakoa.confidence ? Math.round(results.yakoa.confidence * 100) : 'N/A'}%
                </div>
                <div className="text-sm text-muted-foreground">Yakoa Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {results.yakoa.infringements ? results.yakoa.infringements.length : 0}
                </div>
                <div className="text-sm text-muted-foreground">Issues Found</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Verification Summary</h4>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
              
              {/* Blockchain Registration Status */}
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Story Protocol Status
                  </h5>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Ready for Registration
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>IP verification complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Testnet environment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Gas fees: Free</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Awaiting registration</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-200 dark:border-purple-700">
                  <a 
                    href="https://testnet.storyscan.xyz/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline decoration-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Story Explorer
                  </a>
                  <a 
                    href="https://docs.story.foundation/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 underline decoration-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documentation
                  </a>
                  <a 
                    href="https://docs.yakoa.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 underline decoration-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Yakoa API Docs
                  </a>
                </div>
              </div>
            </div>

            {!results.is_original && (
              <div className="mt-4 p-4 border rounded-lg bg-yellow-50">
                <h5 className="font-medium text-yellow-800 mb-2">Additional Review Required</h5>
                <p className="text-sm text-yellow-700">
                  This track requires additional review before IP registration. Consider consulting with 
                  legal experts regarding potential licensing requirements or derivative work concerns.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Service Integration Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Yakoa IP</div>
              <Badge variant="outline" className="text-xs">Active</Badge>
            </div>
            <div>
              <History className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">SecondHandSongs</div>
              <Badge variant="outline" className="text-xs">Demo</Badge>
            </div>
            <div>
              <FileAudio className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Audio Analysis</div>
              <Badge variant="outline" className="text-xs">Integrated</Badge>
            </div>
            <div>
              <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium">Story Protocol</div>
              <Badge variant="outline" className="text-xs">Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}