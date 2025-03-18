import { 
  users, type User, type InsertUser,
  datasets, type Dataset, type InsertDataset,
  aiAnalyses, type AiAnalysis, type InsertAiAnalysis
} from "@shared/schema";
import { DATASETS } from "@/lib/constants";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Dataset methods
  getAllDatasets(): Promise<Dataset[]>;
  getDatasetById(id: string): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  
  // AI Analysis methods
  createAiAnalysis(analysis: InsertAiAnalysis): Promise<AiAnalysis>;
  getAiAnalysisById(id: number): Promise<AiAnalysis | undefined>;
  getRecentAiAnalyses(limit?: number): Promise<AiAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private datasets: Map<string, Dataset>;
  private aiAnalyses: Map<number, AiAnalysis>;
  private userIdCounter: number;
  private aiAnalysisIdCounter: number;
  private datasetIdCounter: number;

  constructor() {
    this.users = new Map();
    this.datasets = new Map();
    this.aiAnalyses = new Map();
    this.userIdCounter = 1;
    this.aiAnalysisIdCounter = 1;
    this.datasetIdCounter = 1;
    
    // Initialize with predefined datasets
    this.initializeDatasets();
  }

  private initializeDatasets() {
    // Map the predefined datasets from constants to Dataset type
    DATASETS.forEach((dataset, index) => {
      const newDataset: Dataset = {
        id: this.datasetIdCounter++,
        nycdbId: dataset.id,
        name: dataset.name,
        description: dataset.description,
        sourceUrl: dataset.sourceUrl,
        lastUpdated: dataset.lastUpdated,
        recordCount: dataset.recordCount,
        icon: dataset.icon,
        iconBg: dataset.iconBg,
        tags: dataset.tags,
      };
      
      this.datasets.set(dataset.id, newDataset);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Dataset methods
  async getAllDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values());
  }

  async getDatasetById(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = this.datasetIdCounter++;
    const dataset: Dataset = {
      id,
      nycdbId: insertDataset.nycdbId,
      name: insertDataset.name,
      description: insertDataset.description,
      sourceUrl: insertDataset.sourceUrl || null,
      lastUpdated: insertDataset.lastUpdated || null,
      recordCount: insertDataset.recordCount || null,
      icon: insertDataset.icon || null,
      iconBg: insertDataset.iconBg || null,
      tags: insertDataset.tags || null
    };
    this.datasets.set(insertDataset.nycdbId, dataset);
    return dataset;
  }

  // AI Analysis methods
  async createAiAnalysis(insertAnalysis: InsertAiAnalysis): Promise<AiAnalysis> {
    const id = this.aiAnalysisIdCounter++;
    const createdAt = new Date();
    const analysis: AiAnalysis = {
      id,
      query: insertAnalysis.query,
      result: insertAnalysis.result,
      createdAt,
      userId: insertAnalysis.userId || null
    };
    
    this.aiAnalyses.set(id, analysis);
    return analysis;
  }

  async getAiAnalysisById(id: number): Promise<AiAnalysis | undefined> {
    return this.aiAnalyses.get(id);
  }

  async getRecentAiAnalyses(limit: number = 5): Promise<AiAnalysis[]> {
    // Sort analyses by creation date in descending order
    const sortedAnalyses = Array.from(this.aiAnalyses.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    
    return sortedAnalyses;
  }
}

export const storage = new MemStorage();
