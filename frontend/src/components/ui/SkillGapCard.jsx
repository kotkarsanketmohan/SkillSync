import React from 'react';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';

export function SkillGapCard({ skill, type }) {
  // type: 'MATCHED', 'PARTIAL', 'GAP'
  
  const getStyling = () => {
    switch(type) {
      case 'MATCHED':
        return { border: 'border-success/30', bg: 'bg-success/5', badge: 'success', label: 'Matched' };
      case 'PARTIAL':
        return { border: 'border-warning/30', bg: 'bg-warning/5', badge: 'warning', label: 'Partial Match' };
      case 'GAP':
        return { border: 'border-danger/30', bg: 'bg-danger/5', badge: 'danger', label: 'Skill Gap' };
      default:
        return { border: 'border-gray-200', bg: 'bg-white', badge: 'neutral', label: 'Unknown' };
    }
  };

  const style = getStyling();
  
  return (
    <Card className={`${style.border} ${style.bg} shadow-sm h-full`}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-bold text-navy truncate flex-1" title={skill.industry_skill}>
            {skill.industry_skill || 'Not available'}
          </h4>
          <Badge variant={style.badge} className="ml-2 shrink-0">{style.label}</Badge>
        </div>
        
        <div className="space-y-2 mt-auto text-sm text-gray-600">
          {type !== 'GAP' && (
            <div className="flex justify-between border-b border-gray-200/50 pb-1">
              <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">Curriculum Skill</span>
              <span className="truncate ml-2 text-right" title={skill.curriculum_skill}>
                {skill.curriculum_skill || 'Not available'}
              </span>
            </div>
          )}
          
          <div className="flex justify-between border-b border-gray-200/50 pb-1">
            <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">Similarity</span>
            <span>{skill.similarity ? `${(skill.similarity * 100).toFixed(0)}%` : 'Not available'}</span>
          </div>
          
          <div className="flex justify-between pb-1">
            <span className="font-medium text-gray-500 text-xs uppercase tracking-wider">Industry Demand</span>
            <span>{skill.demand ? `${skill.demand.toFixed(1)}%` : 'Not available'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
