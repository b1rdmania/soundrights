import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storyService } from "./storyProtocol";
import { audioAnalysis } from "./audioAnalysis";
import multer from "multer";
import { z } from "zod";
import { insertTrackSchema, insertLicenseSchema } from "@shared/schema";

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
      const userId = 'demo-user-' + Date.now(); // Generate demo user ID
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

  const httpServer = createServer(app);
  return httpServer;
}
