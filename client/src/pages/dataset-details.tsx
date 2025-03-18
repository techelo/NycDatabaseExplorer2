import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Database, 
  BarChart as BarChartIcon, 
  Map,
  ExternalLink
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import DataTable from "@/components/data-table";
import MapVisualization from "@/components/map-visualization";
import BarChart from "@/components/charts/bar-chart";
import { useDatasetDetails, useDatasetSample } from "@/hooks/use-datasets";
import { useMapPoints } from "@/hooks/use-mapbox";

export default function DatasetDetails() {
  const [location] = useLocation();
  const id = location.split('/').pop();
  
  const { dataset, fields, isLoading: detailsLoading, error: detailsError } = useDatasetDetails(id || '');
  const { data: sampleData, isLoading: sampleLoading, error: sampleError } = useDatasetSample(id, 25);
  
  const [currentTab, setCurrentTab] = useState("overview");
  const [mapPoints, setMapPoints] = useState<any[]>([]);
  
  // Format data for visualization
  useEffect(() => {
    if (sampleData && sampleData.length > 0) {
      // Check if the sample data has geo coordinates
      const hasCoordinates = sampleData.some((item: any) => 
        (item.latitude && item.longitude) || 
        (item.lat && item.lng)
      );
      
      if (hasCoordinates) {
        const points = sampleData.map((item: any) => ({
          latitude: parseFloat(item.latitude || item.lat || "0"),
          longitude: parseFloat(item.longitude || item.lng || "0"),
          properties: {
            ...item,
            address: item.address || `${item.number || ""} ${item.street || ""}`.trim(),
            color: "#4361EE"
          }
        })).filter((point: any) => point.latitude && point.longitude);
        
        setMapPoints(points);
      }
    }
  }, [sampleData]);
  
  // Handle errors
  if (!id) {
    return (
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Dataset ID Missing</h2>
          <p className="mt-2 text-neutral-600">Please select a dataset to view details.</p>
          <Button asChild className="mt-4">
            <Link href="/datasets">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Datasets
            </Link>
          </Button>
        </div>
      </main>
    );
  }
  
  // Generate sample visualization data based on dataset type
  const generateVisualizationData = () => {
    if (!dataset) return [];
    
    if (dataset.id === "dob_violations") {
      return [
        { name: "Structural", value: 35, color: "#4361EE" },
        { name: "Electrical", value: 25, color: "#3A0CA3" },
        { name: "Plumbing", value: 20, color: "#F72585" },
        { name: "Fire Safety", value: 15, color: "#FF9E00" },
        { name: "Other", value: 5, color: "#4CC9F0" }
      ];
    } else if (dataset.id === "hpd_complaints") {
      return [
        { name: "Heat/Hot Water", value: 40, color: "#4361EE" },
        { name: "Plumbing", value: 22, color: "#3A0CA3" },
        { name: "Paint/Plaster", value: 18, color: "#F72585" },
        { name: "Electric", value: 12, color: "#FF9E00" },
        { name: "Door/Window", value: 8, color: "#4CC9F0" }
      ];
    } else {
      return [
        { name: "Category 1", value: 35, color: "#4361EE" },
        { name: "Category 2", value: 25, color: "#3A0CA3" },
        { name: "Category 3", value: 20, color: "#F72585" },
        { name: "Category 4", value: 15, color: "#FF9E00" },
        { name: "Category 5", value: 5, color: "#4CC9F0" }
      ];
    }
  };
  
  // Generate visualization chart component
  const visualizationData = generateVisualizationData();
  
  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back navigation */}
      <div className="mb-6">
        <Link href="/datasets">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Datasets
          </Button>
        </Link>
      </div>
      
      {/* Dataset Header */}
      {detailsLoading ? (
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 mb-3" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      ) : !dataset ? (
        <div className="text-center py-12 mb-8">
          <h2 className="text-xl font-semibold">Dataset Not Found</h2>
          <p className="mt-2 text-neutral-600">The requested dataset could not be found.</p>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 bg-${dataset.iconBg}/10 text-${dataset.iconBg} rounded-md flex items-center justify-center`}>
              <i className={`fas fa-${dataset.icon} text-xl`}></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{dataset.name}</h1>
              <p className="text-neutral-600 mt-1 mb-3">{dataset.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {dataset.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                <div className="flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i>
                  Updated: {dataset.lastUpdated}
                </div>
                <div className="flex items-center">
                  <i className="fas fa-table mr-2"></i>
                  {dataset.recordCount} records
                </div>
                {dataset.sourceUrl && (
                  <div className="flex items-center">
                    <i className="fas fa-external-link-alt mr-2"></i>
                    <a 
                      href={dataset.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Source Data
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="ml-auto">
              <Button className="mr-2">
                <Download className="mr-2 h-4 w-4" /> Download Data
              </Button>
              <Button variant="outline">API Access</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <FileText className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="schema">
            <Database className="h-4 w-4 mr-2" /> Schema
          </TabsTrigger>
          <TabsTrigger value="preview">
            <i className="fas fa-table mr-2"></i> Data Preview
          </TabsTrigger>
          <TabsTrigger value="visualization">
            <BarChartIcon className="h-4 w-4 mr-2" /> Visualization
          </TabsTrigger>
          {mapPoints.length > 0 && (
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" /> Map View
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          {detailsLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-64 mt-8 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : !dataset ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">Dataset Information Not Available</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Dataset</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-neutral max-w-none">
                      <p>
                        This dataset contains information about {dataset.name.toLowerCase()}. 
                        It is maintained by the NYC agency responsible for this data and updated {dataset.lastUpdated}.
                      </p>
                      
                      <p>
                        The data includes records of {dataset.tags.join(", ")}, providing valuable 
                        insights for housing researchers, tenant advocates, and city planners.
                      </p>
                      
                      {dataset.id === "dob_violations" && (
                        <>
                          <h3>Department of Buildings Violations</h3>
                          <p>
                            The Department of Buildings (DOB) issues violations against properties that do not comply with 
                            building codes and zoning regulations. These violations can range from minor infractions to serious 
                            safety hazards that require immediate attention.
                          </p>
                        </>
                      )}
                      
                      {dataset.id === "hpd_complaints" && (
                        <>
                          <h3>Housing Preservation & Development Complaints</h3>
                          <p>
                            HPD receives complaints from tenants regarding conditions in their apartments or buildings. 
                            Common complaints include lack of heat or hot water, mold, leaks, pests, and structural issues. 
                            HPD inspects the conditions and may issue violations to landlords.
                          </p>
                        </>
                      )}
                      
                      {dataset.id === "pluto" && (
                        <>
                          <h3>Property Land Use Tax Lot Output (PLUTO)</h3>
                          <p>
                            PLUTO contains extensive land use and geographic data at the tax lot level. It includes information 
                            about zoning, building characteristics, tax assessments, and property ownership, providing a comprehensive 
                            view of NYC's real estate landscape.
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-1">Research Questions</h3>
                        <ul className="list-disc ml-5 space-y-1 text-sm">
                          <li>How do housing violations correlate with neighborhood demographics?</li>
                          <li>Which buildings have the highest concentration of specific violation types?</li>
                          <li>How do seasonal patterns affect the frequency of certain complaints?</li>
                          <li>What is the relationship between building age and violation frequency?</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">AI Analysis Suggestions</h3>
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/ai-analysis?query=Analyze ${dataset.name} trends over the past year`}>
                            <Button variant="outline" size="sm">
                              Analyze trends
                            </Button>
                          </Link>
                          <Link href={`/ai-analysis?query=Compare ${dataset.name} across different boroughs`}>
                            <Button variant="outline" size="sm">
                              Compare boroughs
                            </Button>
                          </Link>
                          <Link href={`/ai-analysis?query=Identify patterns in ${dataset.name}`}>
                            <Button variant="outline" size="sm">
                              Identify patterns
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dataset Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">Update Frequency</dt>
                        <dd className="mt-1">Monthly</dd>
                      </div>
                      <Separator />
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">Record Count</dt>
                        <dd className="mt-1">{dataset.recordCount}</dd>
                      </div>
                      <Separator />
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">Time Period</dt>
                        <dd className="mt-1">2010 - Present</dd>
                      </div>
                      <Separator />
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">Geographic Coverage</dt>
                        <dd className="mt-1">All NYC Boroughs</dd>
                      </div>
                      <Separator />
                      <div>
                        <dt className="text-sm font-medium text-neutral-500">Source</dt>
                        <dd className="mt-1">
                          <a 
                            href={dataset.sourceUrl || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            NYC Open Data
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Related Datasets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/datasets/dob_complaints">
                          <a className="text-primary hover:underline">DOB Complaints</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/datasets/hpd_violations">
                          <a className="text-primary hover:underline">HPD Violations</a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/datasets/pluto">
                          <a className="text-primary hover:underline">PLUTO Data</a>
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schema">
          {detailsLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
              </CardContent>
            </Card>
          ) : !fields || fields.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold">Schema Information Not Available</h2>
                <p className="mt-2 text-neutral-600">
                  Schema details for this dataset could not be loaded.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Dataset Schema</CardTitle>
                <CardDescription>
                  Fields and data types for the {dataset?.name} dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Field Name</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Data Type</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-neutral-500">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => (
                        <tr key={index} className="border-b border-neutral-200 hover:bg-neutral-50">
                          <td className="py-3 px-4 text-sm font-medium">{field.name}</td>
                          <td className="py-3 px-4 text-sm text-neutral-600">{field.type}</td>
                          <td className="py-3 px-4 text-sm text-neutral-600">{field.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="preview">
          {sampleLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-60 w-full" />
              </CardContent>
            </Card>
          ) : sampleError || !sampleData || sampleData.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h2 className="text-xl font-semibold">Sample Data Not Available</h2>
                <p className="mt-2 text-neutral-600">
                  Sample data for this dataset could not be loaded.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  Sample of {sampleData.length} records from the {dataset?.name} dataset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={sampleData}
                  columns={
                    Object.keys(sampleData[0]).slice(0, 8).map(key => ({
                      key: key,
                      header: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                    }))
                  }
                  pagination={true}
                  searchable={true}
                  exportable={true}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="visualization">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution by Category</CardTitle>
                <CardDescription>
                  Breakdown of {dataset?.name} by primary categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={visualizationData}
                    height={320}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Proportional Distribution</CardTitle>
                <CardDescription>
                  Relative proportions of different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <div className="flex items-center justify-center h-full">
                    <div className="w-full max-w-md">
                      <BarChart 
                        data={visualizationData}
                        horizontal={true}
                        height={320}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {mapPoints.length > 0 && (
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  Map visualization of {dataset?.name} data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px]">
                  <MapVisualization 
                    points={mapPoints}
                    height="600px"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </main>
  );
}
