import { HfInference } from "@huggingface/inference";
import { getNycdbDatasets, getNycdbData } from "./nycdb";
import { AnalysisResult } from "@shared/schema";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Initialize Hugging Face client
const hf = new HfInference(HUGGINGFACE_API_KEY);

// Model IDs for different tasks
const MODELS = {
  // Using Microsoft's phi-2 model for analysis (good performance, free to use)
  ANALYSIS: "microsoft/phi-2",
  // Using Mistral-7B for text generation (good quality, free to use)
  GENERATION: "mistralai/Mistral-7B-Instruct-v0.1"
};

/**
 * Analyzes a user query about NYC housing data using Hugging Face models
 */
export async function analyzeQuery(query: string): Promise<AnalysisResult> {
  try {
    if (!HUGGINGFACE_API_KEY) {
      throw new Error("Hugging Face API key is missing");
    }

    // Get relevant dataset information
    const datasets = await identifyRelevantDatasets(query);
    
    // Generate analysis using the phi-2 model
    const analysisPrompt = createAnalysisPrompt(query, datasets);
    const analysis = await hf.textGeneration({
      model: MODELS.ANALYSIS,
      inputs: analysisPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false
      }
    });

    // Parse the response into the expected format
    const parsedResponse = JSON.parse(analysis.generated_text);
    return parsedResponse as AnalysisResult;
  } catch (error) {
    console.error("Error in AI analysis:", error);
    throw error;
  }
}

/**
 * Generates automated insights about NYC housing data
 */
export async function generateAutomatedInsights(): Promise<Array<{
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'anomaly' | 'pattern' | 'trend' | 'risk';
  datasetId: string;
  timestamp: string;
  relatedBuildings?: Array<{
    address: string;
    borough: string;
    flaggedIssue: string;
  }>;
}>> {
  try {
    if (!HUGGINGFACE_API_KEY) {
      throw new Error("Hugging Face API key is missing");
    }
    
    // Get available datasets
    const datasets = await getNycdbDatasets();
    
    // Sample data from each dataset
    let datasetSamples = "";
    for (const dataset of datasets.slice(0, 3)) {
      const data = await getNycdbData(dataset.name, 30);
      datasetSamples += `Dataset: ${dataset.name}\nDescription: ${dataset.description}\nData:\n${JSON.stringify(data, null, 2)}\n\n`;
    }
    
    // Create prompt for insights generation
    const prompt = `Analyze the following NYC housing datasets and identify key insights:

${datasetSamples}

Generate insights in this exact JSON format:
{
  "insights": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "severity": "low" | "medium" | "high" | "critical",
      "category": "anomaly" | "pattern" | "trend" | "risk",
      "datasetId": "string",
      "timestamp": "string",
      "relatedBuildings": [
        {
          "address": "string",
          "borough": "string",
          "flaggedIssue": "string"
        }
      ]
    }
  ]
}

Make insights specific, actionable, and evidence-based. Focus on safety issues and violations.`;

    const response = await hf.textGeneration({
      model: MODELS.GENERATION,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false
      }
    });

    // Parse the response
    const content = response.generated_text;
    if (!content) {
      throw new Error("Hugging Face returned an empty response");
    }

    const parsedResponse = JSON.parse(content);
    return Array.isArray(parsedResponse) ? parsedResponse : parsedResponse.insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
}

/**
 * Identifies relevant datasets based on the user's query
 */
async function identifyRelevantDatasets(query: string): Promise<Array<{
  name: string;
  description: string;
  data: any[];
}>> {
  const datasets = await getNycdbDatasets();
  const relevantDatasets = [];

  for (const dataset of datasets) {
    // Get a sample of data from each dataset
    const data = await getNycdbData(dataset.name, 10);
    relevantDatasets.push({
      name: dataset.name,
      description: dataset.description,
      data
    });
  }

  return relevantDatasets;
}

/**
 * Creates a detailed prompt for analysis
 */
function createAnalysisPrompt(query: string, datasets: Array<{ name: string; description: string; data: any[] }>): string {
  return `Analyze the following NYC housing data based on this query: "${query}"

Available datasets:
${datasets.map(d => `
Dataset: ${d.name}
Description: ${d.description}
Sample data: ${JSON.stringify(d.data, null, 2)}
`).join('\n')}

Provide analysis in this exact JSON format:
{
  "query": "string",
  "findings": {
    "summary": "string",
    "keyPoints": ["string"]
  },
  "buildings": [
    {
      "address": "string",
      "neighborhood": "string",
      "riskScore": number,
      "riskLevel": "string",
      "openViolations": number,
      "lastInspection": "string"
    }
  ],
  "violationTypes": [
    {
      "name": "string",
      "percentage": number
    }
  ],
  "followUpQuestions": ["string"]
}

Ensure all responses are specific, data-driven, and actionable.`;
}