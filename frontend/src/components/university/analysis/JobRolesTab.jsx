import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { Briefcase, Target, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { TrendIndicator } from '../../ui/Badges';

const JobRolesTab = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    universityService.getJobRoles().then(setRoles);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">Job Role Intelligence</h2>
        <p className="text-muted">Analyze how well your curriculum prepares students for specific industry roles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedRole(role)}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-primary cursor-pointer transition-all flex flex-col h-full group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className={`text-2xl font-black ${role.current_match >= 70 ? 'text-success' : role.current_match >= 50 ? 'text-warning' : 'text-danger'}`}>
                  {role.current_match}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Match</div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-4">{role.role}</h3>
            
            <div className="mt-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Required Skills</span>
                <span className="font-semibold">{role.required_skills.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Missing Skills</span>
                <span className="font-semibold text-danger">{role.missing_skills.length}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500">Projected Match</span>
              <span className="text-sm font-bold text-primary flex items-center gap-1">
                {role.projected_match}% <TrendIndicator value={`+${role.projected_match - role.current_match}%`} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedRole && (
          <JobRoleDrawer role={selectedRole} onClose={() => setSelectedRole(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

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
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 border-l border-slate-100 overflow-y-auto flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <h3 className="text-xl font-bold text-navy flex items-center gap-2"><Briefcase className="w-5 h-5"/> Role Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-6">{role.role}</h2>
            
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Current Match</div>
                <div className={`text-2xl font-black ${role.current_match >= 70 ? 'text-success' : 'text-warning'}`}>{role.current_match}%</div>
              </div>
              <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="text-xs font-bold text-blue-400 uppercase mb-1">Projected</div>
                <div className="text-2xl font-black text-primary">{role.projected_match}%</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" /> Covered Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {role.covered_skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-danger" /> Missing Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {role.missing_skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Path to 100%
            </h4>
            <p className="text-sm text-slate-600">
              Implementing the AI recommendations in the <span className="font-bold text-slate-800">Curriculum Planner</span> will automatically address these missing skills and bring the alignment score to {role.projected_match}%.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default JobRolesTab;
