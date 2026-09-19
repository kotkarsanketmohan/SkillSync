import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { SeverityBadge, TrendIndicator } from '../../ui/Badges';
import { BookX, CheckCircle, ArrowRight } from 'lucide-react';

const SubjectGapsTab = () => {
  const [subjectGaps, setSubjectGaps] = useState([]);

  useEffect(() => {
    universityService.getSubjectGaps().then(setSubjectGaps);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">Subject Gap Intelligence</h2>
        <p className="text-muted">Identify which existing subjects need immediate updates to align with industry standards.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {subjectGaps.map((sg, i) => (
          <motion.div 
            key={sg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{sg.subject}</h3>
                <div className="flex items-center gap-4 text-sm font-semibold">
                  <span className="text-slate-500">Current Alignment: <span className="text-navy">{sg.current_alignment}%</span></span>
                  <SeverityBadge severity={sg.severity} />
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 text-center shrink-0">
                <div className="text-xs font-bold text-slate-400 uppercase mb-1">Expected Improvement</div>
                <TrendIndicator value={sg.expected_improvement} className="text-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="text-sm font-bold text-danger uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BookX className="w-4 h-4" /> Missing / Outdated
                </h4>
                <div className="space-y-3">
                  {sg.missing_skills.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Missing Industry Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sg.missing_skills.map(skill => (
                          <span key={skill} className="px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded border border-red-100">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {sg.outdated_topics.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Outdated Topics to Reduce:</span>
                      <ul className="list-disc list-inside text-sm text-slate-600">
                        {sg.outdated_topics.map(topic => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Recommended Changes
                </h4>
                <p className="text-slate-700 font-medium flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  {sg.recommended_action}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubjectGapsTab;
