import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DatasetCard from "@/components/dataset-card";
import { useDatasets } from "@/hooks/use-datasets";
import { BOROUGHS } from "@/lib/constants";
import { Search } from "lucide-react";

export default function Datasets() {
  const { datasets, isLoading } = useDatasets();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Category options
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "buildings", name: "Buildings" },
    { id: "violations", name: "Violations" },
    { id: "complaints", name: "Complaints" },
    { id: "housing", name: "Housing" },
    { id: "sales", name: "Property Sales" },
  ];

  // Source options
  const sources = [
    { id: "all", name: "All Sources" },
    { id: "dob", name: "Department of Buildings" },
    { id: "hpd", name: "Housing Preservation & Development" },
    { id: "dof", name: "Department of Finance" },
    { id: "pluto", name: "PLUTO" },
  ];

  // Filter datasets based on search query and filters
  const filteredDatasets = datasets.filter((dataset) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    const matchesCategory =
      categoryFilter === "all" ||
      dataset.tags.some((tag) => tag.toLowerCase() === categoryFilter.toLowerCase());

    // Source filter
    const matchesSource =
      sourceFilter === "all" || dataset.id.startsWith(sourceFilter);

    return matchesSearch && matchesCategory && matchesSource;
  });

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NYC Housing Datasets</h1>
        <p className="text-neutral-600">
          Browse and explore datasets from various NYC agencies related to housing and buildings.
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Find Datasets</CardTitle>
          <CardDescription>
            Use the filters and search to find specific datasets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search datasets..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={sourceFilter}
              onValueChange={setSourceFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dataset List/Grid */}
      <div className="mb-8">
        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {filteredDatasets.length} {filteredDatasets.length === 1 ? "Dataset" : "Datasets"} Found
            </h2>
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Loading datasets...</span>
                </div>
              </div>
            ) : filteredDatasets.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No datasets found</h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setSourceFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDatasets.map((dataset) => (
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
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Loading datasets...</span>
                </div>
              </div>
            ) : filteredDatasets.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No datasets found</h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setSourceFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDatasets.map((dataset) => (
                  <Card key={dataset.id} className="overflow-hidden hover:border-primary transition">
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-5 flex-1">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-10 h-10 bg-${dataset.iconBg}/10 text-${dataset.iconBg} rounded-md flex items-center justify-center`}>
                            <i className={`fas fa-${dataset.icon}`}></i>
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-lg">{dataset.name}</h3>
                            <p className="text-neutral-500 text-sm">{dataset.description}</p>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              {dataset.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="mt-2 text-sm text-neutral-500">
                              <span className="mr-4">Updated: {dataset.lastUpdated}</span>
                              <span>{dataset.recordCount} records</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5 bg-neutral-50 border-t sm:border-t-0 sm:border-l border-neutral-200 flex flex-row sm:flex-col justify-between sm:justify-center items-center gap-4">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => window.location.href = `/datasets/${dataset.id}`}
                        >
                          Explore
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => dataset.sourceUrl && window.open(dataset.sourceUrl, '_blank')}
                          disabled={!dataset.sourceUrl}
                        >
                          Source
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Boroughs Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Browse by Borough</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BOROUGHS.map((borough) => (
            <Card 
              key={borough.id}
              className="hover:border-primary cursor-pointer transition"
              onClick={() => window.location.href = `/datasets?borough=${borough.id}`}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="text-3xl mb-2">
                  <i className="fas fa-building"></i>
                </div>
                <h3 className="font-medium">{borough.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
