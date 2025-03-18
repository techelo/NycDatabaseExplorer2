import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { aiQuerySchema, analysisResultSchema } from "@shared/schema";
import { analyzeQuery, generateAutomatedInsights } from "./huggingface";
import { getNycdbData, getNycdbDatasets } from "./nycdb";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix all routes with /api
  
  // Get all datasets
  app.get("/api/datasets", async (req, res) => {
    try {
      const datasets = await storage.getAllDatasets();
      res.json({ datasets });
    } catch (error) {
      console.error("Error fetching datasets:", error);
      res.status(500).json({ message: "Failed to fetch datasets" });
    }
  });

  // Get a specific dataset by ID
  app.get("/api/datasets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dataset = await storage.getDatasetById(id);
      
      if (!dataset) {
        return res.status(404).json({ message: `Dataset with ID ${id} not found` });
      }
      
      // Get dataset fields (schema)
      const fields = await getNycdbDatasets(id);
      
      res.json({ dataset, fields });
    } catch (error) {
      console.error(`Error fetching dataset ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch dataset details" });
    }
  });

  // Get a sample of data from a dataset
  app.get("/api/datasets/:id/sample", async (req, res) => {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const dataset = await storage.getDatasetById(id);
      if (!dataset) {
        return res.status(404).json({ message: `Dataset with ID ${id} not found` });
      }
      
      const data = await getNycdbData(id, limit);
      
      res.json({ data });
    } catch (error) {
      console.error(`Error fetching sample data for dataset ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch sample data" });
    }
  });

  // AI analysis endpoint
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      // Validate request body
      const { query } = aiQuerySchema.parse(req.body);
      
      // Process query with OpenAI
      const analysisResult = await analyzeQuery(query);
      
      // Validate the analysis result
      const validatedResult = analysisResultSchema.parse(analysisResult);
      
      // Store the analysis result
      const savedAnalysis = await storage.createAiAnalysis({
        query,
        result: validatedResult,
        userId: null // Set to user ID if authenticated
      });
      
      res.json(validatedResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      console.error("Error processing AI analysis:", error);
      res.status(500).json({ message: "Failed to process analysis" });
    }
  });

  // Get recent AI analyses
  app.get("/api/ai/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const analyses = await storage.getRecentAiAnalyses(limit);
      res.json({ analyses });
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      res.status(500).json({ message: "Failed to fetch recent analyses" });
    }
  });

  // Get automated AI insights
  app.get("/api/ai/insights", async (req, res) => {
    try {
      const insights = await generateAutomatedInsights();
      res.json({ insights });
    } catch (error) {
      console.error("Error generating automated insights:", error);
      res.status(500).json({ message: "Failed to generate automated insights" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
