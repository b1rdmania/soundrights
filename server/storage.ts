import {
  users,
  tracks,
  licenses,
  userActivities,
  type User,
  type UpsertUser,
  type Track,
  type InsertTrack,
  type License,
  type InsertLicense,
  type UserActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Track operations
  createTrack(track: InsertTrack): Promise<Track>;
  getTrack(id: string): Promise<Track | undefined>;
  getUserTracks(userId: string): Promise<Track[]>;
  updateTrack(id: string, updates: Partial<Track>): Promise<Track>;
  deleteTrack(id: string): Promise<void>;
  
  // License operations
  createLicense(license: InsertLicense): Promise<License>;
  getLicense(id: string): Promise<License | undefined>;
  getTrackLicenses(trackId: string): Promise<License[]>;
  getUserLicenses(userId: string): Promise<License[]>;
  
  // Activity logging
  logUserActivity(userId: string, action: string, resourceType?: string, resourceId?: string, metadata?: any): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Track operations
  async createTrack(trackData: InsertTrack): Promise<Track> {
    const [track] = await db
      .insert(tracks)
      .values(trackData)
      .returning();
    return track;
  }

  async getTrack(id: string): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track;
  }

  async getUserTracks(userId: string): Promise<Track[]> {
    return await db
      .select()
      .from(tracks)
      .where(eq(tracks.userId, userId))
      .orderBy(desc(tracks.createdAt));
  }

  async updateTrack(id: string, updates: Partial<Track>): Promise<Track> {
    const [track] = await db
      .update(tracks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tracks.id, id))
      .returning();
    return track;
  }

  async deleteTrack(id: string): Promise<void> {
    await db.delete(tracks).where(eq(tracks.id, id));
  }

  // License operations
  async createLicense(licenseData: InsertLicense): Promise<License> {
    const [license] = await db
      .insert(licenses)
      .values(licenseData)
      .returning();
    return license;
  }

  async getLicense(id: string): Promise<License | undefined> {
    const [license] = await db.select().from(licenses).where(eq(licenses.id, id));
    return license;
  }

  async getTrackLicenses(trackId: string): Promise<License[]> {
    return await db
      .select()
      .from(licenses)
      .where(eq(licenses.trackId, trackId))
      .orderBy(desc(licenses.createdAt));
  }

  async getUserLicenses(userId: string): Promise<License[]> {
    return await db
      .select()
      .from(licenses)
      .where(and(
        eq(licenses.licenseeId, userId)
      ))
      .orderBy(desc(licenses.createdAt));
  }

  // Activity logging
  async logUserActivity(
    userId: string, 
    action: string, 
    resourceType?: string, 
    resourceId?: string, 
    metadata?: any
  ): Promise<void> {
    await db.insert(userActivities).values({
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
    });
  }
}

export const storage = new DatabaseStorage();
