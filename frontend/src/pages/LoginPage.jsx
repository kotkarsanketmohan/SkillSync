import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const roleParam = searchParams.get('role');
  
  // Default to STUDENT if no role or invalid role specified
  const activeRole = ['STUDENT', 'UNIVERSITY', 'INDUSTRY'].includes(roleParam?.toUpperCase()) 
    ? roleParam.toUpperCase() 
    : 'STUDENT';

  const roleTitles = {
    STUDENT: 'Student',
    UNIVERSITY: 'University',
    INDUSTRY: 'Industry'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'UNIVERSITY') navigate('/university/dashboard');
      else if (user.role === 'INDUSTRY') navigate('/industry/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing orbs for extra depth */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 z-10">
        <Link to="/" className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">SkillSync</Link>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-panel-light border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-3xl font-bold text-navy">{roleTitles[activeRole]} Sign In</CardTitle>
            <p className="text-center text-sm font-medium text-gray-500 mt-2">Welcome back! Please enter your details.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full mt-4 text-base py-5" isLoading={isLoading}>
                Sign In
              </Button>
            </form>

            {isDemo && (
              <div className="mt-8 pt-6 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300/50"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white/50 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-full backdrop-blur-md">Quick Demo Access</span>
                </div>
                <div className="grid grid-cols-1 gap-3 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => { setEmail('student@example.com'); setPassword('student123'); }}
                    className="border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                  >
                    Demo as Student
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setEmail('university@example.com'); setPassword('university123'); }}
                    className="border-teal/40 text-teal hover:bg-teal/10 transition-colors"
                  >
                    Demo as University
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { setEmail('industry@example.com'); setPassword('industry123'); }}
                    className="border-warning/40 text-warning-dark hover:bg-warning/10 transition-colors"
                  >
                    Demo as Industry
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-8 text-center text-sm font-medium text-gray-600">
              Don't have an account?{' '}
              <Link to={`/register/${activeRole.toLowerCase()}`} className="text-primary hover:text-primary-dark hover:underline transition-colors">
                Create {roleTitles[activeRole]} Account
              </Link>
            </div>
            
            <div className="mt-6 flex justify-center items-center space-x-3 text-xs font-semibold">
              <Link to="/login?role=student" className={`px-3 py-1.5 rounded-full transition-colors ${activeRole === 'STUDENT' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}>Student</Link>
              <Link to="/login?role=university" className={`px-3 py-1.5 rounded-full transition-colors ${activeRole === 'UNIVERSITY' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}>University</Link>
              <Link to="/login?role=industry" className={`px-3 py-1.5 rounded-full transition-colors ${activeRole === 'INDUSTRY' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}>Industry</Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
