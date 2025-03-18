import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Card } from "@/components/ui/card";
import { MAPBOX_CONFIG } from "@/lib/constants";

// Initialize mapboxgl access token from environment variable
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "pk.eyJ1IjoibnljZGJleHBsb3JlciIsImEiOiJjbDRqc3FlbWYwMDNqM2NxbmdhZno0cWU3In0.XG0tK5_c88-ZHWW8TEgPIA";
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface MapPoint {
  latitude: number;
  longitude: number;
  properties: {
    address?: string;
    riskScore?: number;
    color?: string;
    size?: number;
    [key: string]: any;
  };
}

interface MapVisualizationProps {
  points?: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  legendItems?: Array<{
    color: string;
    label: string;
  }>;
}

export default function MapVisualization({
  points = [],
  center = MAPBOX_CONFIG.center as [number, number],
  zoom = MAPBOX_CONFIG.zoom,
  height = "400px",
  legendItems,
}: MapVisualizationProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: center,
      zoom: zoom,
    });
    
    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Set map loaded flag when ready
    map.current.on('load', () => {
      setMapLoaded(true);
    });
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Add points to map when data changes or map loads
  useEffect(() => {
    if (!map.current || !mapLoaded || !points.length) return;
    
    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Add points as markers
    points.forEach((point) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      
      // Set marker style
      const size = point.properties.size || 14;
      const color = point.properties.color || '#4361EE';
      
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
      
      // Create popup if address is provided
      let popup: mapboxgl.Popup | null = null;
      if (point.properties.address) {
        popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div>
              <strong>${point.properties.address}</strong>
              ${point.properties.riskScore ? 
                `<div>Risk Score: ${point.properties.riskScore}</div>` : ''}
            </div>
          `);
      }
      
      // Add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([point.longitude, point.latitude])
        .setPopup(popup || undefined)
        .addTo(map.current!);
    });
  }, [points, mapLoaded]);

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        style={{ height }} 
        className="w-full rounded-md overflow-hidden"
      />
      
      {/* Legend */}
      {legendItems && legendItems.length > 0 && (
        <Card className="absolute bottom-3 left-3 p-2 bg-white/80 backdrop-blur-sm">
          <div className="text-xs font-medium mb-1">Legend</div>
          <div className="space-y-1">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
