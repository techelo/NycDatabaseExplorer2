import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RiskBuilding {
  address: string;
  neighborhood: string;
  riskScore: number;
  riskLevel: string;
  openViolations: number;
  lastInspection: string;
}

interface ViolationType {
  name: string;
  percentage: number;
}

export interface AnalysisResult {
  query: string;
  findings: {
    summary: string;
    keyPoints: string[];
  };
  buildings?: RiskBuilding[];
  violationTypes?: ViolationType[];
  followUpQuestions?: string[];
}

interface AiAnalysisResultProps {
  result: AnalysisResult;
  onFollowUp: (question: string) => void;
  mapComponent?: React.ReactNode;
  chartComponents?: {
    riskBreakdown?: React.ReactNode;
    violationTypes?: React.ReactNode;
  };
}

export default function AiAnalysisResult({ 
  result, 
  onFollowUp,
  mapComponent,
  chartComponents 
}: AiAnalysisResultProps) {
  // Helper function to get risk level badge color
  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="border border-primary/20 rounded-lg bg-primary/5 p-6">
      <div className="flex items-start mb-4">
        <div className="mr-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
          <i className="fas fa-robot"></i>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Analysis Results</h3>
          <p className="text-neutral-600 text-sm">Based on DOB violations, complaints, and building characteristics</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Key Findings */}
        <div>
          <h4 className="font-medium mb-2">Key Findings</h4>
          <Card className="p-4">
            <p>{result.findings.summary}</p>
            {result.findings.keyPoints.length > 0 && (
              <ul className="list-disc ml-5 mt-2 text-neutral-700 space-y-1">
                {result.findings.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        
        {/* Map Visualization */}
        {mapComponent && (
          <div>
            <h4 className="font-medium mb-2">Geographic Distribution</h4>
            <div className="bg-neutral-800 h-64 rounded-md overflow-hidden relative">
              {mapComponent}
            </div>
          </div>
        )}
        
        {/* Risk Breakdown Chart and Violation Types */}
        {(chartComponents?.riskBreakdown || chartComponents?.violationTypes) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartComponents.riskBreakdown && (
              <div>
                <h4 className="font-medium mb-2">Risk Level Breakdown</h4>
                <Card className="p-4 h-60">
                  {chartComponents.riskBreakdown}
                </Card>
              </div>
            )}
            
            {chartComponents.violationTypes && (
              <div>
                <h4 className="font-medium mb-2">Common Violation Types</h4>
                <Card className="p-4 h-60">
                  {chartComponents.violationTypes}
                </Card>
              </div>
            )}
          </div>
        )}
        
        {/* Data Table for Buildings */}
        {result.buildings && result.buildings.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">High-Risk Buildings</h4>
              <Button variant="link" className="text-primary text-sm hover:underline p-0">
                Download CSV
              </Button>
            </div>
            <div className="bg-white rounded-md border border-neutral-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Building Address</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Neighborhood</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Risk Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Open Violations</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Inspection</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {result.buildings.map((building, index) => (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{building.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{building.neighborhood}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeColor(building.riskLevel)}`}>
                          {building.riskLevel} ({building.riskScore}/100)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{building.openViolations}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{building.lastInspection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.buildings.length > 3 && (
              <div className="mt-2 text-right">
                <Button variant="link" className="text-primary text-sm hover:underline p-0">
                  View all {result.buildings.length} buildings
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Follow-up Suggestions */}
        {result.followUpQuestions && result.followUpQuestions.length > 0 && (
          <Card className="bg-neutral-50 p-4">
            <h4 className="font-medium mb-2">Follow-up Questions</h4>
            <div className="flex flex-wrap gap-2">
              {result.followUpQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-sm bg-white text-neutral-700 hover:border-primary hover:text-primary transition"
                  onClick={() => onFollowUp(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
