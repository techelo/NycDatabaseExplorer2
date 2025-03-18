import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// AI Analysis model
export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  result: jsonb("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertAiAnalysisSchema = createInsertSchema(aiAnalyses).pick({
  query: true,
  result: true,
  userId: true,
});

export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;
export type AiAnalysis = typeof aiAnalyses.$inferSelect;

// Dataset model
export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  nycdbId: text("nycdb_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sourceUrl: text("source_url"),
  lastUpdated: text("last_updated"),
  recordCount: text("record_count"),
  icon: text("icon").default("database"),
  iconBg: text("icon_bg").default("primary"),
  tags: text("tags").array(),
});

export const insertDatasetSchema = createInsertSchema(datasets).pick({
  nycdbId: true,
  name: true,
  description: true,
  sourceUrl: true,
  lastUpdated: true,
  recordCount: true,
  icon: true,
  iconBg: true,
  tags: true,
});

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;

// Building model for AI analysis results
export const buildings = pgTable("buildings", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  borough: text("borough"),
  neighborhood: text("neighborhood"),
  zipCode: text("zip_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  buildingId: text("building_id"),
  bbl: text("bbl"),
  bin: text("bin"),
  riskScore: integer("risk_score"),
  lastInspection: text("last_inspection"),
  openViolations: integer("open_violations"),
  metadata: jsonb("metadata"),
});

export const insertBuildingSchema = createInsertSchema(buildings).pick({
  address: true,
  borough: true,
  neighborhood: true,
  zipCode: true,
  latitude: true,
  longitude: true,
  buildingId: true,
  bbl: true,
  bin: true,
  riskScore: true,
  lastInspection: true,
  openViolations: true,
  metadata: true,
});

export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type Building = typeof buildings.$inferSelect;

// Model for analysis query validation
export const aiQuerySchema = z.object({
  query: z.string().min(5).max(500),
});

export type AiQuery = z.infer<typeof aiQuerySchema>;

// Model for analysis result
export const analysisResultSchema = z.object({
  query: z.string(),
  findings: z.object({
    summary: z.string(),
    keyPoints: z.array(z.string()),
  }),
  buildings: z.array(z.object({
    address: z.string(),
    neighborhood: z.string(),
    riskScore: z.number(),
    riskLevel: z.string(),
    openViolations: z.number(),
    lastInspection: z.string(),
  })).optional(),
  violationTypes: z.array(z.object({
    name: z.string(),
    percentage: z.number(),
  })).optional(),
  followUpQuestions: z.array(z.string()).optional(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
