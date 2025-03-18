import React from "react";
import { Badge } from "@/components/ui/badge";
import { SiHuggingface } from "react-icons/si";

interface AIProviderBadgeProps {
  className?: string;
}

export default function AIProviderBadge({ className = "" }: AIProviderBadgeProps) {
  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
      <SiHuggingface className="w-3.5 h-3.5" />
      <span>Powered by Hugging Face</span>
    </Badge>
  );
}