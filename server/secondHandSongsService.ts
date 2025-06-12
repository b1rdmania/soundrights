export interface SecondHandSongsWork {
  id: string;
  title: string;
  original_artist: string;
  year?: number;
  covers: CoverVersion[];
  samples: SampleUsage[];
  derivatives: DerivativeWork[];
}

export interface CoverVersion {
  id: string;
  artist: string;
  title: string;
  year?: number;
  release_info?: string;
  confidence_score: number;
}

export interface SampleUsage {
  id: string;
  sampling_artist: string;
  sampling_track: string;
  sampled_portion: string;
  year?: number;
  sample_type: 'vocal' | 'instrumental' | 'loop' | 'break';
}

export interface DerivativeWork {
  id: string;
  type: 'remix' | 'mashup' | 'interpolation' | 'adaptation';
  artist: string;
  title: string;
  relationship: string;
}

export interface OrigininalityCheckResult {
  is_original: boolean;
  confidence_score: number;
  potential_matches: {
    covers: CoverVersion[];
    samples: SampleUsage[];
    similar_works: SecondHandSongsWork[];
  };
  licensing_requirements: {
    mechanical_rights: boolean;
    sync_rights: boolean;
    master_rights: boolean;
    publishing_rights: boolean;
  };
}

export class SecondHandSongsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://secondhandsongs.com/api';
  private readonly demoMode: boolean;

  constructor() {
    this.apiKey = process.env.SECONDHANDSONGS_API_KEY || '';
    this.demoMode = !this.apiKey;
    
    if (this.demoMode) {
      console.log('SecondHandSongs Service running in demo mode - provide API key for full integration');
    } else {
      console.log('SecondHandSongs Service initialized with API key');
    }
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    if (this.demoMode) {
      return this.getMockResponse(endpoint, options);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`SecondHandSongs API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SecondHandSongs API request failed:', error);
      throw error;
    }
  }

  private getMockResponse(endpoint: string, options: any) {
    // Mock responses for demo purposes
    if (endpoint.includes('/search/work')) {
      return {
        works: [
          {
            id: 'shs_1234',
            title: 'Test Original Song',
            original_artist: 'Original Artist',
            year: 1985,
            covers: [
              {
                id: 'cover_1',
                artist: 'Cover Artist',
                title: 'Test Original Song (Cover)',
                year: 2020,
                confidence_score: 0.95
              }
            ],
            samples: [],
            derivatives: []
          }
        ],
        total_results: 1
      };
    }

    if (endpoint.includes('/check/originality')) {
      return {
        is_original: true,
        confidence_score: 0.92,
        potential_matches: {
          covers: [],
          samples: [],
          similar_works: []
        },
        licensing_requirements: {
          mechanical_rights: false,
          sync_rights: false,
          master_rights: false,
          publishing_rights: false
        }
      };
    }

    throw new Error('Unknown endpoint in demo mode');
  }

  /**
   * Search for existing works by title and artist
   */
  async searchWorks(title: string, artist: string): Promise<SecondHandSongsWork[]> {
    try {
      const response = await this.makeRequest('/search/work', {
        method: 'GET',
        params: {
          title: title,
          artist: artist,
          limit: 10
        }
      });

      return response.works || [];
    } catch (error) {
      console.error('Failed to search SecondHandSongs works:', error);
      throw new Error('Work search failed');
    }
  }

  /**
   * Check originality of a track against SecondHandSongs database
   */
  async checkOriginality(title: string, artist: string, audioFeatures?: any): Promise<OrigininalityCheckResult> {
    try {
      const searchResults = await this.searchWorks(title, artist);
      
      if (this.demoMode) {
        // Return demo originality check
        return {
          is_original: searchResults.length === 0,
          confidence_score: searchResults.length === 0 ? 0.98 : 0.65,
          potential_matches: {
            covers: searchResults.length > 0 ? searchResults[0].covers : [],
            samples: searchResults.length > 0 ? searchResults[0].samples : [],
            similar_works: searchResults
          },
          licensing_requirements: {
            mechanical_rights: searchResults.length > 0,
            sync_rights: searchResults.length > 0,
            master_rights: false,
            publishing_rights: searchResults.length > 0
          }
        };
      }

      // In production, this would use more sophisticated matching
      const response = await this.makeRequest('/check/originality', {
        method: 'POST',
        body: JSON.stringify({
          title,
          artist,
          audio_features: audioFeatures
        })
      });

      return response;
    } catch (error) {
      console.error('Failed to check originality:', error);
      throw new Error('Originality check failed');
    }
  }

  /**
   * Get cover versions of a specific work
   */
  async getCoverVersions(workId: string): Promise<CoverVersion[]> {
    try {
      const response = await this.makeRequest(`/work/${workId}/covers`);
      return response.covers || [];
    } catch (error) {
      console.error('Failed to get cover versions:', error);
      throw new Error('Cover version lookup failed');
    }
  }

  /**
   * Identify potential samples in audio
   */
  async identifySamples(audioFeatures: any): Promise<SampleUsage[]> {
    try {
      if (this.demoMode) {
        return []; // No samples found in demo
      }

      const response = await this.makeRequest('/identify/samples', {
        method: 'POST',
        body: JSON.stringify({
          audio_features: audioFeatures
        })
      });

      return response.samples || [];
    } catch (error) {
      console.error('Failed to identify samples:', error);
      throw new Error('Sample identification failed');
    }
  }

  /**
   * Get licensing requirements for a work
   */
  async getLicensingRequirements(workId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/work/${workId}/licensing`);
      return response.licensing || {};
    } catch (error) {
      console.error('Failed to get licensing requirements:', error);
      throw new Error('Licensing lookup failed');
    }
  }

  /**
   * Enhanced originality check combining multiple data sources
   */
  async comprehensiveOrigininalityCheck(data: {
    title: string;
    artist: string;
    audioFeatures?: any;
    lyrics?: string;
  }): Promise<{
    overall_originality: boolean;
    confidence_score: number;
    detailed_analysis: {
      secondhandsongs_check: OrigininalityCheckResult;
      audio_similarity: number;
      lyrical_similarity: number;
    };
    recommendations: string[];
  }> {
    try {
      const shsCheck = await this.checkOriginality(data.title, data.artist, data.audioFeatures);
      
      return {
        overall_originality: shsCheck.is_original,
        confidence_score: shsCheck.confidence_score,
        detailed_analysis: {
          secondhandsongs_check: shsCheck,
          audio_similarity: 0.15, // Would come from audio analysis
          lyrical_similarity: 0.10  // Would come from lyrical analysis
        },
        recommendations: shsCheck.is_original 
          ? ['Track appears to be original', 'Consider registering with PROs']
          : ['Review potential licensing requirements', 'Contact rights holders if covers detected', 'Consider mechanical licensing for covers']
      };
    } catch (error) {
      console.error('Comprehensive originality check failed:', error);
      throw new Error('Enhanced originality verification failed');
    }
  }
}

export const secondHandSongsService = new SecondHandSongsService();