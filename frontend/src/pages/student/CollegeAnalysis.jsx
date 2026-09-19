import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MatchScore } from '../../components/ui/MatchScore';
import { ArrowLeft, MapPin, Building, BookOpen, LayoutDashboard, Target, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CollegeAnalysis() {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAiResearchMode = collegeId?.startsWith('ai-research');

  useEffect(() => {
    if (isAiResearchMode) {
      if (location.state?.collegeData) {
        setData(location.state.collegeData);
        setLoading(false);
      } else {
        setError("AI Research data lost. Please perform the search again.");
        setLoading(false);
      }
      return;
    }

    // Legacy Mode Database Fetch
    let mounted = true;
    async function loadAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const result = await studentService.getCollegeAnalysis(collegeId);
        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError("College analysis could not be found.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadAnalysis();
    return () => { mounted = false; };
  }, [collegeId, isAiResearchMode, location.state]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading college curriculum analysis...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
        </Button>
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-8 text-center">
          <Target className="mx-auto h-12 w-12 text-danger mb-4 opacity-80" />
          <h2 className="text-xl font-bold text-danger mb-2">Analysis Unavailable</h2>
          <p className="text-danger/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-navy">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <div className="flex items-center text-sm font-medium text-gray-500 mb-3 space-x-4">
            <span className="flex items-center"><Building size={16} className="mr-1.5"/> {data.university || "Independent Institution"}</span>
            <span className="flex items-center"><MapPin size={16} className="mr-1.5"/> {data.city || data.location}, {data.state}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-navy leading-tight">{data.college_name}</h1>
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-semibold border border-blue-100">
            <BookOpen size={14} className="mr-2" /> {data.branch || data.department}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-gray-100 text-center shrink-0 min-w-[200px]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Curriculum–Industry Match</p>
          <MatchScore score={data.curriculum_industry_match_score || data.matching_score || 0} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overview Column */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="h-full shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-lg flex items-center">
                <LayoutDashboard size={18} className="mr-2 text-primary" /> 
                Curriculum Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {data.curriculum_summary || data.curriculum_overview || "No overview available."}
                </p>
              </div>
              
              {data.explanation && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">AI Alignment Rationale</h4>
                  <p className="text-sm text-gray-600 italic border-l-2 border-primary pl-3 py-1">{data.explanation}</p>
                </div>
              )}

              {data.major_subjects?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Major Subjects</h4>
                  <ul className="space-y-2">
                    {data.major_subjects.map((sub, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-teal mr-2 mt-0.5">•</span> {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.relevant_job_roles?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <Briefcase size={14} className="mr-2" /> Target Job Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.relevant_job_roles.map((role, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded shadow-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Industry Alignment Detail */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-lg flex items-center">
                <Target size={18} className="mr-2 text-teal" /> 
                Skill Alignment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              
              {/* Matched */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-success uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Matched Skills ({data.matched_skills?.length || 0})
                </h3>
                {data.matched_skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {data.matched_skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-success/10 text-success-dark border border-success/20 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No strong matches found.</p>
                )}
              </div>

              {/* Gaps */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-danger uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Identified Skill Gaps ({data.skill_gaps?.length || data.potential_gaps?.length || 0})
                </h3>
                {(data.skill_gaps || data.potential_gaps)?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {(data.skill_gaps || data.potential_gaps).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-danger/10 text-danger border border-danger/20 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No significant gaps identified.</p>
                )}
              </div>

              {/* Curriculum vs Industry Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Taught in Curriculum</h3>
                    <ul className="space-y-1">
                      {data.curriculum_skills?.map((skill, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2"></div> {skill}
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Demanded by Industry</h3>
                    <ul className="space-y-1">
                      {data.industry_skills?.map((skill, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mr-2"></div> {skill}
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
