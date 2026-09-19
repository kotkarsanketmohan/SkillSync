import React from 'react';
import { motion } from 'framer-motion';
import { ProgressRing, CountUp } from '../../ui/ProgressRing';
import { Book, Target, AlertCircle, Briefcase, TrendingUp, ChevronRight } from 'lucide-react';
import { TrendIndicator } from '../../ui/Badges';

const OverviewTab = ({ data }) => {
  if (!data) return null;

  const kpis = [
    { label: "Industry Skills Identified", value: data.total_industry_skills, icon: Target },
    { label: "Skills Covered", value: data.skill_coverage, icon: Book },
    { label: "Critical Skill Gaps", value: data.critical_skill_gaps, icon: AlertCircle, alert: true },
    { label: "Subjects Requiring Attention", value: data.high_priority_subjects, icon: AlertCircle },
    { label: "Job Roles Covered", value: data.job_roles_covered, icon: Briefcase },
    { label: "Placement Readiness", value: data.placement_readiness, suffix: '%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">8-Semester Program Intelligence</h2>
        <p className="text-muted">Complete B.E. Computer Engineering curriculum analysis against live industry demands.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Alignment Score */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50"></div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 text-center relative z-10">Overall Program Alignment</h3>
          <ProgressRing percentage={data.overall_alignment} size={160} strokeWidth={12} colorClass="text-primary" />
        </div>

        {/* KPI Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4 text-slate-500">
                <kpi.icon className={`w-5 h-5 ${kpi.alert ? 'text-warning' : 'text-slate-400'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{kpi.label}</span>
              </div>
              <div className="mt-auto">
                <span className={`text-3xl font-black ${kpi.alert ? 'text-warning' : 'text-navy'}`}>
                  <CountUp to={kpi.value} />{kpi.suffix || ''}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* Complete Before / After Analysis */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-center mb-10 tracking-widest text-blue-300 uppercase">Projected 8-Semester Program Optimization</h3>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 w-full max-w-5xl mx-auto">
            {/* Current */}
            <div className="flex-1 w-full p-8 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8 text-center border-b border-slate-700 pb-4">Current Curriculum</div>
              <div className="space-y-6">
                <ComparisonRow label="Overall Alignment" value={`${data.overall_alignment}%`} />
                <ComparisonRow label="Skills Covered" value={`${data.skill_coverage} / ${data.total_industry_skills}`} />
                <ComparisonRow label="Critical Gaps" value={data.critical_skill_gaps} isNegative />
                <ComparisonRow label="Job Roles Prepared" value={`${data.job_roles_covered} / 24`} />
                <ComparisonRow label="Placement Relevance" value={`${data.placement_readiness}%`} />
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex shrink-0 items-center justify-center w-12 h-12 bg-primary/20 rounded-full">
              <ChevronRight className="w-6 h-6 text-primary" />
            </div>

            {/* Projected */}
            <div className="flex-1 w-full p-8 bg-blue-900/30 rounded-2xl border border-primary/40 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-8 text-center border-b border-blue-800/50 pb-4 relative z-10">AI Proposed Curriculum</div>
              <div className="space-y-6 relative z-10">
                <ComparisonRow label="Overall Alignment" value={`${data.projected_alignment}%`} highlight trend={`+${(data.projected_alignment - data.overall_alignment).toFixed(1)}%`} />
                <ComparisonRow label="Skills Covered" value={`${data.projected_skill_coverage} / ${data.total_industry_skills}`} highlight trend={`+${data.projected_skill_coverage - data.skill_coverage}`} />
                <ComparisonRow label="Critical Gaps" value={data.projected_critical_skill_gaps} highlight trend={`-${data.critical_skill_gaps - data.projected_critical_skill_gaps}`} isNegative />
                <ComparisonRow label="Job Roles Prepared" value={`${data.projected_job_roles_covered} / 24`} highlight trend={`+${data.projected_job_roles_covered - data.job_roles_covered}`} />
                <ComparisonRow label="Placement Relevance" value={`${data.projected_placement_readiness}%`} highlight trend={`+${data.projected_placement_readiness - data.placement_readiness}%`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow = ({ label, value, highlight, trend, isNegative }) => (
  <div className="flex justify-between items-center text-sm md:text-base">
    <span className="text-slate-400 font-medium">{label}</span>
    <div className="flex items-center gap-3">
      <span className={`font-black ${highlight ? (isNegative ? 'text-teal-400' : 'text-white') : (isNegative ? 'text-orange-400' : 'text-slate-200')}`}>
        {value}
      </span>
      {trend && (
        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
          {trend}
        </span>
      )}
    </div>
  </div>
);

export default OverviewTab;
