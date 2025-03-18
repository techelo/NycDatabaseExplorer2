import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Hook to fetch geocoding data from Mapbox
export function useGeocoding(address: string) {
  const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoibnljZGJleHBsb3JlciIsImEiOiJjbDRqc3FlbWYwMDNqM2NxbmdhZno0cWU3In0.XG0tK5_c88-ZHWW8TEgPIA";

  const { data, isLoading, error } = useQuery({
    queryKey: [`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`],
    enabled: !!address && address.length > 0,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  let coordinates: [number, number] | null = null;
  
  if (data?.features && data.features.length > 0) {
    coordinates = data.features[0].geometry.coordinates as [number, number];
  }
  
  return {
    coordinates,
    isLoading,
    error,
  };
}

// Hook to generate map points from building data
interface BuildingData {
  address: string;
  borough?: string;
  zipCode?: string;
  riskScore?: number;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}

export function useMapPoints(buildings: BuildingData[]) {
  const [points, setPoints] = useState<Array<{
    latitude: number;
    longitude: number;
    properties: Record<string, any>;
  }>>([]);
  
  // Process buildings with coordinates
  useEffect(() => {
    if (!buildings || buildings.length === 0) {
      setPoints([]);
      return;
    }
    
    // Filter buildings that have coordinates
    const validBuildings = buildings.filter(
      (b) => b.latitude && b.longitude
    );
    
    if (validBuildings.length === 0) {
      setPoints([]);
      return;
    }
    
    // Map to format needed for map
    const mappedPoints = validBuildings.map((building) => {
      // Determine color based on risk score if available
      let color = "#4361EE"; // default
      let size = 14; // default size
      
      if (building.riskScore !== undefined) {
        if (building.riskScore >= 80) {
          color = "#dc2626"; // red for high risk
          size = 18;
        } else if (building.riskScore >= 60) {
          color = "#ea580c"; // orange for medium-high risk
          size = 16;
        } else if (building.riskScore >= 40) {
          color = "#facc15"; // yellow for medium risk
        } else {
          color = "#22c55e"; // green for low risk
        }
      }
      
      return {
        latitude: building.latitude!,
        longitude: building.longitude!,
        properties: {
          address: building.address,
          borough: building.borough,
          zipCode: building.zipCode,
          riskScore: building.riskScore,
          color,
          size,
        },
      };
    });
    
    setPoints(mappedPoints);
  }, [buildings]);
  
  return points;
}
