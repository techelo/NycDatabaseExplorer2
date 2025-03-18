import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DatasetCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  tags: string[];
  lastUpdated: string;
  recordCount: string;
  sourceUrl?: string;
}

export default function DatasetCard({
  id,
  name,
  description,
  icon,
  iconBg,
  tags,
  lastUpdated,
  recordCount,
  sourceUrl,
}: DatasetCardProps) {
  // Determine icon background color class
  const bgColorClass = 
    iconBg === "primary" ? "bg-primary/10 text-primary" :
    iconBg === "secondary" ? "bg-secondary/10 text-secondary" :
    "bg-accent/10 text-accent";
  
  return (
    <Card className="border border-neutral-200 hover:border-primary transition overflow-hidden">
      <div className="p-5">
        <div className="flex items-start">
          <div className={`flex-shrink-0 w-10 h-10 ${bgColorClass} rounded-md flex items-center justify-center`}>
            <i className={`fas fa-${icon}`}></i>
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-neutral-500 text-sm">{description}</p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => {
            // Determine tag color class based on index
            const tagColors = [
              "bg-blue-100 text-blue-800",
              "bg-green-100 text-green-800",
              "bg-purple-100 text-purple-800",
              "bg-red-100 text-red-800",
              "bg-yellow-100 text-yellow-800"
            ];
            const colorClass = tagColors[index % tagColors.length];
            
            return (
              <Badge key={index} variant="outline" className={colorClass}>
                {tag}
              </Badge>
            );
          })}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <span className="text-neutral-500">Updated {lastUpdated}</span>
          <span className="text-neutral-500">{recordCount} records</span>
        </div>
      </div>
      
      <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600 hover:text-primary">
                    <i className="fas fa-info-circle"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View dataset details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600 hover:text-primary">
                    <i className="fas fa-table"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View schema</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-neutral-600 hover:text-primary"
                    onClick={() => window.open(sourceUrl, '_blank')}
                    disabled={!sourceUrl}
                  >
                    <i className="fas fa-download"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download data</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Link href={`/datasets/${id}`}>
            <a className="text-primary hover:underline text-sm font-medium">Explore Data</a>
          </Link>
        </div>
      </div>
    </Card>
  );
}
