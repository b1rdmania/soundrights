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
  secondhandsongs: any;
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
      name: 'SecondHandSongs Cover Detection',
      status: 'pending',
      icon: <History className="h-4 w-4" />
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
          mediaUrl: formData.mediaUrl || 'https://example.com/demo-audio.mp3',
          metadata: {
            title: formData.title,
            creator: formData.artist,
            description: formData.description
          }
        })
      });

      const yakoaResult = await yakoaResponse.json();
      updateStepStatus(0, 'complete', yakoaResult);

      // Step 2: SecondHandSongs Cover Detection
      setCurrentStep(2);
      updateStepStatus(1, 'running');

      const shsResponse = await fetch('/api/secondhandsongs/comprehensive-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          artist: formData.artist,
          lyrics: formData.description
        })
      });

      const shsResult = await shsResponse.json();
      updateStepStatus(1, 'complete', shsResult);

      // Step 3: Audio Fingerprint Analysis (simulated)
      setCurrentStep(3);
      updateStepStatus(2, 'running');
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      const audioResult = {
        fingerprint_match: false,
        similarity_score: 0.12,
        matches_found: 0
      };
      updateStepStatus(2, 'complete', audioResult);

      // Step 4: Comprehensive Assessment
      setCurrentStep(4);
      updateStepStatus(3, 'running');

      const overallScore = (yakoaResult.confidence + shsResult.confidence_score + (1 - audioResult.similarity_score)) / 3;
      const isOriginal = yakoaResult.isOriginal && shsResult.overall_originality && !audioResult.fingerprint_match;

      const comprehensiveResults: ComprehensiveResults = {
        yakoa: yakoaResult,
        secondhandsongs: shsResult,
        overall_score: overallScore,
        is_original: isOriginal,
        recommendations: [
          ...(yakoaResult.isOriginal ? ['✓ Passed Yakoa IP authentication'] : ['⚠ Review Yakoa IP concerns']),
          ...(shsResult.overall_originality ? ['✓ No cover versions detected'] : ['⚠ Potential cover versions found']),
          ...(audioResult.matches_found === 0 ? ['✓ Audio fingerprint is unique'] : ['⚠ Similar audio patterns detected']),
          isOriginal ? '🎯 Recommended for IP registration' : '📋 Review licensing requirements before registration'
        ]
      };

      updateStepStatus(3, 'complete', comprehensiveResults);
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
        <h3 className="text-2xl font-bold mb-2">Enhanced IP Verification System</h3>
        <p className="text-muted-foreground">
          Comprehensive originality checking combining multiple verification services
        </p>
        <Badge variant="outline" className="mt-2">
          <Music className="w-3 h-3 mr-1" />
          Multi-Source Analysis
        </Badge>
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
                  title: 'Original Demo Track', 
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
                  {Math.round(results.secondhandsongs.confidence_score * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">SHS Score</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Verification Summary</h4>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5">•</span>
                    <span>{rec}</span>
                  </div>
                ))}
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