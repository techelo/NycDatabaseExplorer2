import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MapVisualization from "@/components/map-visualization";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BOROUGHS } from "@/lib/constants";

// Sample building data (in a production app, this would come from the database)
const sampleBuildings = [
  {
    id: 1,
    address: "123 Main St",
    borough: "Manhattan",
    zipCode: "10001",
    latitude: 40.7128,
    longitude: -74.006,
    buildingId: "M12345",
    riskScore: 75,
    lastInspectionDate: new Date().toISOString()
  },
  {
    id: 2,
    address: "456 Broadway",
    borough: "Brooklyn",
    zipCode: "11211",
    latitude: 40.7078,
    longitude: -73.9554,
    buildingId: "B67890",
    riskScore: 89,
    lastInspectionDate: new Date().toISOString()
  },
  {
    id: 3,
    address: "789 Queens Blvd",
    borough: "Queens",
    zipCode: "11375",
    latitude: 40.7282,
    longitude: -73.8601,
    buildingId: "Q54321",
    riskScore: 42,
    lastInspectionDate: new Date().toISOString()
  },
  {
    id: 4,
    address: "321 Bronx Ave",
    borough: "Bronx",
    zipCode: "10451",
    latitude: 40.8167,
    longitude: -73.9218,
    buildingId: "X98765",
    riskScore: 67,
    lastInspectionDate: new Date().toISOString()
  },
  {
    id: 5,
    address: "654 Staten Island Way",
    borough: "Staten Island",
    zipCode: "10301",
    latitude: 40.5795,
    longitude: -74.1502,
    buildingId: "S13579",
    riskScore: 33,
    lastInspectionDate: new Date().toISOString()
  }
];

export default function MapPage() {
  const [mapPoints, setMapPoints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBorough, setSelectedBorough] = useState<string>("all");
  const [viewMode, setViewMode] = useState<string>("violations");
  
  // Format building data for the map
  useEffect(() => {
    // Simulate API loading delay
    setTimeout(() => {
      const filteredBuildings = selectedBorough === "all" 
        ? sampleBuildings 
        : sampleBuildings.filter(b => b.borough && 
            b.borough.toLowerCase() === BOROUGHS.find(
              borough => borough.id === selectedBorough
            )?.name.toLowerCase());
      
      const points = filteredBuildings.map(building => ({
        latitude: building.latitude || 0,
        longitude: building.longitude || 0,
        properties: {
          address: building.address || "",
          riskScore: building.riskScore || 0,
          // Color based on risk score
          color: (building.riskScore || 0) > 70 
            ? "#ef4444" // High risk (red)
            : (building.riskScore || 0) > 40 
              ? "#f59e0b" // Medium risk (amber)
              : "#10b981", // Low risk (green)
          size: 16 + ((building.riskScore || 0) / 10), // Size based on risk
          borough: building.borough || "",
          zipCode: building.zipCode || "",
          buildingId: building.buildingId || ""
        }
      }));
      
      setMapPoints(points);
      setIsLoading(false);
    }, 1000);
  }, [selectedBorough, viewMode]);
  
  // Generate legend items based on view mode
  const legendItems = viewMode === "violations" 
    ? [
        { color: "#ef4444", label: "High Risk (70-100)" },
        { color: "#f59e0b", label: "Medium Risk (40-70)" },
        { color: "#10b981", label: "Low Risk (0-40)" }
      ]
    : [
        { color: "#3b82f6", label: "Inspected < 1 month" },
        { color: "#8b5cf6", label: "Inspected < 6 months" },
        { color: "#ec4899", label: "Inspected > 6 months" }
      ];
  
  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">NYC Housing Map</h1>
      
      <div className="mb-6">
        <Tabs defaultValue={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="violations">
              Violations & Risk
            </TabsTrigger>
            <TabsTrigger value="inspections">
              Inspection Status
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Filter Buildings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Borough</h3>
                <div className="space-y-1">
                  <Button 
                    variant={selectedBorough === "all" ? "default" : "outline"} 
                    size="sm"
                    className="mr-2 mb-2"
                    onClick={() => setSelectedBorough("all")}
                  >
                    All Boroughs
                  </Button>
                  
                  {BOROUGHS.map(borough => (
                    <Button 
                      key={borough.id} 
                      variant={selectedBorough === borough.id ? "default" : "outline"} 
                      size="sm"
                      className="mr-2 mb-2"
                      onClick={() => setSelectedBorough(borough.id)}
                    >
                      {borough.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Risk Level</h3>
                <div className="space-y-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mr-2 mb-2 border-red-500 text-red-500"
                  >
                    High Risk
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mr-2 mb-2 border-amber-500 text-amber-500"
                  >
                    Medium Risk
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mr-2 mb-2 border-green-500 text-green-500"
                  >
                    Low Risk
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Violation Type</h3>
                <div className="space-y-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mr-2 mb-2"
                  >
                    All Types
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mr-2 mb-2"
                  >
                    Heat/Hot Water
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mr-2 mb-2"
                  >
                    Structural
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mr-2 mb-2"
                  >
                    Pests
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>
              {viewMode === "violations" ? "Building Risk Map" : "Inspection Status Map"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[600px] w-full rounded-md" />
            ) : (
              <div className="h-[600px]">
                <MapVisualization 
                  points={mapPoints}
                  height="600px"
                  legendItems={legendItems}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}