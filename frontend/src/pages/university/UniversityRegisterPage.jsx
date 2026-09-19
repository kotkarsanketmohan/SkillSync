import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X, GraduationCap, Building2 } from 'lucide-react';

export default function UniversityRegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', mobile_number: '', 
    password: '', confirm_password: '',
    university_name: '', college_name: '', department: '', designation: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validation states for password
  const passValidations = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passValidations).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile_number)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        password: formData.password,
        role: 'UNIVERSITY',
        profile: {
          university_name: formData.university_name,
          college_name: formData.college_name,
          department: formData.department,
          designation: formData.designation
        }
      };

      await api.post('/api/auth/register/university', payload);
      
      setSuccess(true);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && typeof detail === 'string' && detail.toLowerCase().includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(detail || err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-t-4 border-t-primary text-center">
          <CardContent className="p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-2">Account created successfully</h2>
            <p className="text-gray-600 mb-8">You can now sign in to your new account.</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg flex flex-col lg:flex-row relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-teal/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Left Side Branding */}
      <div className="hidden lg:flex lg:w-[40%] text-white flex-col justify-between p-12 z-10 glass-panel border-y-0 border-l-0 border-r-white/10 rounded-none shadow-2xl">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="text-4xl font-extrabold tracking-tight mb-8 block hover:text-gray-200 transition-colors drop-shadow-lg">SkillSync</Link>
          <div className="mt-24">
            <h1 className="text-5xl font-extrabold leading-tight mb-8 drop-shadow-md">Build your academic-to-industry journey</h1>
            <p className="text-blue-100 text-xl font-medium leading-relaxed opacity-90">
              Discover colleges that align with current industry demands. Identify skill gaps, explore curriculum matches, and make data-driven academic decisions.
            </p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center space-x-4 opacity-90">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm"><Building2 size={36} className="text-teal-300" /></div>
          <span className="font-bold text-2xl tracking-wide">University Portal</span>
        </motion.div>
      </div>

      {/* Right Side Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 lg:px-12 overflow-y-auto z-10">
        <div className="w-full max-w-2xl">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">SkillSync</Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <Card className="glass-panel-light border-0 shadow-2xl rounded-2xl">
              <CardHeader className="border-b border-gray-200/50 pb-6 mb-6">
                <CardTitle className="text-3xl font-extrabold text-navy">Create University Account</CardTitle>
                <p className="text-gray-500 font-medium mt-2">Enter your institutional details to register.</p>
              </CardHeader>
              <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-navy border-b pb-2 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <Input label="Mobile Number" type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleChange} required maxLength={10} placeholder="10-digit number" />
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-navy border-b pb-2 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="University Name" name="university_name" value={formData.university_name} onChange={handleChange} required />
                    <Input label="College Name" name="college_name" value={formData.college_name} onChange={handleChange} required />
                    <Input label="Department" name="department" value={formData.department} onChange={handleChange} required />
                    <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} required placeholder="e.g. HOD / Professor" />
                  </div>
                </div>



                {/* Account Security */}
                <div>
                  <h3 className="text-lg font-semibold text-navy border-b pb-2 mb-4">Account Security</h3>
                  <div className="grid grid-cols-1 gap-4">
                    
                    <div className="relative">
                      <Input 
                        label="Password" 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
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

                    {/* Password Requirements Checklist */}
                    {formData.password.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-md text-xs grid grid-cols-2 gap-2">
                        <div className={`flex items-center ${passValidations.length ? 'text-green-600' : 'text-gray-500'}`}>
                          {passValidations.length ? <Check size={14} className="mr-1"/> : <X size={14} className="mr-1"/>} At least 8 chars
                        </div>
                        <div className={`flex items-center ${passValidations.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passValidations.uppercase ? <Check size={14} className="mr-1"/> : <X size={14} className="mr-1"/>} Uppercase letter
                        </div>
                        <div className={`flex items-center ${passValidations.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                          {passValidations.lowercase ? <Check size={14} className="mr-1"/> : <X size={14} className="mr-1"/>} Lowercase letter
                        </div>
                        <div className={`flex items-center ${passValidations.number ? 'text-green-600' : 'text-gray-500'}`}>
                          {passValidations.number ? <Check size={14} className="mr-1"/> : <X size={14} className="mr-1"/>} Number
                        </div>
                        <div className={`flex items-center ${passValidations.special ? 'text-green-600' : 'text-gray-500'}`}>
                          {passValidations.special ? <Check size={14} className="mr-1"/> : <X size={14} className="mr-1"/>} Special character
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <Input 
                        label="Confirm Password" 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirm_password" 
                        value={formData.confirm_password} 
                        onChange={handleChange} 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm text-center">
                    {error}
                  </div>
                )}
                {error === 'An account with this email already exists. Please sign in instead.' && (
                  <div className="text-center">
                    <Link to="/login" className="text-primary hover:underline font-semibold">Go to Login</Link>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg mt-8 rounded-xl shadow-lg" 
                  isLoading={isLoading}
                  disabled={isLoading || (formData.password.length > 0 && !isPasswordValid)}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="mt-8 text-center text-sm font-medium text-gray-600">
                  Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark hover:underline transition-colors ml-1">Sign in instead</Link>
                </div>
              </form>
            </CardContent>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
