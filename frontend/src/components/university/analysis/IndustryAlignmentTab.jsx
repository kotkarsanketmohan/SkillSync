import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { PriorityBadge } from '../../ui/Badges';
import { Network, ArrowRight } from 'lucide-react';

const IndustryAlignmentTab = () => {
  const [alignmentData, setAlignmentData] = useState([]);

  useEffect(() => {
    universityService.getIndustryAlignment().then(setAlignmentData);
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">Industry Demand Analysis</h2>
        <p className="text-muted">Live mapping of your curriculum skills against real-time industry job requirements.</p>
      </div>

      {/* Signature Semantic Match Visualization */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8 text-blue-400">
            <Network className="w-6 h-6" />
            <h3 className="font-bold tracking-widest uppercase text-sm">Semantic Match Engine</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl gap-8">
            <NodeBox label="Current Curriculum" value="Object Oriented Programming" color="blue" delay={0.1} />
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full border-4 border-teal-500/30 flex items-center justify-center bg-teal-500/10 backdrop-blur-md relative">
                <div className="absolute inset-0 rounded-full border-t-4 border-teal-400 animate-spin" style={{ animationDuration: '3s' }}></div>
                <span className="text-2xl font-black text-teal-400">91%</span>
              </div>
              <span className="text-xs text-teal-500/70 mt-3 font-mono font-bold tracking-widest uppercase">Semantic Similarity</span>
            </motion.div>
            <NodeBox label="Industry Job Skills" value="Java OOP Development" color="teal" delay={0.3} />
          </div>
        </div>
      </div>

      {/* Tabular Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Skill Demand vs Coverage</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Skill</th>
                <th className="px-6 py-4 font-semibold text-right">Industry Demand</th>
                <th className="px-6 py-4 font-semibold text-right">Curriculum Coverage</th>
                <th className="px-6 py-4 font-semibold text-right">Gap</th>
                <th className="px-6 py-4 font-semibold text-center">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {alignmentData.map((item, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-navy">{item.skill}</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">{item.demand}%</td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">{item.coverage}%</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${item.gap > 30 ? 'text-danger' : item.gap > 10 ? 'text-warning' : 'text-success'}`}>
                      {item.gap}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <PriorityBadge priority={item.priority} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NodeBox = ({ label, value, color, delay }) => {
  const colors = {
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-100',
    teal: 'border-teal-500/30 bg-teal-500/10 text-teal-100'
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 rounded-2xl border backdrop-blur-sm w-full md:w-64 text-center ${colors[color]}`}
    >
      <div className="text-xs uppercase tracking-widest mb-3 opacity-70 font-semibold">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </motion.div>
  );
};

export default IndustryAlignmentTab;
