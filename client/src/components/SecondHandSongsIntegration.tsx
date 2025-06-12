import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Music, Search, AlertTriangle, CheckCircle, ExternalLink, Copy, History, Users } from 'lucide-react';

interface CoverVersion {
  id: string;
  artist: string;
  title: string;
  year?: number;
  release_info?: string;
  confidence_score: number;
}

interface SampleUsage {
  id: string;
  sampling_artist: string;
  sampling_track: string;
  sampled_portion: string;
  year?: number;
  sample_type: 'vocal' | 'instrumental' | 'loop' | 'break';
}

interface OrigininalityResult {
  is_original: boolean;
  confidence_score: number;
  potential_matches: {
    covers: CoverVersion[];
    samples: SampleUsage[];
    similar_works: any[];
  };
  licensing_requirements: {
    mechanical_rights: boolean;
    sync_rights: boolean;
    master_rights: boolean;
    publishing_rights: boolean;
  };
}

interface ComprehensiveCheck {
  overall_originality: boolean;
  confidence_score: number;
  detailed_analysis: {
    secondhandsongs_check: OrigininalityResult;
    audio_similarity: number;
    lyrical_similarity: number;
  };
  recommendations: string[];
}

export default function SecondHandSongsIntegration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComprehensiveCheck | null>(null);
  const [searchForm, setSearchForm] = useState({
    title: '',
    artist: '',
    lyrics: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  const performComprehensiveCheck = async () => {
    if (!searchForm.title || !searchForm.artist) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both title and artist information',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/secondhandsongs/comprehensive-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: searchForm.title,
          artist: searchForm.artist,
          lyrics: searchForm.lyrics
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        
        toast({
          title: 'Analysis Complete',
          description: `Originality: ${Math.round(data.confidence_score * 100)}% - ${data.overall_originality ? 'Original work detected' : 'Derivative work detected'}`,
          variant: data.overall_originality ? 'default' : 'destructive'
        });
      } else {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Text copied to clipboard',
    });
  };

  const getLicensingBadgeColor = (required: boolean) => {
    return required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">SecondHandSongs Integration</h3>
        <p className="text-muted-foreground">
          Advanced cover version detection and derivative work analysis for comprehensive IP verification
        </p>
        <Badge variant="outline" className="mt-2">
          <History className="w-3 h-3 mr-1" />
          Musical Heritage Database
        </Badge>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Comprehensive Originality Analysis
          </CardTitle>
          <CardDescription>
            Check for cover versions, samples, and derivative works in the SecondHandSongs database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title *</Label>
              <Input
                id="title"
                placeholder="Enter track title"
                value={searchForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artist">Artist Name *</Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={searchForm.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lyrics">Lyrics (Optional)</Label>
            <Input
              id="lyrics"
              placeholder="Enter lyrical excerpts for enhanced matching"
              value={searchForm.lyrics}
              onChange={(e) => handleInputChange('lyrics', e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={performComprehensiveCheck}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Analyzing...' : 'Perform Comprehensive Check'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchForm({ title: 'Bohemian Rhapsody', artist: 'Queen', lyrics: '' });
              }}
              size="sm"
            >
              Demo Track
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Overall Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.overall_originality ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                Originality Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${result.overall_originality ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(result.confidence_score * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.detailed_analysis.secondhandsongs_check.potential_matches.covers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Cover Versions</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.detailed_analysis.secondhandsongs_check.potential_matches.samples.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Sample Uses</div>
                </div>
                
                <div className="text-center">
                  <Badge variant={result.overall_originality ? 'default' : 'destructive'} className="text-xs">
                    {result.overall_originality ? 'Original' : 'Derivative'}
                  </Badge>
                </div>
              </div>

              {/* Licensing Requirements */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Licensing Requirements</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(result.detailed_analysis.secondhandsongs_check.licensing_requirements).map(([key, required]) => (
                    <Badge key={key} className={getLicensingBadgeColor(required as boolean)}>
                      {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {required ? 'Required' : 'Not Required'}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="covers" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="covers" className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                Cover Versions
              </TabsTrigger>
              <TabsTrigger value="samples" className="flex items-center gap-2">
                <Music className="h-3 w-3" />
                Sample Usage
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3" />
                Recommendations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="covers" className="mt-4">
              {result.detailed_analysis.secondhandsongs_check.potential_matches.covers.length > 0 ? (
                <div className="space-y-4">
                  {result.detailed_analysis.secondhandsongs_check.potential_matches.covers.map((cover, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cover.title}</h4>
                            <p className="text-sm text-muted-foreground">{cover.artist}</p>
                            {cover.year && (
                              <p className="text-xs text-muted-foreground">{cover.year}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">
                              {Math.round(cover.confidence_score * 100)}% match
                            </Badge>
                            {cover.release_info && (
                              <p className="text-xs text-muted-foreground mt-1">{cover.release_info}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">No cover versions detected in database</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="samples" className="mt-4">
              {result.detailed_analysis.secondhandsongs_check.potential_matches.samples.length > 0 ? (
                <div className="space-y-4">
                  {result.detailed_analysis.secondhandsongs_check.potential_matches.samples.map((sample, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{sample.sampling_track}</h4>
                            <p className="text-sm text-muted-foreground">{sample.sampling_artist}</p>
                            <p className="text-xs text-muted-foreground">Sampled: {sample.sampled_portion}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">
                              {sample.sample_type}
                            </Badge>
                            {sample.year && (
                              <p className="text-xs text-muted-foreground mt-1">{sample.year}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">No sample usage detected in database</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-4">IP Protection Recommendations</h4>
                  <div className="space-y-3">
                    {result.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Integration Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SecondHandSongs Database</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive database of cover versions, samples, and derivative works
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://secondhandsongs.com/page/Introduction', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Learn More
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://secondhandsongs.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit Site
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}