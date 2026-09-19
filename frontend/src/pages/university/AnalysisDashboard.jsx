import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { universityService } from '../../services/universityService';
import { LayoutDashboard, Book, Layers, Activity, AlertTriangle, FileWarning, Briefcase, Sparkles, PencilRuler, Grid, TrendingUp, Map, FileText } from 'lucide-react';
import AIProcessingView from '../../components/university/AIProcessingView';

// Import all tabs (we'll create these next)
import OverviewTab from '../../components/university/analysis/OverviewTab';
import SyllabusTab from '../../components/university/analysis/SyllabusTab';
import IndustryAlignmentTab from '../../components/university/analysis/IndustryAlignmentTab';
import SkillGapsTab from '../../components/university/analysis/SkillGapsTab';
import SubjectGapsTab from '../../components/university/analysis/SubjectGapsTab';
import JobRolesTab from '../../components/university/analysis/JobRolesTab';
import RecommendationsTab from '../../components/university/analysis/RecommendationsTab';
import CoursePlannerTab from '../../components/university/analysis/CoursePlannerTab';
import PlacementIntelligenceTab from '../../components/university/analysis/PlacementIntelligenceTab';
import RoadmapTab from '../../components/university/analysis/RoadmapTab';
import FeedbackReportTab from '../../components/university/analysis/FeedbackReportTab';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'syllabus', label: 'Syllabus', icon: Book },
  { id: 'industry', label: 'Industry Alignment', icon: Activity },
  { id: 'skill-gaps', label: 'Skill Gaps', icon: AlertTriangle },
  { id: 'subject-gaps', label: 'Subject Gaps', icon: FileWarning },
  { id: 'job-roles', label: 'Job Roles', icon: Briefcase },
  { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
  { id: 'planner', label: 'Curriculum Planner', icon: PencilRuler },
  { id: 'placement', label: 'Placement Intelligence', icon: TrendingUp },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'report', label: 'Feedback Report', icon: FileText },
];

const AnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [apiFinished, setApiFinished] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  // Fetch all necessary data up front for the dashboard experience
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // We fetch core analysis data first. Tabs will fetch their own specifics if needed, 
        // or we pass it down. For premium feel, passing down shared state is often smoother.
        let analysis = await universityService.getCurriculumAnalysis();
        
        if (!analysis) {
           const profile = await universityService.getProfile();
           if (profile && (profile.college_name || profile.university_name) && profile.department) {
             setIsAutoProcessing(true);
             const institutionName = profile.college_name || profile.university_name;
             setLoading(false);
             try {
               analysis = await universityService.fetchSyllabus(institutionName, profile.department);
               setApiFinished(true);
               setData({ analysis });
             } catch (err) {
               console.error("Auto fetch failed", err);
               setApiFinished(true); // Let it finish and show whatever it has or error
             }
             return;
           }
        }
        setData({ analysis });
        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const onProcessingComplete = () => {
    setIsAutoProcessing(false);
  };

  if (isAutoProcessing) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-slate-50 p-6">
        <AIProcessingView onComplete={onProcessingComplete} apiFinished={apiFinished} />
      </div>
    );
  }

  const handleOpenPlanner = (rec) => {
    setSelectedRecommendation(rec);
    setActiveTab('planner');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab data={data?.analysis} />;
      case 'syllabus': return <SyllabusTab data={data?.analysis} />;
      case 'industry': return <IndustryAlignmentTab />;
      case 'skill-gaps': return <SkillGapsTab />;
      case 'subject-gaps': return <SubjectGapsTab />;
      case 'job-roles': return <JobRolesTab />;
      case 'recommendations': return <RecommendationsTab setActiveTab={setActiveTab} onOpenPlanner={handleOpenPlanner} />;
      case 'planner': return <CoursePlannerTab selectedRecommendation={selectedRecommendation} />;
      case 'placement': return <PlacementIntelligenceTab data={data?.analysis} />;
      case 'roadmap': return <RoadmapTab />;
      case 'report': return <FeedbackReportTab />;
      default: return <OverviewTab data={data?.analysis} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Intelligence Modules</h2>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                    isActive ? 'text-primary bg-blue-50' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator" 
                      className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary" 
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
