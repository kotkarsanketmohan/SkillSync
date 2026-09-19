import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function AIProcessingView({ stages, currentStage, isComplete, title, description }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="bg-navy p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-primary via-teal to-primary opacity-20 blur-xl rounded-full animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            animate={isComplete ? {} : { rotate: 360 }}
            transition={isComplete ? {} : { repeat: Infinity, duration: 8, ease: "linear" }}
            className="mb-4 text-teal"
          >
            <Network size={48} />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">{title || "AI Processing Engine"}</h2>
          <p className="text-teal/80 text-sm">{description || "Semantic mapping in progress..."}</p>
        </div>
      </div>

      <div className="p-8">
        <div className="space-y-6">
          {stages.map((stage, idx) => {
            const isPast = currentStage > idx || isComplete;
            const isCurrent = currentStage === idx && !isComplete;
            const isFuture = currentStage < idx && !isComplete;

            return (
              <div key={idx} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-colors duration-300",
                    isPast ? "border-success text-success" : 
                    isCurrent ? "border-primary text-primary shadow-[0_0_15px_rgba(23,105,224,0.3)]" : 
                    "border-gray-200 text-gray-300"
                  )}>
                    {isPast ? <CheckCircle2 size={16} /> : isCurrent ? <Loader2 size={16} className="animate-spin" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={cn(
                      "w-0.5 h-10 transition-colors duration-500",
                      isPast ? "bg-success/50" : "bg-gray-100"
                    )} />
                  )}
                </div>
                
                <div className="pt-1 flex-1">
                  <p className={cn(
                    "text-sm font-bold transition-colors duration-300",
                    isPast ? "text-success" : isCurrent ? "text-navy" : "text-gray-400"
                  )}>{stage.title}</p>
                  <AnimatePresence>
                    {isCurrent && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-gray-500 mt-1"
                      >
                        {stage.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
