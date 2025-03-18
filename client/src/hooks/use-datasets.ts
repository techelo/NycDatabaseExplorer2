import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DATASETS } from "@/lib/constants";

interface UseDatasetReturn {
  datasets: typeof DATASETS;
  isLoading: boolean;
  error: Error | null;
}

export function useDatasets(): UseDatasetReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/datasets"],
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // For now we'll return the static data from constants.ts
  // Once the backend is connected, this will return the actual datasets
  return {
    datasets: data?.datasets || DATASETS,
    isLoading,
    error: error as Error || null,
  };
}

interface UseDatasetDetailsReturn {
  dataset: (typeof DATASETS)[0] | undefined;
  fields: Array<{ name: string; type: string; description: string }>;
  isLoading: boolean;
  error: Error | null;
}

export function useDatasetDetails(id: string): UseDatasetDetailsReturn {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/datasets/${id}`],
    retry: 1,
  });

  // For demo purposes, return the static dataset matched by ID
  const dataset = DATASETS.find((d) => d.id === id);

  // Mock fields for now
  const mockFields = [
    { name: "id", type: "string", description: "Unique identifier" },
    { name: "address", type: "string", description: "Building address" },
    { name: "borough", type: "string", description: "NYC borough" },
    { name: "zipcode", type: "string", description: "ZIP code" },
    { name: "issue_date", type: "date", description: "Date of issue" },
    { name: "status", type: "string", description: "Current status" },
    { name: "violation_type", type: "string", description: "Type of violation" },
    { name: "latitude", type: "number", description: "Geographic coordinate" },
    { name: "longitude", type: "number", description: "Geographic coordinate" },
  ];

  return {
    dataset: data?.dataset || dataset,
    fields: data?.fields || mockFields,
    isLoading,
    error: error as Error || null,
  };
}

export function useDatasetSample(id: string, limit: number = 10) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/datasets/${id}/sample?limit=${limit}`],
    retry: 1,
  });

  return {
    data: data?.data || [],
    isLoading,
    error: error as Error || null,
  };
}
