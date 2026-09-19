import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { industryService } from '../../services/industryService';
import { Building, Users, Briefcase, ArrowRight, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/Skeleton';
import { MatchScore } from '../../components/ui/MatchScore';

export default function IndustryDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    industryService.getProfile()
      .then(data => setProfile(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy">Find colleges aligned with your role requirements.</h1>
          <p className="text-gray-500 mt-1">Welcome, {currentUser?.first_name}. Stop filtering resumes. Start targeting curricula.</p>
        </div>
        <Link to="/industry/job-description" className="mt-4 md:mt-0">
          <Button size="lg" className="group shadow-md bg-warning hover:bg-warning/90 text-navy">
            Match Colleges
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
          <Card className="h-full border-t-4 border-t-navy shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Company Profile</CardTitle>
              <Building className="h-4 w-4 text-navy" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-48" /> : (
                <div className="text-xl font-bold text-navy truncate" title={profile?.company_name}>{profile?.company_name || 'Not Set'}</div>
              )}
              <p className="text-sm text-gray-500 mt-1 font-medium">{profile?.designation || 'Talent Acquisition'}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-t-4 border-t-teal shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Evaluated</CardTitle>
              <FileText className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-navy">0</div>
              <p className="text-xs text-gray-500 mt-1">JD analyzed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Matches</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-navy">0</div>
              <p className="text-xs text-gray-500 mt-1">Target institutions</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-8 bg-white border border-gray-100 rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning-dark mb-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-warning mr-2"></span>
            Talent Acquisition Engine
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Identify the best academic sources for your specific job roles.</h2>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed mb-6">
            Input your Job Description and let our AI mathematically map your required skills against thousands of university curricula. Find exactly who is teaching what you need.
          </p>
          <div className="flex space-x-4">
            <Button onClick={() => navigate('/industry/job-description')} className="bg-navy hover:bg-navy-light shadow-md">
              <Search className="mr-2 h-4 w-4" /> Start Curriculum Matching
            </Button>
          </div>
        </div>
        <div className="absolute -bottom-12 -right-12 p-8 opacity-5 pointer-events-none hidden md:block">
          <Briefcase size={250} />
        </div>
      </div>
    </div>
  );
}
