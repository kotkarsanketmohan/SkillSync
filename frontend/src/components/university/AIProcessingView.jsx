import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, BrainCircuit, Activity, LineChart, FileSearch } from 'lucide-react';

const stages = [
  { id: 1, label: "Finding Official Syllabus Source", icon: FileSearch },
  { id: 2, label: "Fetching Syllabus Data", icon: Activity },
  { id: 3, label: "Extracting Subjects & Topics", icon: FileSearch },
  { id: 4, label: "Mapping Foundational Skills", icon: BrainCircuit },
  { id: 5, label: "Analyzing Industry Requirements", icon: LineChart },
  { id: 6, label: "Computing Semantic Similarity", icon: Sparkles },
  { id: 7, label: "Identifying Critical Gaps", icon: Activity },
  { id: 8, label: "Generating Recommendations", icon: Sparkles }
];

const AIProcessingView = ({ onComplete, apiFinished = true }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (currentStageIndex < stages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIndex(prev => prev + 1);
      }, 500); // Wait 500ms per stage
      return () => clearTimeout(timer);
    } else if (currentStageIndex === stages.length - 1) {
      if (apiFinished) {
        // Wait at the last stage until API finishes, then proceed
        const finishTimer = setTimeout(() => {
          setCurrentStageIndex(prev => prev + 1);
        }, 300);
        return () => clearTimeout(finishTimer);
      }
    } else {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [currentStageIndex, onComplete, apiFinished]);

  const progressPercentage = Math.min(Math.round(((currentStageIndex + 1) / stages.length) * 100), 100);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
      {/* Background subtle glowing effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 opacity-20"></div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary"
          />
          <BrainCircuit className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-2xl font-bold text-navy mb-2">Analyzing Curriculum Context</h2>
        <p className="text-muted text-sm text-center">SkillSync AI is processing the institutional data against live industry metrics.</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Processing Pipeline</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-600 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="space-y-4 relative">
        {/* Connecting line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-100 z-0"></div>

        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = index > currentStageIndex;
          const Icon = stage.icon;

          return (
            <motion.div 
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 relative z-10"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border-2 transition-colors duration-300 ${isCompleted ? 'border-success text-success' : isCurrent ? 'border-primary text-primary' : 'border-slate-200 text-slate-400'}`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${isCompleted ? 'text-slate-700' : isCurrent ? 'text-primary' : 'text-slate-400'}`}>
                {stage.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIProcessingView;
