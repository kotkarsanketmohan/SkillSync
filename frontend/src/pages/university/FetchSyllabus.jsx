import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { universityService } from '../../services/universityService';
import AIProcessingView from '../../components/university/AIProcessingView';
import { Search, Building2, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FetchSyllabus = () => {
  const navigate = useNavigate();
  const [institutionName, setInstitutionName] = useState('');
  const [department, setDepartment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiFinished, setApiFinished] = useState(false);
  const [error, setError] = useState(null);
  
  // Use a simulated timeout logic for AIProcessingView
  // In a real scenario, the backend call could stream progress or we fake progress and wait for backend.
  // Here we will just let AIProcessingView run, and call API in background.

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!institutionName.trim() || !department.trim()) {
      setError("Please provide both institution and department names.");
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      // In Demo Mode, this takes 3-4s. AIProcessingView handles visuals over 4-5s.
      await universityService.fetchSyllabus(institutionName, department);
      setApiFinished(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch syllabus.");
      setIsProcessing(false);
      setApiFinished(false);
    }
  };

  const onProcessingComplete = () => {
    // Navigate to analysis dashboard after visual pipeline completes
    navigate('/university/analysis');
  };

  if (isProcessing) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
        <AIProcessingView onComplete={onProcessingComplete} apiFinished={apiFinished} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fade-in">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-navy mb-4">Fetch Curriculum Data</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Enter your institution and department details to securely pull the official curriculum structure. Our AI will automatically analyze your syllabus against live industry job demand.
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
        
        <form onSubmit={handleFetch} className="relative z-10 space-y-6 max-w-xl mx-auto">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex gap-3 text-sm border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Institution Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. D.Y. Patil College of Engineering"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Engineering"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Search className="w-5 h-5" />
              Fetch Syllabus
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default FetchSyllabus;
