import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { PlusCircle, Edit3, ArrowRight, Book, Layers, Award, Clock, FileText, CheckCircle2 } from 'lucide-react';

const CoursePlannerTab = ({ selectedRecommendation }) => {
  const [coursePlan, setCoursePlan] = useState(null);
  const [mode, setMode] = useState('MODIFY_EXISTING');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If opened from a specific recommendation, use its mode
    if (selectedRecommendation) {
        setMode(selectedRecommendation.type === 'NEW_COURSE' ? 'NEW_COURSE' : 'MODIFY_EXISTING');
    }
  }, [selectedRecommendation]);

  useEffect(() => {
    loadPlan(mode, selectedRecommendation);
  }, [mode, selectedRecommendation]);

  const loadPlan = async (type, rec) => {
    setLoading(true);
    // Let service handle building the plan based on the recommendation object
    const plan = await universityService.getCoursePlan(type, rec);
    setCoursePlan(plan);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-navy mb-2">Curriculum Planner</h2>
          <p className="text-muted">Review deep AI-proposed academic structures with integrated CO/PO mapping.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setMode('MODIFY_EXISTING')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'MODIFY_EXISTING' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Modify Existing Course
          </button>
          <button 
            onClick={() => setMode('NEW_COURSE')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'NEW_COURSE' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            New Course Recommendation
          </button>
        </div>
      </div>

      {loading || !coursePlan ? (
        <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {coursePlan.type === 'MODIFY' ? <ModifyCoursePlan plan={coursePlan} /> : <NewCoursePlan plan={coursePlan} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

const ModifyCoursePlan = ({ plan }) => {
  return (
    <div>
      <div className="p-8 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Semester {plan.semester}</span>
            <span className="text-sm font-bold text-slate-400">{plan.course_code}</span>
          </div>
          <h3 className="text-2xl font-black text-navy">{plan.course_name}</h3>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Alignment</div>
            <div className="text-xl font-black text-slate-700">{plan.current_alignment}%</div>
          </div>
          <div className="bg-primary px-4 py-3 rounded-xl text-center shadow-sm shadow-primary/30">
            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Proposed Alignment</div>
            <div className="text-xl font-black text-white">{plan.proposed_alignment}%</div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Hours Change Callout */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 inline-flex">
           <Clock className="w-5 h-5 text-slate-400" />
           <div className="text-sm">
             <span className="font-semibold text-slate-600">Current Hours:</span> <span className="font-bold text-slate-800">{plan.current_hours}</span>
           </div>
           <ArrowRight className="w-4 h-4 text-slate-300" />
           <div className="text-sm">
             <span className="font-semibold text-slate-600">Proposed Hours:</span> <span className="font-bold text-slate-800">{plan.proposed_hours}</span>
           </div>
           <div className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded ml-2">({plan.hours_diff})</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Current Curriculum Analysis</h4>
            <div className="space-y-6">
              <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Topics to Retain
                </h5>
                <ul className="space-y-2">
                  {plan.retain.map(t => <li key={t} className="text-sm text-slate-700 px-3 py-2 bg-white rounded border border-slate-200">{t}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold text-danger uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger"></span> Topics to Remove/Reduce
                </h5>
                <ul className="space-y-2">
                  {plan.remove.map(t => (
                    <li key={t} className="text-sm text-red-700 px-3 py-2 bg-red-50 rounded border border-red-100 line-through opacity-70">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-6">AI Proposed Updates</h4>
            <div className="space-y-6">
              <div>
                <h5 className="text-xs font-bold text-warning uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning"></span> Topics to Update
                </h5>
                <ul className="space-y-2">
                  {plan.update.map(t => <li key={t} className="text-sm text-orange-800 px-3 py-2 bg-orange-50 rounded border border-orange-100">{t}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-bold text-success uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success"></span> Topics to Add
                </h5>
                <ul className="space-y-2">
                  {plan.add.map(t => (
                    <li key={t} className="text-sm text-green-800 px-3 py-2 bg-green-50 rounded border border-green-100 font-medium flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-green-600" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewCoursePlan = ({ plan }) => {
  return (
    <div>
      {/* Header Document Style */}
      <div className="p-8 border-b border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded uppercase tracking-wider">New Course Proposal</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">Semester {plan.semester}</span>
            </div>
            <h3 className="text-3xl font-black text-navy mb-2">{plan.course_name}</h3>
            <div className="text-slate-500 font-medium text-sm">Course Code: <span className="text-slate-800">{plan.course_code}</span> | Type: <span className="text-slate-800">{plan.course_type}</span></div>
          </div>
          <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Industry Relevance</div>
            <div className="text-lg font-black text-teal-600">Very High</div>
          </div>
        </div>

        {/* Academic Meta Data Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetaBox label="Semester" value={`Sem ${plan.semester}`} />
          <MetaBox label="Total Credits" value={plan.credits} />
          <MetaBox label="Teaching Hours" value={`${plan.teaching_scheme.total_hours} hrs/sem`} />
          <MetaBox label="Teaching Scheme" value={`TH:${plan.teaching_scheme.theory} PR:${plan.teaching_scheme.practical} TU:${plan.teaching_scheme.tutorial}`} />
          <MetaBox label="Internal Marks" value={plan.examination_scheme.internal} />
          <MetaBox label="External Marks" value={plan.examination_scheme.external} />
          <MetaBox label="Practical Marks" value={plan.examination_scheme.practical} />
          <MetaBox label="Total Marks" value={plan.examination_scheme.total} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
           <div>
             <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Book className="w-3 h-3"/> Prerequisites</h6>
             <ul className="text-sm font-medium text-slate-700">
               {plan.prerequisites.map(p => <li key={p} className="flex items-center gap-2 before:w-1 before:h-1 before:bg-primary before:rounded-full">{p}</li>)}
             </ul>
           </div>
           <div>
             <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Layers className="w-3 h-3"/> Companion Course</h6>
             <div className="text-sm font-medium text-slate-700">{plan.companion_course}</div>
           </div>
        </div>
      </div>

      {/* COs */}
      <div className="p-8 border-b border-slate-200">
        <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" /> Course Outcomes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {plan.cos.map((co, i) => {
            const [id, desc] = co.split(': ');
            return (
              <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="font-bold text-primary shrink-0">{id}</div>
                <div className="text-sm text-slate-700">{desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Detailed 6-Unit Syllabus with embedded CO/PO */}
      <div className="p-8 bg-slate-50">
        <h4 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Complete 6-Unit Syllabus Design
        </h4>
        
        <div className="space-y-6">
          {plan.units.map((unit, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                    {unit.number}
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-lg">{unit.title}</h5>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {unit.hours} Hours
                </span>
              </div>
              
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-5">
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Topics</h6>
                    <ul className="text-sm text-slate-700 space-y-1.5">
                      {unit.topics.map((t, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subtopics & Details</h6>
                    <div className="flex flex-wrap gap-2">
                      {unit.subtopics.map((t, j) => <span key={j} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-xs text-slate-600">{t}</span>)}
                    </div>
                  </div>
                  {unit.examples && (
                    <div>
                      <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Examples / Case Studies</h6>
                      <div className="text-sm text-slate-700 italic border-l-2 border-primary/30 pl-3">{unit.examples.join(', ')}</div>
                    </div>
                  )}
                </div>

                {/* Embedded CO/PO and Industry Mapping */}
                <div className="bg-blue-50/30 rounded-xl border border-blue-100 p-4 space-y-4">
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CO Mapping</h6>
                    <div className="flex flex-wrap gap-1">
                      {unit.co_mapping.map(co => <span key={co} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold text-primary">{co}</span>)}
                    </div>
                  </div>
                  <div>
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">PO Mapping</h6>
                    <div className="flex flex-wrap gap-1">
                      {unit.po_mapping.map(po => <span key={po} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600">{po}</span>)}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-blue-100">
                    <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Industry Skills Addressed</h6>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {unit.industry_skills.map(s => <span key={s} className="px-2 py-0.5 bg-teal-50 border border-teal-100 rounded text-xs font-bold text-teal-700">{s}</span>)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Relevance: <span className="text-teal-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {unit.industry_relevance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetaBox = ({ label, value }) => (
  <div className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
    <div className="font-bold text-slate-800">{value}</div>
  </div>
);

export default CoursePlannerTab;
