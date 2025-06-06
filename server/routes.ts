import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
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
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
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

      const track = await storage.createTrack(trackData);
      
      // Log activity
      await storage.logUserActivity(userId, 'track_uploaded', 'track', track.id);

      res.status(201).json(track);
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

  const httpServer = createServer(app);
  return httpServer;
}
