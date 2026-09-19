import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { PriorityBadge, SeverityBadge, TrendIndicator } from '../../ui/Badges';
import { Sparkles, PlusCircle, Edit3, ArrowRight, ChevronRight, X, LineChart } from 'lucide-react';

const RecommendationsTab = ({ setActiveTab, onOpenPlanner }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRec, setSelectedRec] = useState(null);

  useEffect(() => {
    universityService.getRecommendations().then(setRecommendations);
  }, []);

  return (
    <div className="space-y-8 relative">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">AI Recommendations</h2>
        <p className="text-muted">Evidence-backed actionable proposals to align your curriculum with industry standards.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((rec, i) => {
          const isNew = rec.type === 'NEW_COURSE';
          return (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedRec(rec)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-primary cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isNew ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'}`}>
                    {isNew ? <PlusCircle className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isNew ? 'text-teal-600' : 'text-blue-600'}`}>
                      {isNew ? 'New Course Proposal' : 'Modify Existing Course'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{rec.target}</h3>
                  </div>
                </div>
                <PriorityBadge priority={rec.priority} />
              </div>
              
              <p className="text-slate-600 text-sm mb-6 line-clamp-2">{rec.why}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Impact</div>
                  <div className="font-semibold text-slate-700">{rec.improvement} Alignment</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Placement Relevance</div>
                  <div className="font-semibold text-slate-700">{rec.placement_relevance}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Implementation Effort</div>
                  <div className="font-semibold text-slate-700">{rec.effort}</div>
                </div>
                <div className="flex items-center justify-end text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-bold mr-1">View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedRec && (
          <RecommendationDrawer 
            rec={selectedRec} 
            onClose={() => setSelectedRec(null)} 
            onViewPlan={() => {
                if (onOpenPlanner) {
                    onOpenPlanner(selectedRec);
                } else {
                    setActiveTab('planner');
                }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const RecommendationDrawer = ({ rec, onClose, onViewPlan }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 border-l border-slate-100 overflow-y-auto flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h3 className="text-xl font-bold text-navy flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> Recommendation Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          <div>
            <span className={`text-xs uppercase font-bold tracking-wider px-2 py-1 rounded inline-block mb-3 ${rec.type === 'NEW_COURSE' ? 'bg-teal-50 text-teal-700' : 'bg-blue-50 text-blue-700'}`}>
              {rec.type === 'NEW_COURSE' ? 'New Course' : 'Modify Course'}
            </span>
            <h2 className="text-3xl font-black text-slate-800 mb-6">{rec.target}</h2>
            
            <div className="flex gap-4">
              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Current Alignment</div>
                <div className="text-2xl font-black text-slate-700">{rec.current_coverage}%</div>
              </div>
              <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-50"></div>
                <div className="text-xs font-bold text-primary uppercase mb-1 relative z-10">Expected Alignment</div>
                <div className="text-2xl font-black text-primary relative z-10 flex items-baseline gap-2">
                  {rec.expected_alignment_after}% 
                  <span className="text-sm"><TrendIndicator value={rec.improvement} /></span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Why this recommendation?</h4>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{rec.why}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <LineChart className="w-4 h-4 text-primary" /> Industry Evidence
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{rec.evidence}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Student Benefit</h4>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{rec.student_benefit}</p>
            </div>
          </div>

          <div className="bg-navy p-6 rounded-2xl text-white mt-8 shadow-xl">
            <h4 className="text-lg font-bold mb-2">Ready to implement?</h4>
            <p className="text-slate-300 text-sm mb-6">Our AI has generated a complete proposed syllabus based on this recommendation.</p>
            <button 
              onClick={() => { onClose(); onViewPlan(); }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Open Curriculum Planner <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RecommendationsTab;
