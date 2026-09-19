import React from 'react';
import { motion } from 'framer-motion';

export function SemanticMatchVisualization({ matchedSkills = [], matchScore = 0 }) {
  // Use up to 5 top skills for the visualization
  const displaySkills = matchedSkills.slice(0, 5);

  if (displaySkills.length === 0) {
    return (
      <div className="w-full bg-background rounded-xl p-8 flex flex-col items-center justify-center border border-gray-100 text-gray-500 text-sm">
        Not enough semantic match data available for visualization.
      </div>
    );
  }

  return (
    <div className="w-full bg-background rounded-xl p-8 flex flex-col items-center overflow-hidden border border-gray-100">
      <div className="flex justify-between w-full max-w-4xl relative">
        
        {/* Connection Lines Background */}
        <div className="absolute inset-0 top-6 bottom-6 flex items-center justify-center pointer-events-none opacity-30">
          <svg width="100%" height="100%" className="overflow-visible">
            {displaySkills.map((skillMatch, idx) => {
              const yPos = `${(idx * (100 / displaySkills.length)) + (50 / displaySkills.length)}%`;
              return (
                <motion.g key={idx}>
                  <motion.line 
                    x1="25%" y1={yPos} 
                    x2="75%" y2={yPos} 
                    stroke="var(--color-primary)" 
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1) }}
                  />
                  {/* Similarity Badge on Line */}
                  <motion.text
                    x="50%" y={`calc(${yPos} - 10px)`}
                    textAnchor="middle"
                    fill="var(--color-teal)"
                    fontSize="11"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 + (idx * 0.1) }}
                  >
                    {skillMatch.similarity ? `${(skillMatch.similarity * 100).toFixed(0)}% Match` : 'Match'}
                  </motion.text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Left Column - Curriculum */}
        <div className="w-[30%] flex flex-col items-end space-y-8 z-10">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Curriculum Skill</h4>
          {displaySkills.map((skillMatch, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-navy w-full text-right h-12 flex items-center justify-end"
            >
              <span className="truncate" title={skillMatch.curriculum_skill}>{skillMatch.curriculum_skill || 'Not available'}</span>
            </motion.div>
          ))}
        </div>

        {/* Center - Alignment Core */}
        <div className="w-[40%] flex flex-col items-center justify-center z-20">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 1 }}
            className="w-24 h-24 bg-navy rounded-full flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(11,31,58,0.3)] relative"
          >
            <div className="absolute inset-0 rounded-full border border-teal/50 animate-ping opacity-20"></div>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-teal">{matchScore.toFixed(1)}%</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Match Score</span>
          </motion.div>
        </div>

        {/* Right Column - Industry */}
        <div className="w-[30%] flex flex-col items-start space-y-8 z-10">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Industry Requirement</h4>
          {displaySkills.map((skillMatch, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="px-4 py-2 bg-navy text-white rounded-lg shadow-sm text-sm font-medium w-full text-left h-12 flex items-center justify-start"
            >
              <span className="truncate" title={skillMatch.industry_skill}>{skillMatch.industry_skill || 'Not available'}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
