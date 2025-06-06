import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  uuid,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// License types enum
export const licenseTypeEnum = pgEnum('license_type', [
  'commercial',
  'non-commercial',
  'attribution',
  'sync',
  'master',
  'mechanical'
]);

// Track status enum
export const trackStatusEnum = pgEnum('track_status', [
  'uploaded',
  'processing',
  'verified',
  'registered',
  'licensed',
  'failed'
]);

// Audio tracks
export const tracks = pgTable("tracks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  artist: varchar("artist").notNull(),
  album: varchar("album"),
  genre: varchar("genre"),
  duration: integer("duration"), // in seconds
  bpm: integer("bpm"),
  key: varchar("key"),
  mood: varchar("mood"),
  tags: text("tags").array(),
  audioUrl: varchar("audio_url"),
  imageUrl: varchar("image_url"),
  downloadUrl: varchar("download_url"),
  fileSize: integer("file_size"),
  fileFormat: varchar("file_format"),
  
  // Metadata and AI analysis
  aiDescription: text("ai_description"),
  aiKeywords: text("ai_keywords").array(),
  
  // Audio fingerprinting and recognition
  acoustIdId: varchar("acoust_id"),
  musicbrainzId: varchar("musicbrainz_id"),
  auddData: jsonb("audd_data"),
  yakoaTokenId: varchar("yakoa_token_id"),
  yakoaStatus: varchar("yakoa_status"),
  
  // Story Protocol integration
  storyProtocolAssetId: varchar("story_protocol_asset_id"),
  storyProtocolLicenseId: varchar("story_protocol_license_id"),
  
  status: trackStatusEnum("status").default('uploaded'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Licenses
export const licenses = pgTable("licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  trackId: uuid("track_id").notNull().references(() => tracks.id),
  licenseeId: varchar("licensee_id").notNull().references(() => users.id),
  licensorId: varchar("licensor_id").notNull().references(() => users.id),
  licenseType: licenseTypeEnum("license_type").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency").default('USD'),
  terms: jsonb("terms"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  storyProtocolLicenseId: varchar("story_protocol_license_id"),
  transactionHash: varchar("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Keys for external services
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  service: varchar("service").notNull(),
  keyName: varchar("key_name"),
  keyValue: text("key_value").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// User activity logs
export const userActivities = pgTable("user_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(),
  resourceType: varchar("resource_type"),
  resourceId: varchar("resource_id"),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// IP Assets table for Story Protocol integration
export const ipAssets = pgTable("ip_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  trackId: uuid("track_id").notNull().references(() => tracks.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  storyProtocolIpId: varchar("story_protocol_ip_id").notNull().unique(),
  tokenId: varchar("token_id").notNull(),
  chainId: integer("chain_id").notNull(),
  txHash: varchar("tx_hash"),
  metadata: jsonb("metadata"),
  storyProtocolUrl: varchar("story_protocol_url"),
  status: varchar("status").notNull().default("pending"), // pending, confirmed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tracks: many(tracks),
  licensesAsLicensee: many(licenses, { relationName: "licensee" }),
  licensesAsLicensor: many(licenses, { relationName: "licensor" }),
  apiKeys: many(apiKeys),
  activities: many(userActivities),
}));

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  user: one(users, {
    fields: [tracks.userId],
    references: [users.id],
  }),
  licenses: many(licenses),
  ipAssets: many(ipAssets),
}));

export const licensesRelations = relations(licenses, ({ one }) => ({
  track: one(tracks, {
    fields: [licenses.trackId],
    references: [tracks.id],
  }),
  licensee: one(users, {
    fields: [licenses.licenseeId],
    references: [users.id],
    relationName: "licensee",
  }),
  licensor: one(users, {
    fields: [licenses.licensorId],
    references: [users.id],
    relationName: "licensor",
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
}));

export const ipAssetsRelations = relations(ipAssets, ({ one }) => ({
  track: one(tracks, {
    fields: [ipAssets.trackId],
    references: [tracks.id],
  }),
  user: one(users, {
    fields: [ipAssets.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertLicenseSchema = createInsertSchema(licenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIpAssetSchema = createInsertSchema(ipAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;
export type InsertLicense = z.infer<typeof insertLicenseSchema>;
export type License = typeof licenses.$inferSelect;
export type InsertIpAsset = z.infer<typeof insertIpAssetSchema>;
export type IpAsset = typeof ipAssets.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
