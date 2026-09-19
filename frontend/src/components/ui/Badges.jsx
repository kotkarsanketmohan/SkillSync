import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const SeverityBadge = ({ severity, className }) => {
  const map = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium: "bg-orange-50 text-orange-700 border-orange-200",
    Low: "bg-green-50 text-green-700 border-green-200"
  };
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border", map[severity] || map.Medium, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", 
        severity === 'High' ? 'bg-red-500' : 
        severity === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
      )} />
      {severity}
    </span>
  );
};

export const PriorityBadge = ({ priority, className }) => {
  return <SeverityBadge severity={priority} className={className} />;
};

export const SkillChip = ({ children, relevance, className }) => {
  const isHigh = relevance === 'High';
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
      isHigh ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-700 border-slate-200",
      className
    )}>
      {children}
    </span>
  );
};

export const TrendIndicator = ({ value, className }) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue) || numValue === 0) {
    return (
      <span className={cn("inline-flex items-center text-slate-500 text-sm font-medium", className)}>
        <Minus className="w-4 h-4 mr-1" /> {value}
      </span>
    );
  }
  const isPositive = numValue > 0;
  return (
    <span className={cn("inline-flex items-center text-sm font-bold", isPositive ? "text-success" : "text-danger", className)}>
      {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
      {isPositive ? '+' : ''}{value}
    </span>
  );
};
