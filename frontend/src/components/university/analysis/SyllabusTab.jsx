import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universityService } from '../../../services/universityService';
import { Book, ChevronRight, X, Clock, Award, FileText, Settings, Layers, Calendar, ChevronDown, AlertCircle, Target } from 'lucide-react';
import { PriorityBadge } from '../../ui/Badges';

const SyllabusTab = ({ data }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState('VI');

  if (!data) return null;

  return (
    <div className="space-y-8 relative">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">8-Semester Curriculum Map</h2>
        <p className="text-muted">Explore the complete course structure and identify subjects requiring industry alignment.</p>
      </div>

      <div className="space-y-4">
        {data.semesters.map((sem, i) => {
          const isExpanded = expandedSemester === sem.id;
          const semesterSubjects = data.subjects.filter(s => s.semester === sem.id);
          
          return (
            <div key={sem.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Semester Header */}
              <div 
                onClick={() => setExpandedSemester(isExpanded ? null : sem.id)}
                className="p-6 cursor-pointer flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xl">
                    {sem.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{sem.name}</h3>
                    <div className="flex gap-4 text-xs font-semibold text-slate-500 mt-1">
                      <span>{sem.subjects_count} Subjects</span>
                      <span>{sem.credits} Credits</span>
                      <span>{sem.hours} Hours</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-slate-700">{sem.alignment}% Alignment</div>
                    {sem.gaps > 0 && <div className="text-xs text-danger font-semibold">{sem.gaps} Gaps Identified</div>}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Subjects List */}
              <AnimatePresence>
                {isExpanded && semesterSubjects.length > 0 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-t border-slate-200"
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {semesterSubjects.map(subject => (
                        <div 
                          key={subject.id}
                          onClick={() => setSelectedSubjectId(subject.id)}
                          className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-primary cursor-pointer transition-all flex flex-col h-full group"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{subject.code}</span>
                            <PriorityBadge priority={subject.priority} />
                          </div>
                          
                          <h4 className="text-base font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">{subject.name}</h4>
                          
                          <div className="mt-auto flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">{subject.credits} Credits</span>
                            <span className={`font-bold ${subject.current_alignment >= 80 ? 'text-success' : subject.current_alignment >= 60 ? 'text-warning' : 'text-danger'}`}>
                              {subject.current_alignment}% Match
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {isExpanded && semesterSubjects.length === 0 && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-slate-200">
                     <div className="p-8 text-center text-slate-500 text-sm">No subjects mocked for this semester in Demo Mode. (Try Semester V or VI)</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedSubjectId && (
          <SubjectDetailModal subjectId={selectedSubjectId} onClose={() => setSelectedSubjectId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const SubjectDetailModal = ({ subjectId, onClose }) => {
  const [subject, setSubject] = React.useState(null);

  React.useEffect(() => {
    universityService.getSubjectDetails(subjectId).then(setSubject);
  }, [subjectId]);

  if (!subject) return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={onClose}
      />
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-4 md:inset-10 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-navy p-6 md:p-8 flex items-start justify-between text-white shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-900/50 text-blue-200 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">{subject.code}</span>
              <span className="bg-blue-900/50 text-blue-200 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">Semester {subject.semester}</span>
            </div>
            <h2 className="text-3xl font-black">{subject.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 flex flex-col lg:flex-row gap-8">
          
          {/* Main Syllabus Content */}
          <div className="flex-1 space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Course Objectives</h4>
              <ul className="space-y-2">
                {subject.objectives.map((obj, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div> {obj}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-warning" /> Course Outcomes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subject.cos.map((co, i) => {
                  const [id, desc] = co.split(': ');
                  return (
                    <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="font-bold text-primary shrink-0">{id}</div>
                      <div className="text-sm text-slate-700">{desc}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers className="w-5 h-5 text-primary" /> Unit Breakdown</h4>
              <div className="space-y-4">
                {subject.units.map((unit, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Unit {unit.number}</span>
                        <h5 className="font-bold text-navy">{unit.title}</h5>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{unit.hours} hrs</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Topics</h6>
                        <div className="flex flex-wrap gap-2">
                          {unit.topics.map(t => <span key={t} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded text-xs font-medium">{t}</span>)}
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CO Mapping</span>
                          <span className="text-xs font-semibold text-primary">{unit.co_mapping.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Industry Skills</span>
                          <span className="text-xs font-semibold text-teal-600">{unit.industry_skills.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Academic Metadata Sidebar */}
          <div className="w-full lg:w-80 space-y-6 shrink-0">
            {/* AI Analysis Alert */}
            {subject.missing_skills.length > 0 && (
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                <h4 className="text-sm font-bold text-danger mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> AI Analysis Warning</h4>
                <div className="text-xs text-red-800 mb-3 font-medium">This course requires modification to meet current industry standards.</div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Missing Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {subject.missing_skills.map(s => <span key={s} className="px-2 py-0.5 bg-white text-danger border border-red-200 rounded text-[10px] font-bold">{s}</span>)}
                  </div>
                </div>
              </div>
            )}

            {/* Academic Properties */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
               <div>
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Book className="w-3 h-3"/> Prerequisites</h6>
                  <ul className="text-sm font-medium text-slate-700">
                    {subject.prerequisites.map(p => <li key={p} className="flex items-center gap-2 before:w-1 before:h-1 before:bg-primary before:rounded-full">{p}</li>)}
                  </ul>
               </div>

               <div>
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock className="w-3 h-3"/> Teaching Scheme</h6>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100"><div className="text-xs font-bold text-slate-400">TH</div><div className="font-bold text-slate-800">{subject.teaching_scheme.theory}</div></div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100"><div className="text-xs font-bold text-slate-400">PR</div><div className="font-bold text-slate-800">{subject.teaching_scheme.practical}</div></div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100"><div className="text-xs font-bold text-slate-400">TU</div><div className="font-bold text-slate-800">{subject.teaching_scheme.tutorial}</div></div>
                  </div>
               </div>

               <div>
                  <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><FileText className="w-3 h-3"/> Examination Scheme</h6>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100"><div className="text-[10px] font-bold text-slate-400">IN-SEM</div><div className="text-sm font-bold text-slate-800">{subject.examination_scheme.internal}</div></div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100"><div className="text-[10px] font-bold text-slate-400">END-SEM</div><div className="text-sm font-bold text-slate-800">{subject.examination_scheme.external}</div></div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100"><div className="text-[10px] font-bold text-slate-400">PRACTICAL</div><div className="text-sm font-bold text-slate-800">{subject.examination_scheme.practical}</div></div>
                    <div className="bg-blue-50 p-2 rounded border border-blue-100"><div className="text-[10px] font-bold text-primary">TOTAL</div><div className="text-sm font-black text-primary">{subject.examination_scheme.total}</div></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SyllabusTab;
