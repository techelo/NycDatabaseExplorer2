import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, AlertTriangle, Info, Clock, TrendingUp, Search, Zap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

interface Building {
  address: string;
  borough: string;
  flaggedIssue: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'anomaly' | 'pattern' | 'trend' | 'risk';
  datasetId: string;
  timestamp: string;
  relatedBuildings?: Building[];
}

interface AIInsightsPanelProps {
  insights?: AIInsight[];
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

export default function AIInsightsPanel({
  insights = [],
  isLoading = false,
  error = null,
  onRefresh
}: AIInsightsPanelProps) {
  
  const [filter, setFilter] = useState<string>("all");
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  
  // Get severity icon based on severity level
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get category icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'anomaly':
        return <AlertCircle className="h-4 w-4" />;
      case 'pattern':
        return <Search className="h-4 w-4" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'risk':
        return <Zap className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get severity badge color
  const getSeverityBadgeStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "bg-red-100 text-red-800 border-red-200";
      case 'high':
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 'medium':
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 'low':
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Get category badge color
  const getCategoryBadgeStyles = (category: string) => {
    switch (category) {
      case 'anomaly':
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 'pattern':
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case 'trend':
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case 'risk':
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Filter insights based on selected filter
  const filteredInsights = insights.filter(insight => {
    if (filter === "all") return true;
    if (filter === "critical" && insight.severity === "critical") return true;
    if (filter === "high" && insight.severity === "high") return true;
    if (filter === "anomalies" && insight.category === "anomaly") return true;
    if (filter === "patterns" && insight.category === "pattern") return true;
    if (filter === "trends" && insight.category === "trend") return true;
    if (filter === "risks" && insight.category === "risk") return true;
    return false;
  });
  
  // Toggle expanded state for an insight
  const toggleExpand = (id: string) => {
    if (expandedInsight === id) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(id);
    }
  };
  
  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric"
      });
    } catch (e) {
      return timestamp;
    }
  };
  
  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500 h-5 w-5" />
            <CardTitle className="text-red-700">Error Loading Insights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">
            {error.message || "We encountered an error while loading AI insights. Please try again."}
          </p>
          {onRefresh && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onRefresh}
            >
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Empty state
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Insights Available</CardTitle>
          <CardDescription>There are currently no AI-generated insights available</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No anomalies or suspicious patterns detected at this time.</p>
          {onRefresh && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onRefresh}
            >
              Refresh Insights
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="high">High</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Insights list */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No insights match the selected filter.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                Clear Filter
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredInsights.map(insight => (
            <Card 
              key={insight.id} 
              className={`overflow-hidden ${insight.severity === 'critical' ? 'border-red-300' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(insight.severity)}
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {formatDate(insight.timestamp)} • Dataset: {insight.datasetId}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getSeverityBadgeStyles(insight.severity)}>
                      {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                    </Badge>
                    <Badge variant="outline" className={getCategoryBadgeStyles(insight.category)}>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(insight.category)}
                        <span>{insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}</span>
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{insight.description}</p>
                
                {/* Related buildings section (if expanded) */}
                {expandedInsight === insight.id && insight.relatedBuildings && insight.relatedBuildings.length > 0 && (
                  <div className="mt-4">
                    <Separator className="mb-4" />
                    <h4 className="font-medium text-sm mb-2">Related Buildings:</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="p-2 font-medium">Address</th>
                            <th className="p-2 font-medium">Borough</th>
                            <th className="p-2 font-medium">Flagged Issue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insight.relatedBuildings.map((building, index) => (
                            <tr key={index} className="border-t border-gray-100">
                              <td className="p-2">{building.address}</td>
                              <td className="p-2">{building.borough}</td>
                              <td className="p-2">{building.flaggedIssue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
              {insight.relatedBuildings && insight.relatedBuildings.length > 0 && (
                <CardFooter className="border-t bg-gray-50 py-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleExpand(insight.id)}
                    className="text-xs"
                  >
                    {expandedInsight === insight.id ? "Hide Details" : `Show ${insight.relatedBuildings.length} Related Buildings`}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
      
      {onRefresh && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onRefresh}>Refresh Insights</Button>
        </div>
      )}
    </div>
  );
}

// Hook to fetch automated insights
export function useAutomatedInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('/api/ai/insights');
      
      if (response && typeof response === 'object' && 'insights' in response) {
        setInsights(response.insights as AIInsight[]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching automated insights:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch insights'));
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInsights();
  }, []);
  
  return {
    insights,
    isLoading,
    error,
    refresh: fetchInsights
  };
}