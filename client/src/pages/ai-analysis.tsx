import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AiQueryInput from "@/components/ai-query-input";
import AiAnalysisResult, { AnalysisResult } from "@/components/ai-analysis-result";
import { useAiAnalysis } from "@/hooks/use-ai-analysis";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import MapVisualization from "@/components/map-visualization";
import BarChart from "@/components/charts/bar-chart";
import PieChart from "@/components/charts/pie-chart";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function AiAnalysis() {
  const { toast } = useToast();
  const { 
    submitQuery, 
    result, 
    isLoading, 
    error, 
    queryHistory, 
    resultsHistory 
  } = useAiAnalysis();
  
  const [currentQuery, setCurrentQuery] = useState("");
  const [mapPoints, setMapPoints] = useState<any[]>([]);
  
  // Parse the URL query parameter if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("query");
    
    if (queryParam && queryParam.trim() !== "") {
      setCurrentQuery(queryParam);
      submitQuery(queryParam);
      
      // Update the URL without the query parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);
  
  // Set map points when result changes
  useEffect(() => {
    if (result?.buildings && result.buildings.length > 0) {
      // For demo purposes, we'll generate random coordinates for NYC
      const newMapPoints = result.buildings.map((building) => {
        // Generate coordinates in NYC area (approximately)
        const lat = 40.65 + (Math.random() * 0.2);
        const lng = -74.05 + (Math.random() * 0.2);
        
        // Determine color based on risk level
        let color = "#4361EE";
        let size = 14;
        
        if (building.riskLevel === "Critical") {
          color = "#dc2626";
          size = 18;
        } else if (building.riskLevel === "High") {
          color = "#ea580c";
          size = 16;
        } else if (building.riskLevel === "Medium") {
          color = "#facc15";
        } else {
          color = "#22c55e";
        }
        
        return {
          latitude: lat,
          longitude: lng,
          properties: {
            address: building.address,
            riskScore: building.riskScore,
            color,
            size,
          }
        };
      });
      
      setMapPoints(newMapPoints);
    } else {
      setMapPoints([]);
    }
  }, [result]);
  
  const handleAnalyze = (query: string) => {
    setCurrentQuery(query);
    submitQuery(query);
  };
  
  const handleFollowUp = (question: string) => {
    setCurrentQuery(question);
    submitQuery(question);
    
    toast({
      title: "Follow-up question submitted",
      description: "Analyzing your follow-up question...",
    });
  };
  
  const handleReset = () => {
    setCurrentQuery("");
  };
  
  // Prepare chart data if available
  const riskBreakdownChart = result?.buildings ? (
    <PieChart
      data={[
        { name: "Critical", value: result.buildings.filter(b => b.riskLevel === "Critical").length, color: "#dc2626" },
        { name: "High", value: result.buildings.filter(b => b.riskLevel === "High").length, color: "#ea580c" },
        { name: "Medium", value: result.buildings.filter(b => b.riskLevel === "Medium").length, color: "#facc15" },
        { name: "Low", value: result.buildings.filter(b => b.riskLevel === "Low").length, color: "#22c55e" }
      ].filter(item => item.value > 0)}
      title="Risk Level Distribution"
      height={240}
    />
  ) : null;
  
  const violationTypesChart = result?.violationTypes ? (
    <BarChart
      data={result.violationTypes.map(vt => ({
        name: vt.name,
        value: vt.percentage
      }))}
      horizontal={true}
      height={240}
      valueFormatter={(value) => `${value}%`}
    />
  ) : null;
  
  // Map legend items
  const mapLegendItems = [
    { color: "#dc2626", label: "Critical Risk" },
    { color: "#ea580c", label: "High Risk" },
    { color: "#facc15", label: "Medium Risk" },
    { color: "#22c55e", label: "Low Risk" }
  ];

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI-Powered Data Analysis</h1>
        <p className="text-neutral-600">
          Use natural language to analyze complex NYC housing datasets and get meaningful insights.
        </p>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - History & Info */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>Your recent queries</CardDescription>
            </CardHeader>
            <CardContent>
              {queryHistory.length === 0 ? (
                <div className="text-center py-6 text-neutral-500">
                  <p>No previous analyses yet</p>
                  <p className="text-sm mt-1">Your analysis history will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {queryHistory.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-auto py-2"
                      onClick={() => handleAnalyze(query)}
                    >
                      <div className="truncate">{query}</div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Help & Tips</CardTitle>
              <CardDescription>How to use AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Example Queries</h3>
                  <ul className="text-sm space-y-1">
                    <li>• "Show me buildings in Brooklyn with a high risk of structural issues"</li>
                    <li>• "What are the most common violations in Manhattan high-rises?"</li>
                    <li>• "Are there buildings in the Bronx with signs of illegal renovations?"</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm mb-1">Available Data</h3>
                  <p className="text-sm">Analysis can include data from:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• DOB Violations</li>
                    <li>• HPD Complaints</li>
                    <li>• Building Inspections</li>
                    <li>• Construction Permits</li>
                    <li>• Property Records</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-sm mb-1">Limitations</h3>
                  <p className="text-sm">Current analysis may be limited by:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• Data refresh frequency</li>
                    <li>• Historical data availability</li>
                    <li>• Geographic coverage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main analysis area */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Enter your question about NYC housing data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <AiQueryInput 
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                />
                {currentQuery && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleReset}
                    title="Clear current query"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Results Area */}
          {error ? (
            <Card className="border-red-300 bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-red-500 h-5 w-5" />
                  <CardTitle className="text-red-700">Error</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  {error.message || "An error occurred while analyzing your query. Please try again."}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => submitQuery(currentQuery)}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div>
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-64 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-60 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-60 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : result ? (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Results</TabsTrigger>
                {mapPoints.length > 0 && <TabsTrigger value="map">Map View</TabsTrigger>}
                {(riskBreakdownChart || violationTypesChart) && <TabsTrigger value="charts">Charts</TabsTrigger>}
                {result.buildings && result.buildings.length > 0 && <TabsTrigger value="data">Data</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="all">
                <AiAnalysisResult 
                  result={result}
                  onFollowUp={handleFollowUp}
                  mapComponent={mapPoints.length > 0 ? 
                    <MapVisualization 
                      points={mapPoints}
                      legendItems={mapLegendItems}
                    /> : undefined
                  }
                  chartComponents={{
                    riskBreakdown: riskBreakdownChart,
                    violationTypes: violationTypesChart
                  }}
                />
              </TabsContent>
              
              <TabsContent value="map">
                <Card>
                  <CardHeader>
                    <CardTitle>Geographic Distribution</CardTitle>
                    <CardDescription>
                      Map visualization of buildings matching your query
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[600px]">
                      <MapVisualization 
                        points={mapPoints}
                        height="600px"
                        legendItems={mapLegendItems}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="charts">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskBreakdownChart && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Risk Level Breakdown</CardTitle>
                        <CardDescription>
                          Distribution of buildings by risk level
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {riskBreakdownChart}
                      </CardContent>
                    </Card>
                  )}
                  
                  {violationTypesChart && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Common Violation Types</CardTitle>
                        <CardDescription>
                          Frequency of different violation types
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {violationTypesChart}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="data">
                {result.buildings && result.buildings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Building Data</CardTitle>
                      <CardDescription>
                        Detailed information about buildings matching your query
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                              <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Address</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Neighborhood</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Risk Score</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Open Violations</th>
                              <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Last Inspection</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.buildings.map((building, index) => {
                              let riskBadgeColor = "bg-blue-100 text-blue-800";
                              
                              if (building.riskLevel === "Critical") {
                                riskBadgeColor = "bg-red-100 text-red-800";
                              } else if (building.riskLevel === "High") {
                                riskBadgeColor = "bg-orange-100 text-orange-800";
                              } else if (building.riskLevel === "Medium") {
                                riskBadgeColor = "bg-yellow-100 text-yellow-800";
                              } else if (building.riskLevel === "Low") {
                                riskBadgeColor = "bg-green-100 text-green-800";
                              }
                              
                              return (
                                <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                                  <td className="py-3 px-4 text-sm">{building.address}</td>
                                  <td className="py-3 px-4 text-sm">{building.neighborhood}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${riskBadgeColor}`}>
                                      {building.riskLevel} ({building.riskScore}/100)
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-sm">{building.openViolations}</td>
                                  <td className="py-3 px-4 text-sm">{building.lastInspection}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-dashed border-2 bg-neutral-50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <i className="fas fa-robot text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">No Analysis Results Yet</h3>
                <p className="text-neutral-600 max-w-md mb-6">
                  Ask a question about NYC housing data to get started. Try asking about violations, 
                  complaints, building conditions, or trends in specific boroughs.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleAnalyze("Show me buildings in Brooklyn with a high risk of structural issues")}
                  >
                    Brooklyn structural risks
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleAnalyze("Are there buildings in the Bronx with signs of illegal renovations?")}
                  >
                    Bronx illegal renovations
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
