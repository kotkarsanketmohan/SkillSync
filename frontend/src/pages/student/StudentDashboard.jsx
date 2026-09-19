import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { MapPin, Target, ArrowRight, Activity, Search, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/Skeleton';
import { MatchScore } from '../../components/ui/MatchScore';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getProfile()
      .then(data => setProfile(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const hasPreferences = profile?.branch_interest && profile?.city;
  const topMatch = profile?.history?.[0]; // Mocking history from profile for dashboard

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy">Find a curriculum aligned with your future.</h1>
          <p className="text-gray-500 mt-1">Welcome back, {currentUser?.first_name}. Here is your career intelligence overview.</p>
        </div>
        <Link to="/student/search" className="mt-4 md:mt-0">
          <Button size="lg" className="group shadow-md">
            Find My Colleges
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current Preferences</CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ) : hasPreferences ? (
                <div>
                  <div className="text-xl font-bold text-navy truncate">{profile.branch_interest}</div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    {profile.city}, {profile.state}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-lg font-medium text-gray-400">Not Set</div>
                  <Link to="/student/search" className="text-primary text-sm mt-1 inline-block hover:underline">Set Preferences →</Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-t-4 border-t-teal shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Colleges Evaluated</CardTitle>
              <Activity className="h-4 w-4 text-teal" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-16" /> : (
                <div>
                  <div className="text-3xl font-black text-navy">{profile?.history ? profile.history.length : 0}</div>
                  <p className="text-xs text-gray-500 mt-1">Total semantic matches run</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full border-t-4 border-t-warning shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Top Match</CardTitle>
              <Award className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-24" /> : topMatch ? (
                <div>
                  <MatchScore score={topMatch.score} size="md" />
                  <p className="text-xs font-medium text-navy mt-1 truncate" title={topMatch.college_name}>{topMatch.college_name}</p>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-300">--%</div>
                  <p className="text-xs text-gray-500 mt-1">No evaluations yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-8">
        {hasPreferences ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success mb-3">
                <span className="flex h-1.5 w-1.5 rounded-full bg-success mr-2"></span>
                Ready for Analysis
              </div>
              <h2 className="text-xl font-bold text-navy mb-2">We've found curricula matching {profile.branch_interest}</h2>
              <p className="text-gray-500 text-sm max-w-xl">
                SkillSync AI has mapped the current industry requirements for your branch against universities in {profile.city}. Run a new search to see the latest alignment scores.
              </p>
            </div>
            <Button onClick={() => navigate('/student/search')} className="shrink-0 bg-navy hover:bg-navy-light text-white shadow-lg">
              <Search className="mr-2 h-4 w-4" /> Run Alignment Check
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-navy to-primary/90 rounded-xl p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Target size={120} />
            </div>
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl font-bold mb-2">Stop guessing. Start matching.</h2>
              <p className="text-gray-200 mb-6 text-sm leading-relaxed">
                SkillSync AI mathematically compares what universities actually teach against what top companies demand. Find the college that gives you a head start.
              </p>
              <Button onClick={() => navigate('/student/search')} variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white font-semibold">
                Start College Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
