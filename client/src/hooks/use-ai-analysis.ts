import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import type { AnalysisResult } from "@/components/ai-analysis-result";

interface UseAiAnalysisReturn {
  submitQuery: (query: string) => void;
  result: AnalysisResult | null;
  isLoading: boolean;
  error: Error | null;
  queryHistory: string[];
  resultsHistory: Record<string, AnalysisResult>;
}

export function useAiAnalysis(): UseAiAnalysisReturn {
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [resultsHistory, setResultsHistory] = useState<Record<string, AnalysisResult>>({});

  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/ai/analyze", { query });
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Store the result in history
      setResultsHistory((prev) => ({
        ...prev,
        [variables]: data,
      }));
      
      // Add to query history if not already there
      if (!queryHistory.includes(variables)) {
        setQueryHistory((prev) => [...prev, variables]);
      }
    },
  });

  const submitQuery = (query: string) => {
    setCurrentQuery(query);
    
    // Check if we already have results for this query
    if (resultsHistory[query]) {
      return;
    }
    
    mutate(query);
  };

  return {
    submitQuery,
    result: currentQuery ? resultsHistory[currentQuery] || null : null,
    isLoading,
    error: error as Error || null,
    queryHistory,
    resultsHistory,
  };
}

export function useRecentAnalyses(limit: number = 5) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/ai/recent?limit=${limit}`],
    retry: 1,
  });

  return {
    analyses: data?.analyses || [],
    isLoading,
    error: error as Error || null,
  };
}
