import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { CountUp } from '../../ui/ProgressRing';
import { TrendIndicator } from '../../ui/Badges';
import { Filter, ChevronRight, X, ShieldCheck, ArrowRight, TrendingUp, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';

const PlacementIntelligenceTab = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    universityService.getJobRoles().then(setJobRoles);
  }, []);

  return (
    <div className="space-y-8 relative">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">Placement Intelligence & Action Funnel</h2>
        <p className="text-muted">Analyze how the 8-semester curriculum prepares students for specific industry roles and identify actionable interventions.</p>
      </div>

      {/* Placement Skill Funnel Visualization */}
      <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-xl border border-slate-800 text-white flex flex-col md:flex-row items-center gap-4 justify-between">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
         
         <div className="relative z-10 w-full md:w-1/3">
            <h3 className="text-lg font-bold mb-2">The Placement Funnel</h3>
            <p className="text-sm text-slate-400">Tracking skill attrition from industry demand to actual student readiness across 8 semesters.</p>
         </div>

         <div className="relative z-10 flex-1 flex flex-col md:flex-row justify-between items-center gap-2 w-full">
            <FunnelStep label="Industry Skills" value={146} color="bg-slate-700" text="text-white" />
            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
            <FunnelStep label="Covered" value={104} color="bg-blue-900/50" text="text-blue-200" />
            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
            <FunnelStep label="Partial" value={27} color="bg-orange-900/30" text="text-orange-300" />
            <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block" />
            <FunnelStep label="Missing" value={15} color="bg-red-900/40" text="text-red-300" border="border border-red-500/30" />
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Job Role Readiness</h3>
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filter Roles
          </button>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <th className="px-6 py-4 font-semibold">Job Role</th>
              <th className="px-6 py-4 font-semibold text-center">Required Skills</th>
              <th className="px-6 py-4 font-semibold text-center">Missing</th>
              <th className="px-6 py-4 font-semibold text-right">Current Match</th>
              <th className="px-6 py-4 font-semibold text-right">Projected Match</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {jobRoles.map((role, i) => (
              <motion.tr 
                key={role.role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedRole(role)}
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 font-bold text-navy">{role.role}</td>
                <td className="px-6 py-4 text-center font-medium text-slate-600">{role.required_skills.length}</td>
                <td className="px-6 py-4 text-center text-danger font-bold">{role.missing_skills.length}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-black ${role.current_match >= 70 ? 'text-success' : role.current_match >= 50 ? 'text-warning' : 'text-danger'}`}>
                    {role.current_match}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-black text-primary flex items-center justify-end gap-2">
                    {role.projected_match}% <TrendIndicator value={`+${role.projected_match - role.current_match}%`} />
                  </span>
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
        {selectedRole && (
          <JobRoleDrawer role={selectedRole} onClose={() => setSelectedRole(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const FunnelStep = ({ label, value, color, text, border = "" }) => (
  <div className={`p-4 rounded-xl text-center flex-1 ${color} ${border}`}>
    <div className={`text-2xl font-black ${text}`}>{value}</div>
    <div className={`text-[10px] uppercase font-bold tracking-wider opacity-80 ${text}`}>{label}</div>
  </div>
);

const JobRoleDrawer = ({ role, onClose }) => {
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
          <h3 className="text-xl font-bold text-navy">Placement Intelligence</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-6">{role.role}</h2>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Current Match</div>
                <div className={`text-3xl font-black ${role.current_match >= 70 ? 'text-success' : 'text-danger'}`}>{role.current_match}%</div>
              </div>
              <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                <div className="text-xs font-bold text-primary uppercase mb-1">Projected Match</div>
                <div className="text-3xl font-black text-primary flex items-center justify-center gap-2">
                  {role.projected_match}% <TrendIndicator value={`+${role.projected_match - role.current_match}%`} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" /> Covered Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {role.covered_skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>

            {role.partial_skills.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-warning" /> Partially Covered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.partial_skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger" /> Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {role.missing_skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl mt-8 relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
             <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-4 relative z-10">Recommended Curriculum Action</h4>
             <div className="flex items-start gap-3 relative z-10">
               <ShieldCheck className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
               <p className="text-base font-medium leading-relaxed">{role.action}</p>
             </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PlacementIntelligenceTab;
