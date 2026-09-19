import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { SeverityBadge } from '../../ui/Badges';
import { AlertCircle, Target, ChevronRight, X, ArrowRight } from 'lucide-react';

const SkillGapsTab = () => {
  const [gaps, setGaps] = useState([]);
  const [selectedGap, setSelectedGap] = useState(null);

  useEffect(() => {
    universityService.getSkillGaps().then(setGaps);
  }, []);

  return (
    <div className="space-y-8 relative">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">Skill Gap Intelligence</h2>
        <p className="text-muted">Detailed breakdown of skills missing from your curriculum compared to industry demand.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4 font-semibold">Industry Skill</th>
              <th className="px-6 py-4 font-semibold text-right">Coverage</th>
              <th className="px-6 py-4 font-semibold text-right">Demand</th>
              <th className="px-6 py-4 font-semibold text-right">Gap</th>
              <th className="px-6 py-4 font-semibold text-center">Severity</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {gaps.map((gap, i) => (
              <motion.tr 
                key={gap.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedGap(gap)}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-bold text-navy">{gap.skill}</td>
                <td className="px-6 py-4 text-right text-slate-600">{gap.coverage}%</td>
                <td className="px-6 py-4 text-right font-medium text-slate-800">{gap.demand}%</td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-bold ${gap.gap > 50 ? 'text-danger' : gap.gap > 20 ? 'text-warning' : 'text-success'}`}>
                    {gap.gap} pts
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <SeverityBadge severity={gap.severity} />
                </td>
                <td className="px-6 py-4 text-right text-slate-400 group-hover:text-primary">
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedGap && (
          <SkillGapDrawer gap={selectedGap} onClose={() => setSelectedGap(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const SkillGapDrawer = ({ gap, onClose }) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-100 overflow-y-auto flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h3 className="text-xl font-bold text-navy">Gap Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-black text-slate-800">{gap.skill}</h2>
              <SeverityBadge severity={gap.severity} />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Coverage</div>
                <div className="text-xl font-black text-slate-700">{gap.coverage}%</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                <div className="text-xs font-bold text-blue-400 uppercase mb-1">Demand</div>
                <div className="text-xl font-black text-primary">{gap.demand}%</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                <div className="text-xs font-bold text-red-400 uppercase mb-1">Gap</div>
                <div className="text-xl font-black text-danger">{gap.gap} pts</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning" /> Why it matters
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
              {gap.why_it_matters}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Affected Job Roles
            </h4>
            <div className="flex flex-wrap gap-2">
              {gap.affected_roles.map(role => (
                <span key={role} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-sm font-semibold">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Current Related Subjects</h4>
            <ul className="space-y-2">
              {gap.affected_subjects.map(sub => (
                <li key={sub} className="flex items-center gap-2 text-sm text-slate-600 before:content-[''] before:w-1.5 before:h-1.5 before:bg-slate-300 before:rounded-full">
                  {sub}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-navy to-primary-dark p-6 rounded-xl text-white shadow-lg">
            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Recommended Action</h4>
            <p className="font-semibold text-lg flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-teal-400" />
              {gap.recommended_action}
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SkillGapsTab;
