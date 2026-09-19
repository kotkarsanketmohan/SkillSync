import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, GraduationCap, Building2, Briefcase, Network, Layers, Database, Code, ShieldCheck, PlayCircle, Star, Search, Server, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

const FloatingNode = ({ icon: Icon, label, className, delay = 0, yOffset = 20 }) => (
  <motion.div
    initial={{ opacity: 0, y: yOffset }}
    animate={{ opacity: 1, y: [0, -10, 0] }}
    transition={{ 
      opacity: { duration: 0.8, delay },
      y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay }
    }}
    className={cn("absolute flex items-center space-x-2 bg-white px-3 py-2 rounded-xl shadow-lg border border-gray-100", className)}
  >
    <div className="bg-teal/10 p-1.5 rounded-lg text-teal"><Icon size={16} /></div>
    <span className="text-xs font-semibold text-navy whitespace-nowrap">{label}</span>
  </motion.div>
);

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto relative z-50">
        <div className="flex items-center space-x-2">
          <Network className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-navy tracking-tight">SkillSync</span>
        </div>
        <div className="space-x-2 md:space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold text-navy hover:bg-navy/5">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" className="shadow-md hover:shadow-lg transition-shadow">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 z-10"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-teal/30 bg-teal/5 px-3 py-1 text-sm font-medium text-teal">
              <span className="flex h-2 w-2 rounded-full bg-teal mr-2 animate-pulse"></span>
              Education Intelligence Platform
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black text-navy leading-tight tracking-tight">
              AI-Powered <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal inline-block">Curriculum–Industry</span> <br/>
              Alignment
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg font-medium">
              Bridging what universities teach with what industry needs. Semantic career intelligence for students, academia, and enterprise.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-base group px-8 py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full font-bold">
                  Explore SkillSync
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 border-2 border-gray-200 hover:border-navy hover:bg-navy hover:text-white transition-all rounded-full font-bold">
                  Try Demo Experience
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Premium Animated Visual */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative h-[600px] w-full flex items-center justify-center lg:justify-end"
          >
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-teal/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            <div className="relative w-full max-w-[480px] h-full flex flex-col items-center justify-between py-12 z-10">
              {mounted && (
                <>
                  <FloatingNode icon={Code} label="Java" className="-left-4 top-20" delay={0.2} />
                  <FloatingNode icon={Database} label="PostgreSQL" className="-right-8 top-32" delay={0.5} yOffset={-10} />
                  <FloatingNode icon={Layers} label="Cloud Computing" className="-left-12 bottom-48" delay={0.8} />
                  <FloatingNode icon={ShieldCheck} label="Cybersecurity" className="-right-2 bottom-32" delay={1.1} yOffset={10} />
                </>
              )}

              <div className="flex flex-col items-center w-full relative">
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white border border-gray-100 shadow-xl rounded-2xl p-5 w-64 flex flex-col items-center z-20 relative overflow-hidden group hover:scale-105 transition-transform cursor-default"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="bg-primary/10 p-3 rounded-full text-primary mb-3"><GraduationCap size={24} /></div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">University Data</p>
                  <p className="font-bold text-navy">Curriculum Syllabus</p>
                </motion.div>

                <div className="h-16 w-0.5 bg-gradient-to-b from-primary via-teal to-primary relative overflow-hidden opacity-50">
                  <motion.div 
                    animate={{ y: [-64, 64] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 w-full h-8 bg-gradient-to-b from-transparent via-teal to-transparent"
                  />
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-navy text-white shadow-2xl shadow-navy/20 rounded-2xl p-6 w-72 flex flex-col items-center z-20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-teal to-primary opacity-30 blur-sm rounded-3xl animate-pulse"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <Network className="h-10 w-10 text-teal mb-2" />
                    <h3 className="font-bold text-lg tracking-wide">SkillSync AI Engine</h3>
                    <p className="text-[10px] text-teal mt-1 font-mono tracking-widest bg-teal/10 px-2 py-1 rounded">SEMANTIC_MAPPING_ACTIVE</p>
                  </div>
                </motion.div>

                <div className="h-16 w-0.5 bg-gradient-to-b from-teal via-primary to-teal relative overflow-hidden opacity-50">
                  <motion.div 
                    animate={{ y: [-64, 64] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }}
                    className="absolute inset-0 w-full h-8 bg-gradient-to-b from-transparent via-primary to-transparent"
                  />
                </div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.9 }}
                  className="bg-white border border-gray-100 shadow-xl rounded-2xl p-5 w-64 flex flex-col items-center z-20 relative overflow-hidden group hover:scale-105 transition-transform cursor-default"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="bg-warning/10 p-3 rounded-full text-warning mb-3"><Briefcase size={24} /></div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Industry Data</p>
                  <p className="font-bold text-navy">Job Requirements</p>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Three Modules Deep Dive */}
      <section className="bg-white py-32 border-t border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-black text-navy tracking-tight"
            >
              Three Stakeholders.<br/>One Unified Ecosystem.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-xl text-gray-500 font-medium leading-relaxed"
            >
              SkillSync replaces guesswork with mathematical precision. We analyze syllabi and job descriptions to find exact semantic overlaps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Student */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-900/5 flex-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap size={120} className="text-primary" />
                </div>
                <div className="w-16 h-16 bg-white shadow-sm border border-blue-100 text-primary rounded-2xl flex items-center justify-center mb-8 relative z-10">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-navy mb-4 relative z-10">Students</h3>
                <p className="text-gray-600 leading-relaxed mb-8 relative z-10 text-lg">
                  Stop choosing colleges based solely on brand name. SkillSync evaluates the actual subjects being taught against what top companies demand today. Find the curriculum that guarantees your future.
                </p>
                <div className="mt-auto relative z-10">
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-primary"/> Semantic College Search</li>
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-primary"/> Alignment Scoring</li>
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-primary"/> Identify Skill Gaps Early</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* University */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="bg-gradient-to-b from-teal-50 to-white rounded-3xl p-8 border border-teal-100 shadow-xl shadow-teal-900/5 flex-1 relative overflow-hidden group lg:-translate-y-8">
                <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                  <Building2 size={120} className="text-teal" />
                </div>
                <div className="w-16 h-16 bg-white shadow-sm border border-teal-100 text-teal rounded-2xl flex items-center justify-center mb-8 relative z-10">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-navy mb-4 relative z-10">Universities</h3>
                <p className="text-gray-600 leading-relaxed mb-8 relative z-10 text-lg">
                  Modernize your curriculum automatically. Our AI reads your current syllabus, extracts the topics, and compares them against millions of active job postings to generate actionable course modifications.
                </p>
                <div className="mt-auto relative z-10">
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-teal"/> Automated Syllabus Extraction</li>
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-teal"/> Real-time Industry Gap Analysis</li>
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-teal"/> AI Course Proposal Generation</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Industry */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col"
            >
              <div className="bg-gradient-to-b from-orange-50 to-white rounded-3xl p-8 border border-orange-100 shadow-xl shadow-orange-900/5 flex-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                  <Briefcase size={120} className="text-warning" />
                </div>
                <div className="w-16 h-16 bg-white shadow-sm border border-orange-100 text-warning rounded-2xl flex items-center justify-center mb-8 relative z-10">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold text-navy mb-4 relative z-10">Industry</h3>
                <p className="text-gray-600 leading-relaxed mb-8 relative z-10 text-lg">
                  Optimize your campus recruitment. Input your job description and let the algorithm mathematically identify which university campuses are producing graduates with the exact theoretical foundation you require.
                </p>
                <div className="mt-auto relative z-10">
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-warning"/> Deep JD Semantic Parsing</li>
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-warning"/> Targeted Campus Acquisition</li>
                    <li className="flex items-center text-sm font-medium text-navy"><CheckIcon color="text-warning"/> Reduce Graduate Onboarding Time</li>
                  </ul>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Tech Stack / AI Engine Details Section */}
      <section className="bg-navy py-24 relative overflow-hidden border-t border-navy-light">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Powered by state-of-the-art <span className="text-teal">Semantic AI</span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                We don't rely on keyword matching. SkillSync utilizes advanced Natural Language Processing to extract meaning from complex academic documents and job descriptions, storing them in high-dimensional vector databases.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-navy-light/50 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <Database className="text-teal mb-3 h-8 w-8" />
                  <h4 className="text-white font-bold mb-1">Vector Embeddings</h4>
                  <p className="text-blue-200 text-sm">Calculates cosine similarity across thousands of data points.</p>
                </div>
                <div className="bg-navy-light/50 p-5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <Search className="text-primary mb-3 h-8 w-8" />
                  <h4 className="text-white font-bold mb-1">Entity Recognition</h4>
                  <p className="text-blue-200 text-sm">Normalizes varied academic terminology into standard industry skills.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-teal/20 rounded-3xl animate-pulse blur-xl"></div>
              <div className="bg-navy-light border border-white/10 rounded-3xl p-8 h-full shadow-2xl relative z-10 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal/30 rounded-full blur-3xl"></div>
                
                <Server className="text-white/80 h-16 w-16 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Automated Data Pipeline</h3>
                <p className="text-blue-200 max-w-sm">SkillSync operates autonomously, continually pulling the latest data to ensure alignment scores are always grounded in current reality.</p>
                
                <div className="mt-8 flex items-center space-x-2 text-teal bg-teal/10 px-4 py-2 rounded-full border border-teal/20">
                  <span className="w-2 h-2 rounded-full bg-teal animate-ping"></span>
                  <span className="text-sm font-bold tracking-widest uppercase">System Online</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Network className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-navy tracking-tight">SkillSync</span>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} SkillSync Intelligence Platform. Aavishkar Project Submission.
          </div>
        </div>
      </footer>
    </div>
  );
}

const CheckIcon = ({color}) => (
  <div className={cn("mr-3 p-1 rounded-full bg-opacity-10 flex-shrink-0", color.replace('text-', 'bg-'))}>
    <svg className={cn("w-3 h-3", color)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);
