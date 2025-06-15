import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Shield, Upload, CheckCircle, AlertTriangle, ExternalLink, FileAudio } from 'lucide-react';

interface YakoaToken {
  id: string;
  status: 'pending' | 'complete' | 'failed';
  media_url: string;
  metadata: {
    title?: string;
    creator?: string;
    description?: string;
  };
  infringements?: {
    total: number;
    high_confidence: number;
    results: Array<{
      confidence: number;
      source: string;
      description: string;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export default function YakoaIntegration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<YakoaToken | null>(null);
  const [formData, setFormData] = useState({
    mediaUrl: '',
    title: '',
    creator: '',
    description: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkIPAuthenticity = async () => {
    if (!formData.mediaUrl || !formData.title || !formData.creator) {
      toast({
        title: 'Missing Information',
        description: 'Please provide media URL, title, and creator information',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/yakoa/check-originality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: formData.mediaUrl,
          metadata: {
            title: formData.title,
            creator: formData.creator,
            description: formData.description || `Audio track: ${formData.title} by ${formData.creator}`
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          id: data.yakoaTokenId,
          status: 'complete',
          media_url: formData.mediaUrl,
          metadata: {
            title: formData.title,
            creator: formData.creator,
            description: formData.description
          },
          infringements: {
            total: data.infringements?.length || 0,
            high_confidence: data.infringements?.filter((inf: any) => inf.confidence > 0.8).length || 0,
            results: data.infringements || []
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        toast({
          title: 'IP Authentication Complete',
          description: `Originality score: ${Math.round(data.confidence * 100)}% - ${data.isOriginal ? 'Original content' : 'Potential issues detected'}`,
          variant: data.isOriginal ? 'default' : 'destructive'
        });
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      toast({
        title: 'IP Authentication Failed',
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getOriginalityStatus = () => {
    if (!result?.infringements) return null;
    
    const { total, high_confidence } = result.infringements;
    if (total === 0) {
      return { status: 'original', label: 'Original Content', color: 'bg-green-100 text-green-800' };
    } else if (high_confidence === 0) {
      return { status: 'low_risk', label: 'Low Risk', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'high_risk', label: 'High Risk', color: 'bg-red-100 text-red-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Yakoa IP Authentication</h3>
        <p className="text-muted-foreground">
          Advanced AI-powered content authentication for intellectual property verification
        </p>
        <Badge variant="outline" className="mt-2">
          <Shield className="w-3 h-3 mr-1" />
          Demo Environment Active
        </Badge>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit Content for IP Authentication
          </CardTitle>
          <CardDescription>
            Enter media URL and metadata to check for IP authenticity and originality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mediaUrl">Media URL *</Label>
            <Input
              id="mediaUrl"
              placeholder="https://example.com/audio-file.mp3"
              value={formData.mediaUrl}
              onChange={(e) => handleInputChange('mediaUrl', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Track Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creator">Creator *</Label>
              <Input
                id="creator"
                placeholder="Artist Name"
                value={formData.creator}
                onChange={(e) => handleInputChange('creator', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description of the content"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
          
          <Button
            onClick={checkIPAuthenticity}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Authenticating Content...' : 'Check IP Authenticity'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="h-5 w-5" />
              Authentication Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{result.id.slice(-8)}</div>
                <div className="text-sm text-muted-foreground">Token ID</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.infringements?.total || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Matches</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {result.infringements?.high_confidence || 0}
                </div>
                <div className="text-sm text-muted-foreground">High Confidence</div>
              </div>
              
              <div className="text-center">
                {getOriginalityStatus() && (
                  <Badge className={getOriginalityStatus()!.color}>
                    {getOriginalityStatus()!.status === 'original' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    )}
                    {getOriginalityStatus()!.label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Content Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Title:</span> {result.metadata.title}
                </div>
                <div>
                  <span className="font-medium">Creator:</span> {result.metadata.creator}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <Badge variant="secondary" className="ml-1">{result.status}</Badge>
                </div>
                <div>
                  <span className="font-medium">Authenticated:</span> {new Date(result.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {result.infringements && result.infringements.results.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Potential Issues Detected</h4>
                <div className="space-y-2">
                  {result.infringements.results.map((infringement, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-yellow-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{infringement.source}</p>
                          <p className="text-sm text-muted-foreground">{infringement.description}</p>
                        </div>
                        <Badge variant="outline">
                          {Math.round(infringement.confidence * 100)}% match
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* API Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Yakoa IP API</h4>
              <p className="text-sm text-muted-foreground">
                Demo environment - Register for full API access
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://docs.yakoa.io/reference/demo-environment', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Demo Guide
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://docs.yakoa.io', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Full Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}