import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { universityService } from '../../services/universityService';
import { Search, BrainCircuit, Activity, BarChart3, LineChart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const UniversityDashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    universityService.getProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 animate-fade-in">
      <div className="bg-navy rounded-3xl p-10 md:p-16 text-white relative overflow-hidden shadow-2xl mb-12">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            University Curriculum Intelligence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl"
          >
            Welcome, {profile?.university_name || 'Academic Partner'}. Analyze your current curriculum against live industry skill demand, discover critical gaps, and get AI-driven course recommendations to boost student placement readiness.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              to="/university/syllabus" 
              className="inline-flex items-center gap-3 bg-white text-navy font-bold text-lg py-4 px-8 rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Search className="w-6 h-6 text-primary" />
              Fetch New Syllabus
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy mb-6">How SkillSync AI Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BrainCircuit className="w-8 h-8 text-primary" />}
            title="Semantic Skill Matching"
            desc="Our AI extracts granular topics and skills from your syllabus and maps them to real-time industry job descriptions."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Activity className="w-8 h-8 text-teal-500" />}
            title="Gap Analysis & Prioritization"
            desc="Identify exactly which skills are missing or outdated, ranked by industry severity and placement impact."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Sparkles className="w-8 h-8 text-warning" />}
            title="Curriculum Recommendations"
            desc="Receive precise, ready-to-implement course updates and entirely new subject proposals with full CO/PO mappings."
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-muted leading-relaxed">{desc}</p>
  </motion.div>
);

export default UniversityDashboard;
