import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { MAPBOX_CONFIG } from "@/lib/constants";

// Create a simplified map visualization component without using external libraries
// This will create a basic placeholder map with dots for points

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
  const canvasRef = useRef<HTMLDivElement>(null);

  // Convert lat/long to x/y coordinates in our simple map
  const latLngToPoint = (lat: number, lng: number, bounds: DOMRect) => {
    const centerLat = center[1];
    const centerLng = center[0];
    
    // Simple conversion based on distance from center
    const x = bounds.width / 2 + (lng - centerLng) * (bounds.width / 10);
    const y = bounds.height / 2 - (lat - centerLat) * (bounds.height / 5);
    
    return { x, y };
  };

  // Render the simple map
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const container = canvasRef.current;
    const bounds = container.getBoundingClientRect();
    
    // Clear existing points
    container.innerHTML = '';
    
    // Add points
    points.forEach((point) => {
      const { x, y } = latLngToPoint(point.latitude, point.longitude, bounds);
      const size = point.properties.size || 14;
      const color = point.properties.color || '#4361EE';
      
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.style.width = `${size}px`;
      marker.style.height = `${size}px`;
      marker.style.borderRadius = '50%';
      marker.style.backgroundColor = color;
      marker.style.border = '2px solid white';
      marker.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.zIndex = '100';
      
      // Add tooltip on hover
      if (point.properties.address) {
        marker.title = point.properties.address;
        
        // Add click handler for more detailed info
        marker.addEventListener('click', () => {
          alert(`${point.properties.address}${point.properties.riskScore ? 
            `\nRisk Score: ${point.properties.riskScore}` : ''}`);
        });
        
        marker.style.cursor = 'pointer';
      }
      
      container.appendChild(marker);
    });
  }, [points, center, zoom]);

  return (
    <div className="relative">
      <div 
        ref={canvasRef}
        style={{ 
          height, 
          position: 'relative',
          backgroundColor: '#e5e7eb', // Light gray background
          backgroundImage: 'linear-gradient(#d1d5db 1px, transparent 1px), linear-gradient(90deg, #d1d5db 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          borderRadius: '0.375rem',
          overflow: 'hidden'
        }}
        className="w-full"
      />
      
      {/* Legend */}
      {legendItems && legendItems.length > 0 && (
        <Card className="absolute bottom-3 left-3 p-2 bg-white/80 backdrop-blur-sm z-[1000]">
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
      
      {/* Map attribution */}
      <div className="absolute bottom-1 right-2 text-[10px] text-gray-500">
        Simple Map Visualization
      </div>
    </div>
  );
}
