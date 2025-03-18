import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AI_SUGGESTIONS } from "@/lib/constants";

interface AiQueryInputProps {
  onAnalyze: (query: string) => void;
  isLoading?: boolean;
}

export default function AiQueryInput({ onAnalyze, isLoading = false }: AiQueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onAnalyze(query);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onAnalyze(suggestion);
  };

  return (
    <div className="border border-neutral-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary mb-6">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex-shrink-0 p-2">
          <i className="fas fa-robot text-[#F72585]"></i>
        </div>
        <Input
          className="flex-1 p-2 focus:outline-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Ask a question about NYC housing data..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit" 
          className="flex-shrink-0 bg-primary text-white hover:bg-primary/90"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze'
          )}
        </Button>
      </form>
      
      <div className="flex flex-wrap gap-2 pt-2 px-2 border-t border-neutral-200 mt-2">
        {AI_SUGGESTIONS.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="text-xs bg-neutral-100 text-neutral-600 cursor-pointer hover:bg-neutral-200"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </div>
  );
}
