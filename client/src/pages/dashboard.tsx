import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/hero-section";
import DatasetCard from "@/components/dataset-card";
import InsightCard from "@/components/insight-card";
import AiQueryInput from "@/components/ai-query-input";
import { useDatasets } from "@/hooks/use-datasets";
import { useAiAnalysis, useRecentAnalyses } from "@/hooks/use-ai-analysis";
import { DATASETS, RECENT_INSIGHTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import LineChart from "@/components/charts/line-chart";
import PieChart from "@/components/charts/pie-chart";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const { datasets, isLoading: datasetsLoading } = useDatasets();
  const { submitQuery, isLoading: aiLoading } = useAiAnalysis();
  const { analyses, isLoading: analysesLoading } = useRecentAnalyses(2);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Prefetch popular datasets
  useEffect(() => {
    DATASETS.slice(0, 3).forEach((dataset) => {
      queryClient.prefetchQuery({
        queryKey: [`/api/datasets/${dataset.id}`],
      });
    });
  }, [queryClient]);
  
  const handleAiAnalyze = (query: string) => {
    submitQuery(query);
    toast({
      title: "Analysis in progress",
      description: "Redirecting to AI analysis page...",
    });
    // Redirect to AI analysis page
    window.location.href = "/ai-analysis?query=" + encodeURIComponent(query);
  };
  
  // Sample data for visualizations in insight cards
  const hpdViolationsData = [
    { date: "2020-01", manhattan: 450, bronx: 620, brooklyn: 580, queens: 320, staten_island: 120 },
    { date: "2020-06", manhattan: 380, bronx: 580, brooklyn: 500, queens: 290, staten_island: 105 },
    { date: "2021-01", manhattan: 520, bronx: 690, brooklyn: 620, queens: 350, staten_island: 140 },
    { date: "2021-06", manhattan: 430, bronx: 640, brooklyn: 550, queens: 310, staten_island: 125 },
    { date: "2022-01", manhattan: 580, bronx: 750, brooklyn: 680, queens: 390, staten_island: 160 },
    { date: "2022-06", manhattan: 490, bronx: 700, brooklyn: 600, queens: 340, staten_island: 145 },
    { date: "2023-01", manhattan: 650, bronx: 830, brooklyn: 720, queens: 410, staten_island: 180 },
  ];
  
  const affordableHousingData = [
    { name: "Bronx", value: 36, color: "#4361EE" },
    { name: "Brooklyn", value: 28, color: "#F72585" },
    { name: "Manhattan", value: 15, color: "#7209B7" },
    { name: "Queens", value: 18, color: "#4CC9F0" },
    { name: "Staten Island", value: 3, color: "#3A0CA3" }
  ];
  
  // Chart components for insight cards
  const violationsTrendChart = (
    <LineChart
      data={hpdViolationsData}
      series={[
        { name: "Manhattan", dataKey: "manhattan", color: "#4361EE" },
        { name: "Bronx", dataKey: "bronx", color: "#F72585" },
        { name: "Brooklyn", dataKey: "brooklyn", color: "#7209B7" },
        { name: "Queens", dataKey: "queens", color: "#4CC9F0" },
        { name: "Staten Island", dataKey: "staten_island", color: "#3A0CA3" },
      ]}
      xAxisKey="date"
      height={160}
      dateFormatter={(date) => {
        const [year, month] = date.split("-");
        return `${month === "01" ? "Jan" : "Jun"} ${year}`;
      }}
    />
  );
  
  const affordableHousingChart = (
    <PieChart
      data={affordableHousingData}
      height={160}
    />
  );

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <HeroSection />
      
      {/* AI Analysis Section */}
      <section className="mb-8" id="ai-analysis">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">AI-Powered Data Analysis</h2>
            <p className="text-neutral-600 mb-6">
              Use natural language to analyze complex NYC housing datasets and get meaningful insights.
            </p>
            
            {/* AI Query Input */}
            <AiQueryInput onAnalyze={handleAiAnalyze} isLoading={aiLoading} />
            
            <div className="flex justify-end">
              <Link href="/ai-analysis">
                <Button variant="link" className="text-primary hover:underline font-medium">
                  View Previous Analyses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Datasets */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Popular Datasets</h2>
          <Link href="/datasets">
            <Button variant="link" className="text-primary hover:underline font-medium">
              View All Datasets
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasetsLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Loading datasets...</span>
              </div>
            </div>
          ) : (
            datasets.slice(0, 3).map((dataset) => (
              <DatasetCard
                key={dataset.id}
                id={dataset.id}
                name={dataset.name}
                description={dataset.description}
                icon={dataset.icon}
                iconBg={dataset.iconBg}
                tags={dataset.tags}
                lastUpdated={dataset.lastUpdated}
                recordCount={dataset.recordCount}
                sourceUrl={dataset.sourceUrl}
              />
            ))
          )}
        </div>
      </section>
      
      {/* Recent Insights */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Insights</h2>
          <Link href="/insights">
            <Button variant="link" className="text-primary hover:underline font-medium">
              View All Insights
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {analysesLoading ? (
            <div className="col-span-2 flex justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Loading insights...</span>
              </div>
            </div>
          ) : (
            <>
              <InsightCard
                id="hpd_violations_trends"
                title="HPD Violations Trends in Manhattan"
                description="Analysis of heating and hot water complaints during winter months shows a 15% increase over the past 3 years."
                icon="robot"
                iconBg="primary"
                date="July 12, 2023"
                chartComponent={violationsTrendChart}
              />
              <InsightCard
                id="affordable_housing_distribution"
                title="Affordable Housing Distribution in NYC"
                description="Analysis of affordable housing units shows uneven distribution across boroughs with the Bronx leading in new developments."
                icon="chart-pie"
                iconBg="secondary"
                date="July 5, 2023"
                chartComponent={affordableHousingChart}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
