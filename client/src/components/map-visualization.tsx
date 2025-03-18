import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MAPBOX_CONFIG } from "@/lib/constants";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issue in React
// This is needed because Leaflet's default marker icons have relative paths that don't work in a bundled app
// We'll set this up once when the component is imported
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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
  // Swap the coordinates for Leaflet (lat, lng instead of lng, lat)
  const leafletCenter: [number, number] = [center[1], center[0]];

  // Create custom icon for markers
  const createCustomIcon = (color: string, size: number) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  return (
    <div className="relative">
      <div 
        style={{ height }} 
        className="w-full rounded-md overflow-hidden"
      >
        <MapContainer 
          center={leafletCenter} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />
          
          {points.map((point, index) => {
            const size = point.properties.size || 14;
            const color = point.properties.color || '#4361EE';
            
            return (
              <Marker
                key={index}
                position={[point.latitude, point.longitude]}
                icon={createCustomIcon(color, size)}
              >
                {point.properties.address && (
                  <Popup>
                    <div>
                      <strong>{point.properties.address}</strong>
                      {point.properties.riskScore && 
                        <div>Risk Score: {point.properties.riskScore}</div>
                      }
                    </div>
                  </Popup>
                )}
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
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
    </div>
  );
}
