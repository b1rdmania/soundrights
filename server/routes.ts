import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storyService } from "./storyProtocol";
import { audioAnalysis } from "./audioAnalysis";
import { yakoaService } from "./yakoaService";
import { tomoService } from "./tomoService";
import { zapperService } from "./zapperService";
import { walletConnectService } from "./walletConnectService";

import multer from "multer";
import { z } from "zod";
import { insertTrackSchema, insertLicenseSchema, licenses, tracks, userActivities } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav',
      'audio/flac', 'audio/aac', 'audio/ogg', 'audio/webm', 'audio/m4a'
    ];
    const allowedExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
    
    if (file.mimetype.startsWith('audio/') || 
        allowedTypes.includes(file.mimetype) ||
        allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext)) ||
        file.originalname.toLowerCase().includes('audio')) {
      cb(null, true);
    } else {
      console.log('Rejected file:', file.originalname, 'mimetype:', file.mimetype);
      cb(new Error('Only audio files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ message: "OK" });
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Development endpoint for testing without auth - no file validation
  const demoUpload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
  });
  
  app.post("/api/tracks/demo", demoUpload.single('audio'), async (req: any, res) => {
    try {
      const userId = 'demo-user'; // Fixed demo user ID
      
      // Ensure demo user exists
      try {
        await storage.upsertUser({
          id: userId,
          email: 'demo@soundrights.com',
          firstName: 'Demo',
          lastName: 'User',
          profileImageUrl: null,
        });
      } catch (userError) {
        console.log('Demo user already exists or creation failed:', userError);
      }
      
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "Audio file is required" });
      }

      // Validate track data
      const trackData = insertTrackSchema.parse({
        userId,
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        mood: req.body.mood,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        fileSize: file.size,
        fileFormat: file.mimetype,
        status: 'uploaded'
      });

      // Store file temporarily
      trackData.audioUrl = `/uploads/${file.originalname}`;

      // Analyze audio file for features and similarity detection
      let audioFeatures: {
        duration: number;
        bpm: number;
        key: string;
        energy: number;
        danceability: number;
        valence: number;
        acousticness: number;
        instrumentalness: number;
        fingerprint: string;
      } | null = null;
      let similarTracks: Array<{
        trackId: string;
        title: string;
        artist: string;
        similarity: number;
        matchType: 'exact' | 'partial' | 'similar';
      }> = [];
      
      try {
        console.log('Analyzing audio file:', file.originalname);
        audioFeatures = await audioAnalysis.analyzeAudioFile(file.buffer, file.originalname);
        
        // Get all existing tracks for similarity comparison
        const existingTracks = await storage.getUserTracks(userId);
        similarTracks = await audioAnalysis.findSimilarTracks(audioFeatures, existingTracks);
        
        // Update track data with analysis results
        if (audioFeatures) {
          trackData.duration = audioFeatures.duration;
          trackData.bpm = audioFeatures.bpm;
          trackData.key = audioFeatures.key;
          trackData.status = similarTracks.length > 0 ? 'processing' : 'verified';
        }
      } catch (analysisError) {
        console.warn('Audio analysis failed, proceeding without features:', analysisError);
      }

      const track = await storage.createTrack(trackData);
      
      // Register IP asset with Story Protocol if track is verified and has complete metadata
      if (track.status === 'verified' && track.title && track.artist) {
        try {
          const ipAsset = await storyService.registerIPAsset({
            name: track.title,
            description: `Music track: ${track.title} by ${track.artist}${track.album ? ` from album ${track.album}` : ''}`,
            mediaUrl: track.audioUrl || '',
            attributes: {
              title: track.title,
              artist: track.artist,
              genre: track.genre || 'Unknown',
              duration: track.duration || 0,
              bpm: track.bpm || 0,
              key: track.key || 'Unknown',
              uploadedAt: track.createdAt,
              fingerprint: audioFeatures?.fingerprint || 'unknown'
            },
            userAddress: userId,
          });

          // Store IP asset in database
          await storage.createIpAsset({
            trackId: track.id,
            userId: userId,
            storyProtocolIpId: ipAsset.ipId || '',
            tokenId: ipAsset.tokenId,
            chainId: ipAsset.chainId,
            txHash: ipAsset.txHash,
            metadata: ipAsset.metadata,
            storyProtocolUrl: ipAsset.storyProtocolUrl,
            status: 'confirmed',
          });

          res.status(201).json({
            ...track,
            audioFeatures,
            similarTracks: similarTracks || [],
            ipRegistered: true,
            storyProtocolUrl: ipAsset.storyProtocolUrl
          });
        } catch (ipError) {
          console.error("Failed to register IP asset:", ipError);
          res.status(201).json({
            ...track,
            audioFeatures,
            similarTracks: similarTracks || [],
            ipRegistered: false,
            ipError: ipError instanceof Error ? ipError.message : 'Unknown error'
          });
        }
      } else {
        res.status(201).json({
          ...track,
          audioFeatures,
          similarTracks: similarTracks || [],
          ipRegistered: false,
          reason: similarTracks.length > 0 ? 'Similar tracks detected' : 'Missing metadata'
        });
      }
    } catch (error) {
      console.error("Error creating track:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid track data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create track" });
    }
  });

  // Track management routes
  app.post("/api/tracks", isAuthenticated, upload.single('audio'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "Audio file is required" });
      }

      // Validate track data
      const trackData = insertTrackSchema.parse({
        userId,
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        mood: req.body.mood,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        fileSize: file.size,
        fileFormat: file.mimetype,
        status: 'uploaded'
      });

      // Store file temporarily - would integrate with cloud storage in production
      trackData.audioUrl = `/uploads/${file.originalname}`;

      // Analyze audio file for features and similarity detection
      let audioFeatures: {
        duration: number;
        bpm: number;
        key: string;
        energy: number;
        danceability: number;
        valence: number;
        acousticness: number;
        instrumentalness: number;
        fingerprint: string;
      } | null = null;
      let similarTracks: Array<{
        trackId: string;
        title: string;
        artist: string;
        similarity: number;
        matchType: 'exact' | 'partial' | 'similar';
      }> = [];
      
      try {
        console.log('Analyzing audio file:', file.originalname);
        audioFeatures = await audioAnalysis.analyzeAudioFile(file.buffer, file.originalname);
        
        // Get all existing tracks for similarity comparison
        const existingTracks = await storage.getUserTracks(userId);
        similarTracks = await audioAnalysis.findSimilarTracks(audioFeatures, existingTracks);
        
        // Update track data with analysis results
        if (audioFeatures) {
          trackData.duration = audioFeatures.duration;
          trackData.bpm = audioFeatures.bpm;
          trackData.key = audioFeatures.key;
          trackData.status = similarTracks.length > 0 ? 'processing' : 'verified';
        }
      } catch (analysisError) {
        console.warn('Audio analysis failed, proceeding without features:', analysisError);
      }

      const track = await storage.createTrack(trackData);
      
      // Log activity
      await storage.logUserActivity(userId, 'track_uploaded', 'track', track.id);
      
      // Automatically register IP asset on Story Protocol if track is verified
      if (track.title && track.artist && similarTracks.length === 0) {
        try {
          const ipAsset = await storyService.registerIPAsset({
            name: track.title,
            description: `Music track by ${track.artist}`,
            mediaUrl: track.audioUrl || '',
            attributes: {
              artist: track.artist,
              genre: track.genre || 'Unknown',
              duration: track.duration || 0,
              bpm: track.bpm || 0,
              key: track.key || 'Unknown',
              uploadedAt: track.createdAt,
              fingerprint: audioFeatures?.fingerprint || 'unknown'
            },
            userAddress: userId,
          });

          // Store IP asset in database
          await storage.createIpAsset({
            trackId: track.id,
            userId: userId,
            storyProtocolIpId: ipAsset.ipId || '',
            tokenId: ipAsset.tokenId,
            chainId: ipAsset.chainId,
            txHash: ipAsset.txHash,
            metadata: ipAsset.metadata,
            storyProtocolUrl: ipAsset.storyProtocolUrl,
            status: 'confirmed',
          });

          await storage.logUserActivity(userId, 'ip_registered', 'ip_asset', ipAsset.ipId);

          res.status(201).json({
            ...track,
            audioFeatures,
            similarTracks: similarTracks || [],
            ipRegistered: true,
            storyProtocolUrl: ipAsset.storyProtocolUrl
          });
        } catch (ipError) {
          console.error("Failed to register IP asset:", ipError);
          res.status(201).json({
            ...track,
            audioFeatures,
            similarTracks: similarTracks || [],
            ipRegistered: false,
            ipError: ipError instanceof Error ? ipError.message : 'Unknown error'
          });
        }
      } else {
        res.status(201).json({
          ...track,
          audioFeatures,
          similarTracks: similarTracks || [],
          ipRegistered: false,
          reason: similarTracks.length > 0 ? 'Similar tracks detected' : 'Missing metadata'
        });
      }
    } catch (error) {
      console.error("Error creating track:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid track data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create track" });
    }
  });

  app.get("/api/tracks", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tracks = await storage.getUserTracks(userId);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      res.status(500).json({ message: "Failed to fetch tracks" });
    }
  });

  app.get("/api/tracks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const trackId = req.params.id;
      const track = await storage.getTrack(trackId);
      
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }

      // Check if user owns the track or has access
      const userId = req.user.claims.sub;
      if (track.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(track);
    } catch (error) {
      console.error("Error fetching track:", error);
      res.status(500).json({ message: "Failed to fetch track" });
    }
  });

  app.patch("/api/tracks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const trackId = req.params.id;
      const userId = req.user.claims.sub;
      
      const track = await storage.getTrack(trackId);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      if (track.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updates = req.body;
      const updatedTrack = await storage.updateTrack(trackId, updates);
      
      await storage.logUserActivity(userId, 'track_updated', 'track', trackId);
      
      res.json(updatedTrack);
    } catch (error) {
      console.error("Error updating track:", error);
      res.status(500).json({ message: "Failed to update track" });
    }
  });

  app.delete("/api/tracks/:id", isAuthenticated, async (req: any, res) => {
    try {
      const trackId = req.params.id;
      const userId = req.user.claims.sub;
      
      const track = await storage.getTrack(trackId);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      if (track.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteTrack(trackId);
      await storage.logUserActivity(userId, 'track_deleted', 'track', trackId);
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ message: "Failed to delete track" });
    }
  });

  // License routes
  app.post("/api/licenses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const licenseData = insertLicenseSchema.parse({
        ...req.body,
        licenseeId: userId
      });

      // Verify track exists and user has permission
      const track = await storage.getTrack(licenseData.trackId);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }

      const license = await storage.createLicense(licenseData);
      await storage.logUserActivity(userId, 'license_created', 'license', license.id);
      
      res.status(201).json(license);
    } catch (error) {
      console.error("Error creating license:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid license data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create license" });
    }
  });

  app.get("/api/licenses", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const licenses = await storage.getUserLicenses(userId);
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      res.status(500).json({ message: "Failed to fetch licenses" });
    }
  });

  app.get("/api/tracks/:trackId/licenses", isAuthenticated, async (req: any, res) => {
    try {
      const trackId = req.params.trackId;
      const userId = req.user.claims.sub;
      
      // Verify user has access to track
      const track = await storage.getTrack(trackId);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      
      if (track.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const licenses = await storage.getTrackLicenses(trackId);
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching track licenses:", error);
      res.status(500).json({ message: "Failed to fetch track licenses" });
    }
  });

  // Story Protocol API routes
  app.post("/api/story/register-ip", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, description, mediaUrl, attributes } = req.body;

      if (!name || !description || !mediaUrl) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const ipAsset = await storyService.registerIPAsset({
        name,
        description,
        mediaUrl,
        attributes: attributes || {},
        userAddress: userId,
      });

      await storage.logUserActivity(userId, 'ip_registered', 'ip_asset', ipAsset.ipId);

      res.json(ipAsset);
    } catch (error) {
      console.error("Error registering IP asset:", error);
      res.status(500).json({ 
        message: "Failed to register IP asset",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/story/create-license", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { ipId, licenseTerms, licensee } = req.body;

      if (!ipId || !licenseTerms) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const license = await storyService.createLicense({
        ipId,
        licenseTerms,
        licensee: licensee || userId,
      });

      await storage.logUserActivity(userId, 'license_created', 'license', license.licenseId);

      res.json(license);
    } catch (error) {
      console.error("Error creating license:", error);
      res.status(500).json({ 
        message: "Failed to create license",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/story/get-ip-asset", isAuthenticated, async (req: any, res) => {
    try {
      const { ipId } = req.body;

      if (!ipId) {
        return res.status(400).json({ message: "IP ID is required" });
      }

      const ipAsset = await storyService.getIPAsset(ipId);
      res.json(ipAsset);
    } catch (error) {
      console.error("Error fetching IP asset:", error);
      res.status(500).json({ 
        message: "Failed to fetch IP asset",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/story/licenses/:ipId", isAuthenticated, async (req: any, res) => {
    try {
      const { ipId } = req.params;

      const licenses = await storyService.getLicenses(ipId);
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      res.status(500).json({ 
        message: "Failed to fetch licenses",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Test endpoint for Story Protocol integration (bypass auth for testing)
  app.post("/api/story/test-register", async (req: any, res) => {
    try {
      const { name, description, mediaUrl, attributes } = req.body;

      if (!name || !description) {
        return res.status(400).json({ message: "Name and description are required" });
      }

      const ipAsset = await storyService.registerIPAsset({
        name,
        description,
        mediaUrl: mediaUrl || "https://example.com/test.mp3",
        attributes: attributes || {},
        userAddress: "test_user_" + Date.now(),
      });

      res.json({
        success: true,
        ipAsset,
        message: "IP asset registered successfully"
      });
    } catch (error) {
      console.error("Error in test registration:", error);
      res.status(500).json({ 
        message: "Failed to register IP asset",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Yakoa IP Authentication API routes
  app.post("/api/yakoa/check-originality", async (req: any, res) => {
    try {
      const { mediaUrl, metadata } = req.body;
      
      if (!mediaUrl) {
        return res.status(400).json({ message: "Media URL is required" });
      }

      const result = await yakoaService.checkOriginality(mediaUrl, metadata || {});
      
      // Log the IP check activity if user is authenticated
      if (req.user && req.user.claims) {
        const userId = req.user.claims.sub;
        await storage.logUserActivity(userId, 'ip_check', 'yakoa_token', result.yakoaTokenId);
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error checking originality with Yakoa:", error);
      res.status(500).json({ 
        message: "Failed to check originality",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/yakoa/token/:tokenId", isAuthenticated, async (req: any, res) => {
    try {
      const { tokenId } = req.params;
      const token = await yakoaService.getToken(tokenId);
      res.json(token);
    } catch (error) {
      console.error("Error fetching Yakoa token:", error);
      res.status(500).json({ 
        message: "Failed to fetch token status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Tomo Social Login API routes
  app.get("/api/tomo/status", async (req: any, res) => {
    try {
      const status = await tomoService.testConnection();
      res.json(status);
    } catch (error) {
      console.error("Error testing Tomo connection:", error);
      res.status(500).json({ 
        message: "Failed to test Tomo connection",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/tomo/auth/:provider", async (req: any, res) => {
    try {
      const { provider } = req.params;
      const authUrl = tomoService.generateAuthUrl(provider as any);
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating Tomo auth URL:", error);
      res.status(500).json({ 
        message: "Failed to generate authentication URL",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/tomo/callback", async (req: any, res) => {
    try {
      const { provider, code } = req.body;
      
      if (!provider || !code) {
        return res.status(400).json({ message: "Provider and code are required" });
      }

      const authResult = await tomoService.authenticateUser(provider, code);
      res.json(authResult);
    } catch (error) {
      console.error("Error processing Tomo callback:", error);
      res.status(500).json({ 
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/tomo/profile/:userId", isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const profile = await tomoService.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching Tomo profile:", error);
      res.status(500).json({ 
        message: "Failed to fetch user profile",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/tomo/wallets/:userId", isAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const wallets = await tomoService.getUserWallets(userId);
      res.json(wallets);
    } catch (error) {
      console.error("Error fetching Tomo wallets:", error);
      res.status(500).json({ 
        message: "Failed to fetch user wallets",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Zapper Analytics API routes
  app.get("/api/zapper/portfolio/:address", isAuthenticated, async (req: any, res) => {
    try {
      const { address } = req.params;
      const portfolio = await zapperService.getUserPortfolio(address);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching Zapper portfolio:", error);
      res.status(500).json({ 
        message: "Failed to fetch portfolio",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/zapper/transactions/:address", isAuthenticated, async (req: any, res) => {
    try {
      const { address } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await zapperService.getTransactionHistory(address, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching Zapper transactions:", error);
      res.status(500).json({ 
        message: "Failed to fetch transactions",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/zapper/ip-analytics/:address", isAuthenticated, async (req: any, res) => {
    try {
      const { address } = req.params;
      const analytics = await zapperService.getIPAssetAnalytics(address);
      
      // Log analytics access
      const userId = req.user.claims.sub;
      await storage.logUserActivity(userId, 'analytics_viewed', 'zapper_analytics', address);
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching IP asset analytics:", error);
      res.status(500).json({ 
        message: "Failed to fetch IP analytics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/zapper/track-registration", isAuthenticated, async (req: any, res) => {
    try {
      const { txHash, userAddress } = req.body;
      
      if (!txHash || !userAddress) {
        return res.status(400).json({ message: "Transaction hash and user address are required" });
      }

      const tracking = await zapperService.trackIPAssetRegistration(txHash, userAddress);
      res.json(tracking);
    } catch (error) {
      console.error("Error tracking IP registration:", error);
      res.status(500).json({ 
        message: "Failed to track registration",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Health check for sponsor integrations
  app.get("/api/sponsors/status", async (req: any, res) => {
    const status = {
      yakoa: !yakoaService['demoMode'] ? 'connected' : 'demo_mode',
      tomo: !tomoService['demoMode'] ? 'connected' : 'demo_mode', 
      zapper: !zapperService['demoMode'] ? 'connected' : 'demo_mode',
      walletconnect: process.env.WALLETCONNECT_PROJECT_ID ? 'configured' : 'demo_mode',
      story_protocol: 'connected'
    };
    
    res.json({ 
      sponsor_integrations: status,
      demo_mode: Object.values(status).some(s => s.includes('demo')),
      timestamp: new Date().toISOString()
    });
  });

  // WalletConnect API routes
  app.get("/api/walletconnect/status", async (req, res) => {
    try {
      const status = await walletConnectService.getConnectionStatus();
      res.json(status);
    } catch (error) {
      console.error("Error getting WalletConnect status:", error);
      res.status(500).json({ message: "Failed to get wallet status" });
    }
  });

  app.post("/api/walletconnect/connect", async (req, res) => {
    try {
      const result = await walletConnectService.connectWallet();
      res.json(result);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to connect wallet" 
      });
    }
  });

  app.post("/api/walletconnect/disconnect", async (req, res) => {
    try {
      await walletConnectService.disconnectWallet();
      res.json({ success: true });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      res.status(500).json({ message: "Failed to disconnect wallet" });
    }
  });

  app.post("/api/walletconnect/send-transaction", async (req, res) => {
    try {
      const { to, value, data } = req.body;
      
      if (!to || !value) {
        return res.status(400).json({ message: "Missing required transaction parameters" });
      }

      const result = await walletConnectService.sendTransaction({ to, value, data });
      res.json(result);
    } catch (error) {
      console.error("Error sending transaction:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to send transaction" 
      });
    }
  });

  app.get("/api/walletconnect/features", async (req, res) => {
    try {
      const features = walletConnectService.getSupportedFeatures();
      res.json(features);
    } catch (error) {
      console.error("Error getting supported features:", error);
      res.status(500).json({ message: "Failed to get supported features" });
    }
  });



  // User Profile and Activity API endpoints
  app.get('/api/tracks/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tracks = await storage.getUserTracks(userId);
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching user tracks:", error);
      res.status(500).json({ message: "Failed to fetch user tracks" });
    }
  });

  app.get('/api/licenses/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const licenses = await storage.getUserLicenses(userId);
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching user licenses:", error);
      res.status(500).json({ message: "Failed to fetch user licenses" });
    }
  });

  app.get('/api/user/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Get recent activities for the user
      const activities = await db.select()
        .from(userActivities)
        .where(eq(userActivities.userId, userId))
        .orderBy(desc(userActivities.createdAt))
        .limit(100);
      
      res.json(activities);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      res.status(500).json({ message: "Failed to fetch user activities" });
    }
  });

  app.get('/api/user/ip-assets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ipAssets = await storage.getUserIpAssets(userId);
      res.json(ipAssets);
    } catch (error) {
      console.error("Error fetching user IP assets:", error);
      res.status(500).json({ message: "Failed to fetch user IP assets" });
    }
  });

  app.post('/api/user/export-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Collect all user data
      const [user, tracks, licenses, activities, ipAssets] = await Promise.all([
        storage.getUser(userId),
        storage.getUserTracks(userId),
        storage.getUserLicenses(userId),
        db.select().from(userActivities).where(eq(userActivities.userId, userId)),
        storage.getUserIpAssets(userId)
      ]);

      const exportData = {
        user,
        tracks,
        licenses,
        activities,
        ipAssets,
        exportedAt: new Date().toISOString(),
        platform: 'SoundRights',
        version: '1.0.0'
      };

      // Log the export activity
      await storage.logUserActivity(userId, 'data_exported', 'user_data', userId);

      res.json(exportData);
    } catch (error) {
      console.error("Error exporting user data:", error);
      res.status(500).json({ message: "Failed to export user data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
