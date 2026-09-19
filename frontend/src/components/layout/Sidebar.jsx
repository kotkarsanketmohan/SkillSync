import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, SearchCheck, BookOpen, BarChart2, Briefcase, FileText, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'College Search', path: '/student/search', icon: SearchCheck },
        ];
      case 'UNIVERSITY':
        return [
          { name: 'Dashboard', path: '/university/dashboard', icon: LayoutDashboard },
          { name: 'Fetch Syllabus', path: '/university/syllabus', icon: BookOpen },
          { name: 'Curriculum Analysis', path: '/university/analysis', icon: BarChart2 },
        ];
      case 'INDUSTRY':
        return [
          { name: 'Dashboard', path: '/industry/dashboard', icon: LayoutDashboard },
          { name: 'Target Colleges', path: '/industry/job-description', icon: Briefcase },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const commonItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-navy text-white flex flex-col h-screen fixed shadow-2xl z-40">
      <div className="h-16 flex items-center px-6 border-b border-navy-light/50 bg-navy">
        <span className="text-xl font-bold tracking-tight text-white flex items-center">
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} className="mr-2 text-teal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
          </motion.div>
          SkillSync
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        
        <div>
          <p className="px-2 text-xs font-semibold text-teal uppercase tracking-wider mb-3">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all relative overflow-hidden group ${
                    isActive
                      ? 'text-white bg-primary/20 shadow-[inset_2px_0_0_0_var(--color-primary)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-primary/10 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`mr-3 h-5 w-5 transition-colors z-10 ${isActive ? 'text-primary' : 'group-hover:text-gray-300'}`} />
                    <span className="z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preferences</p>
          <nav className="space-y-1">
            {commonItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all relative overflow-hidden group ${
                    isActive
                      ? 'text-white bg-white/10 shadow-[inset_2px_0_0_0_var(--color-teal)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-white/5 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`mr-3 h-5 w-5 transition-colors z-10 ${isActive ? 'text-teal' : 'group-hover:text-gray-300'}`} />
                    <span className="z-10">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-navy-light/50">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-400 rounded-lg hover:text-white hover:bg-white/5 transition-all group"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:text-danger transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );
}
