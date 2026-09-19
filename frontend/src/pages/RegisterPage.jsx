import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Building2, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="z-10 mb-12">
        <Link to="/" className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">SkillSync</Link>
      </motion.div>
      
      <div className="w-full max-w-4xl z-10">
        <AnimatePresence mode="wait">
            <motion.div key="step1" initial="hidden" animate="visible" exit="hidden" 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.15 }
                }
              }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white drop-shadow-md">Join SkillSync</h2>
                <p className="text-blue-100 font-medium mt-3 text-lg opacity-90">Select your role to embark on your journey</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <Card className="glass-panel-light h-full cursor-pointer hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group overflow-hidden border-white/40" onClick={() => navigate('/register/student')}>
                    <CardContent className="flex flex-col items-center text-center p-8 pt-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-primary/30 group-hover:-translate-y-2 transition-all duration-300">
                        <GraduationCap size={40} />
                      </div>
                      <h3 className="font-extrabold text-xl text-navy">Student</h3>
                      <p className="text-sm font-medium text-gray-600 mt-3 leading-relaxed">Discover colleges that perfectly match current industry demands.</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <Card className="glass-panel-light h-full cursor-pointer hover:border-teal/50 hover:shadow-2xl hover:shadow-teal/20 transition-all duration-300 group overflow-hidden border-white/40" onClick={() => navigate('/register/university')}>
                    <CardContent className="flex flex-col items-center text-center p-8 pt-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-50 text-teal rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-teal/30 group-hover:-translate-y-2 transition-all duration-300">
                        <Building2 size={40} />
                      </div>
                      <h3 className="font-extrabold text-xl text-navy">University</h3>
                      <p className="text-sm font-medium text-gray-600 mt-3 leading-relaxed">Analyze curriculum skill gaps and align with the market.</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <Card className="glass-panel-light h-full cursor-pointer hover:border-warning/50 hover:shadow-2xl hover:shadow-warning/20 transition-all duration-300 group overflow-hidden border-white/40" onClick={() => navigate('/register/industry')}>
                    <CardContent className="flex flex-col items-center text-center p-8 pt-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 text-warning-dark rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-warning/30 group-hover:-translate-y-2 transition-all duration-300">
                        <Briefcase size={40} />
                      </div>
                      <h3 className="font-extrabold text-xl text-navy">Industry</h3>
                      <p className="text-sm font-medium text-gray-600 mt-3 leading-relaxed">Find verified academic talent aligned with your specific roles.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="mt-12 text-center text-sm font-semibold text-white/80">
                Already have an account? <Link to="/login" className="text-white hover:text-teal-200 hover:underline transition-colors ml-1">Sign in here</Link>
              </div>
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
