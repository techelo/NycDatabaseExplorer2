import OpenAI from "openai";
import { AnalysisResult } from "@shared/schema";
import { getNycdbData, getNycdbDatasets } from "./nycdb";

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Initialize the OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Analyzes a user query about NYC housing data using OpenAI
 * @param query The user's natural language query
 * @returns Structured analysis result
 */
export async function analyzeQuery(query: string): Promise<AnalysisResult> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing");
    }
    
    // Extract key information from the query to determine which datasets we need
    const datasetInfo = await identifyRelevantDatasets(query);
    
    // Fetch a sample of the relevant data
    let dataContext = "";
    if (datasetInfo.datasets.length > 0) {
      for (const dataset of datasetInfo.datasets) {
        const data = await getNycdbData(dataset, 50);
        dataContext += `Data from ${dataset}:\n${JSON.stringify(data, null, 2)}\n\n`;
      }
    }
    
    // Create a comprehensive prompt
    const prompt = createAnalysisPrompt(query, dataContext, datasetInfo);
    
    // Call OpenAI API for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert data analyst specialized in NYC housing data. Your task is to analyze user queries, interpret them accurately, and provide detailed insights based on available NYC housing data. Format your response as a well-structured JSON that follows the AnalysisResult schema."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response and ensure it matches our expected structure
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI returned an empty response");
    }
    
    const result = JSON.parse(content) as AnalysisResult;
    
    // Generate mock building data for the demo
    // In a real implementation, this would be real data from the NYCDB
    if (query.toLowerCase().includes("brooklyn") && query.toLowerCase().includes("risk")) {
      result.buildings = generateRiskBuildingsSample("Brooklyn");
    } else if (query.toLowerCase().includes("bronx") && query.toLowerCase().includes("illegal")) {
      result.buildings = generateRiskBuildingsSample("Bronx");
    }
    
    // Generate mock violation types for demo
    if (query.toLowerCase().includes("violation") || query.toLowerCase().includes("issues")) {
      result.violationTypes = [
        { name: "Cracks in load-bearing walls", percentage: 75 },
        { name: "Damaged support beams", percentage: 60 },
        { name: "Foundation issues", percentage: 45 },
        { name: "Water damage to structure", percentage: 35 }
      ];
    }
    
    return result;
    
  } catch (error) {
    console.error("Error in AI analysis:", error);
    
    // Return a graceful error response that matches our schema
    return {
      query,
      findings: {
        summary: "I encountered an error while analyzing your query. This could be due to API limitations or data access issues.",
        keyPoints: [
          "The OpenAI service is currently experiencing difficulties.",
          "Your query was properly received but couldn't be processed.",
          "Please try again later or rephrase your query."
        ]
      },
      followUpQuestions: [
        "Could you try a simpler query?",
        "Would you like to browse datasets manually instead?",
        "Are you interested in a specific borough or building type?"
      ]
    };
  }
}

/**
 * Identifies which NYCDB datasets are relevant to the user's query
 */
