import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, FileText, AlertTriangle, RefreshCw } from "lucide-react";
import AIInsightsPanel, { useAutomatedInsights } from "@/components/ai-insights-panel";
import { useToast } from "@/hooks/use-toast";
import AIProviderBadge from "@/components/ai-provider-badge";

export default function AIInsights() {
  const { toast } = useToast();
  const { insights, isLoading, error, refresh } = useAutomatedInsights();
  
  const handleRefresh = () => {
    refresh();
    toast({
      title: "Refreshing insights",
      description: "Looking for new anomalies and patterns in the data...",
    });
  };
  
  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI-Generated Insights</h1>
        <div className="flex items-center gap-2">
          <p className="text-neutral-600">
            Automatically detected anomalies, patterns, and potential issues in NYC housing data.
          </p>
          <AIProviderBadge />
        </div>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar - Help & Info */}
        <div className="lg:col-span-1">
          {/* Help Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span>About AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>
                  Our AI system continuously monitors NYC housing data to detect anomalies, 
                  identify patterns, and highlight potential issues that might require attention.
                </p>
                <p>
                  These insights are generated automatically through machine learning algorithms 
                  analyzing data from various NYC housing datasets.
                </p>
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium text-neutral-800">Insight Types:</h3>
                  <div className="grid gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Anomalies</span>
                        <p className="text-neutral-600">Unusual data points that deviate from normal patterns</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <span className="font-medium">Patterns</span>
                        <p className="text-neutral-600">Recurring themes or connections in the data</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Insights
              </Button>
            </CardContent>
          </Card>
          
          {/* Severity Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Severity Levels</CardTitle>
              <CardDescription>Understanding insight priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="font-medium">Critical</span>
                  <span className="text-neutral-500 text-sm ml-auto">Immediate attention required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="font-medium">High</span>
                  <span className="text-neutral-500 text-sm ml-auto">Prompt investigation needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="font-medium">Medium</span>
                  <span className="text-neutral-500 text-sm ml-auto">Monitor closely</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="font-medium">Low</span>
                  <span className="text-neutral-500 text-sm ml-auto">For awareness</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main insights panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Automated Insights</CardTitle>
              <CardDescription>
                AI-detected patterns and anomalies in NYC housing data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIInsightsPanel
                insights={insights}
                isLoading={isLoading}
                error={error}
                onRefresh={handleRefresh}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}