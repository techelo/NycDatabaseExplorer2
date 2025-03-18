import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface InsightCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  date: string;
  chartComponent?: React.ReactNode;
}

export default function InsightCard({
  id,
  title,
  description,
  icon,
  iconBg,
  date,
  chartComponent,
}: InsightCardProps) {
  // Determine icon background color class
  const bgColorClass = 
    iconBg === "primary" ? "bg-primary/10 text-primary" :
    iconBg === "secondary" ? "bg-secondary/10 text-secondary" :
    "bg-accent/10 text-accent";
  
  return (
    <Card className="bg-white shadow-sm border border-neutral-200 hover:border-primary transition overflow-hidden">
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${bgColorClass} rounded-md flex items-center justify-center`}>
              <i className={`fas fa-${icon}`}></i>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-neutral-500 text-sm mt-1">{description}</p>
            
            {chartComponent ? (
              <div className="mt-4 h-40 bg-neutral-100 rounded-md overflow-hidden">
                {chartComponent}
              </div>
            ) : (
              <div className="mt-4 h-40 bg-neutral-100 rounded-md flex items-center justify-center text-neutral-400">
                <span>Chart visualization</span>
              </div>
            )}
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-sm text-neutral-500">
                <i className="fas fa-calendar-alt mr-1"></i>
                <span>Generated {date}</span>
              </div>
              <Link href={`/insights/${id}`}>
                <Button variant="link" className="text-primary hover:underline text-sm font-medium p-0">
                  View Full Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