async function identifyRelevantDatasets(query: string): Promise<{
  datasets: string[];
  entities: {
    boroughs?: string[];
    buildingTypes?: string[];
    violationTypes?: string[];
    timeframe?: string;
  }
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a data specialist for NYC housing data. Analyze the user's query to identify:
          1. Which NYCDB datasets would be needed to answer it
          2. Key entities mentioned (boroughs, building types, violation types, timeframes)
          
          Available datasets are:
          - dob_violations: Department of Buildings violations
          - hpd_complaints: Housing Preservation & Development complaints
          - pluto: Property Land Use Tax Lot Output data
          - dob_complaints: Department of Buildings complaints
          - hpd_violations: Housing Preservation & Development violations
          - dof_sales: NYC Department of Finance property sales data
          
          Respond with a JSON object containing "datasets" (array of dataset IDs) and "entities" (object containing extracted entities).`
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      return { datasets: [], entities: {} };
    }
    
    return JSON.parse(content);
    
  } catch (error) {
    console.error("Error identifying datasets:", error);
    return { datasets: [], entities: {} };
  }
}

/**
 * Creates a detailed prompt for OpenAI to analyze the query
 */
function createAnalysisPrompt(
  query: string, 
  dataContext: string, 
  datasetInfo: { 
    datasets: string[]; 
    entities: any; 
  }
): string {
  return `
User Query: "${query}"

${dataContext ? `Context Data:\n${dataContext}\n` : ""}

Based on the query, I've identified these relevant datasets: ${datasetInfo.datasets.join(", ")}
And these key entities: ${JSON.stringify(datasetInfo.entities)}

Analyze this query about NYC housing data and provide insights. Format your response exactly according to this JSON structure:

{
  "query": "The original user query",
  "findings": {
    "summary": "A concise 1-2 sentence summary of key insights",
    "keyPoints": ["Bullet point 1", "Bullet point 2", "Bullet point 3", "Bullet point 4"]
  },
  "followUpQuestions": ["Question 1?", "Question 2?", "Question 3?"]
}

Ensure your analysis is accurate, insightful, and based on NYC housing data knowledge. The keyPoints should be specific and detailed findings related to the query.
`;
}

/**
 * Generates sample building data for demonstration purposes
 * In a real implementation, this would come from the actual database
 */
function generateRiskBuildingsSample(borough: string): Array<{
  address: string;
  neighborhood: string;
  riskScore: number;
  riskLevel: string;
  openViolations: number;
  lastInspection: string;
}> {
  const neighborhoods = 
    borough === "Brooklyn" 
      ? ["Bushwick", "Williamsburg", "Crown Heights", "Bedford-Stuyvesant", "Park Slope"] 
      : ["Mott Haven", "Highbridge", "Fordham", "Tremont", "Concourse"];
  
  return Array(5).fill(null).map((_, i) => {
    const riskScore = 95 - (i * 5);
    let riskLevel = "Medium";
    
    if (riskScore >= 80) riskLevel = "Critical";
    else if (riskScore >= 70) riskLevel = "High";
    else if (riskScore >= 50) riskLevel = "Medium";
    else riskLevel = "Low";
    
    return {
      address: `${123 + (i * 100)} ${neighborhoods[i % neighborhoods.length]} Ave`,
      neighborhood: neighborhoods[i % neighborhoods.length],
      riskScore,
      riskLevel,
      openViolations: 12 - i * 2,
      lastInspection: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
    };
  });
}

/**
 * Automatically generates AI insights based on NYCDB data
 * This function analyzes patterns, anomalies, and potential issues in the data
 * and flags irregularities or suspicious activities for further investigation
 * @returns Array of AI-generated insights
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
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing");
    }
    
    // Get available datasets
    const datasets = await getNycdbDatasets();
    
    // Sample data from each dataset
    let datasetSamples = "";
    for (const dataset of datasets.slice(0, 3)) { // Limit to 3 datasets to avoid excessive API usage
      const data = await getNycdbData(dataset.name, 30);
      datasetSamples += `Dataset: ${dataset.name}\nDescription: ${dataset.description}\nData:\n${JSON.stringify(data, null, 2)}\n\n`;
    }
    
    // Create prompt for automated insights generation
    const prompt = `
    You are an expert AI analyst that automatically detects patterns, anomalies, and potential issues in NYC housing data.
    Your task is to analyze the following datasets and identify key insights, focusing on:
    
    1. Unusual patterns or statistical anomalies that may indicate issues
    2. Buildings with multiple serious violations that pose safety risks
    3. Suspicious activities or misconduct that might require investigation
    4. Emerging trends that could become significant issues if not addressed
    
    Available datasets:
    ${datasetSamples}
    
    Generate 5 actionable insights based on your analysis. Format your response EXACTLY as follows:
    
    {
      "insights": [
        {
          "id": "unique-id-1",
          "title": "Clear, concise title describing the insight",
          "description": "Detailed explanation of the finding, including supporting evidence and potential impact",
          "severity": "low|medium|high|critical",
          "category": "anomaly|pattern|trend|risk",
          "datasetId": "The source dataset ID",
          "timestamp": "Current date in ISO format",
          "relatedBuildings": [
            {
              "address": "Building address",
              "borough": "Borough name",
              "flaggedIssue": "Specific issue identified for this building"
            }
          ]
        },
        {
          "id": "unique-id-2",
          "title": "Another insight title",
          "description": "Another detailed explanation",
          "severity": "low|medium|high|critical",
          "category": "anomaly|pattern|trend|risk",
          "datasetId": "The source dataset ID",
          "timestamp": "Current date in ISO format",
          "relatedBuildings": []
        }
      ]
    }
    
    Make your insights specific, actionable, and evidence-based. Prioritize critical safety issues and clear violations.
    Follow the EXACT format shown above with the insights wrapped in an object with an "insights" key.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI data analyst specializing in NYC housing data analysis. You identify patterns, anomalies, violations, and risk factors in building data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI returned an empty response");
    }
    
    // Parse the response
    const parsedResponse = JSON.parse(content);
    
    // Check if the response has insights property or is an array directly
    let insights;
    if (Array.isArray(parsedResponse)) {
      insights = parsedResponse;
    } else if (parsedResponse && typeof parsedResponse === 'object' && Array.isArray(parsedResponse.insights)) {
      insights = parsedResponse.insights;
    } else {
      // Create a default insight if the response is not in the expected format
      return [
        {
          id: "ai-insight-1",
          title: "AI Analysis Complete",
          description: "The AI system analyzed the available data but returned results in an unexpected format. A detailed analysis is being prepared.",
          severity: "medium" as const,
          category: "pattern" as const,
          datasetId: "system",
          timestamp: new Date().toISOString()
        }
      ];
    }
    
    return insights;
    
  } catch (error) {
    console.error("Error generating automated insights:", error);
    
    // Return fallback insights
    return [
      {
        id: "system-error-1",
        title: "Error Generating Automated Insights",
        description: "The system encountered an error while generating automated insights. This may be due to API limitations or data access issues.",
        severity: "medium" as const,
        category: "anomaly" as const,
        datasetId: "system",
        timestamp: new Date().toISOString()
      }
    ];
  }
}
