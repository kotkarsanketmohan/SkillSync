import React from 'react';
import { Book, PlusCircle, Edit3, ShieldAlert, ArrowDown } from 'lucide-react';
import { PriorityBadge } from '../../ui/Badges';

const RoadmapTab = () => {
  // We'll mock the 8-semester grid for the demo visualization
  const roadmapData = [
    { year: 1, semesters: [
      { id: "I", current: "Programming Fundamentals", recommended: null },
      { id: "II", current: "Advanced Programming", recommended: null }
    ]},
    { year: 2, semesters: [
      { id: "III", current: "Data Structures", recommended: null },
      { id: "IV", current: "Algorithms", recommended: null }
    ]},
    { year: 3, semesters: [
      { 
        id: "V", 
        current: "Web Technologies, Computer Networks, OS", 
        recommended: { type: "MODIFY", name: "Update Web Tech (Add REST APIs)", priority: "High", impact: "High" }
      },
      { 
        id: "VI", 
        current: "Distributed Systems, Software Eng.", 
        recommended: { type: "NEW", name: "Introduce Cloud Computing", priority: "High", impact: "Very High", prereq: "Networks, OS (Sem V)" }
      }
    ]},
    { year: 4, semesters: [
      { 
        id: "VII", 
        current: "Elective I, System Design", 
        recommended: { type: "NEW", name: "Add DevOps & CI/CD", priority: "Medium", impact: "High", prereq: "Cloud Computing (Sem VI)" }
      },
      { 
        id: "VIII", 
        current: "Industry Project", 
        recommended: null 
      }
    ]}
  ];

  return (
    <div className="space-y-8 relative">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">4-Year Curriculum Roadmap</h2>
        <p className="text-muted">Strategic 8-semester rollout plan combining current foundations with AI-recommended industry interventions.</p>
      </div>

      <div className="space-y-12">
        {roadmapData.map((year, yIdx) => (
          <div key={yIdx} className="relative">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-sm">{year.year}</span>
              YEAR {year.year}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 md:pl-12">
              {year.semesters.map((sem, sIdx) => (
                <div key={sIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-primary transition-colors">
                   <div className="absolute -top-3 left-6 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase">
                     Semester {sem.id}
                   </div>

                   <div className="mt-4 space-y-4">
                      <div>
                        <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <Book className="w-3 h-3" /> Current Focus
                        </h6>
                        <p className="text-sm font-medium text-slate-700">{sem.current}</p>
                      </div>

                      {sem.recommended && (
                        <div className={`p-4 rounded-xl border ${sem.recommended.type === 'NEW' ? 'bg-teal-50 border-teal-100' : 'bg-blue-50 border-blue-100'}`}>
                           <div className="flex justify-between items-start mb-2">
                             <span className={`text-[10px] font-bold uppercase tracking-wider ${sem.recommended.type === 'NEW' ? 'text-teal-700' : 'text-blue-700'}`}>
                               {sem.recommended.type === 'NEW' ? 'New Course Recommended' : 'Modification Recommended'}
                             </span>
                             <PriorityBadge priority={sem.recommended.priority} />
                           </div>
                           
                           <h5 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                             {sem.recommended.type === 'NEW' ? <PlusCircle className="w-4 h-4 text-teal-600" /> : <Edit3 className="w-4 h-4 text-blue-600" />}
                             {sem.recommended.name}
                           </h5>

                           <div className="space-y-2 text-xs font-medium">
                              {sem.recommended.prereq && (
                                <div className="flex items-start gap-2 text-slate-600">
                                  <span className="text-slate-400 font-bold uppercase w-16 shrink-0">Prereq:</span>
                                  <span>{sem.recommended.prereq}</span>
                                </div>
                              )}
                              <div className="flex items-start gap-2 text-slate-600">
                                <span className="text-slate-400 font-bold uppercase w-16 shrink-0">Impact:</span>
                                <span className="text-primary font-bold">{sem.recommended.impact}</span>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>

            {/* Vertical connector line between years */}
            {yIdx < roadmapData.length - 1 && (
              <div className="absolute left-4 top-14 bottom-[-48px] w-0.5 bg-slate-200">
                 <ArrowDown className="absolute -bottom-2 -left-1.5 w-3 h-3 text-slate-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapTab;
