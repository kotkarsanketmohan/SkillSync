import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, ChevronDown, User, LogOut, Settings, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

export default function Topbar() {
  const { currentUser, role, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const isDemo = import.meta.env.VITE_DATA_MODE !== 'api';

  const roleColors = {
    STUDENT: 'bg-primary/10 text-primary border-primary/20',
    UNIVERSITY: 'bg-teal/10 text-teal border-teal/20',
    INDUSTRY: 'bg-warning/10 text-warning border-warning/20'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDummyNotifications = () => {
    if (role === 'UNIVERSITY') {
      return [
        { id: 1, title: 'Analysis Ready', message: 'B.E. Computer Engineering curriculum analysis completed.', time: '2 mins ago', unread: true },
        { id: 2, title: 'Industry Trend', message: 'Cloud Computing demand increased by 15%.', time: '1 hour ago', unread: false }
      ];
    }
    if (role === 'INDUSTRY') {
      return [
        { id: 1, title: 'Match Found', message: 'COEP Tech Univ matches 84% of your Cloud Engineer requirements.', time: '5 mins ago', unread: true }
      ];
    }
    return [
      { id: 1, title: 'Profile Update', message: 'Please complete your skills profile to get better college recommendations.', time: '1 day ago', unread: true }
    ];
  };

  const [notifications, setNotifications] = useState(getDummyNotifications());

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-all">
      <div className="flex items-center flex-1">
        <div className="relative w-96 hidden md:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
            placeholder="Search SkillSync..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isDemo && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="hidden sm:flex items-center px-2.5 py-1 rounded-md bg-navy text-xs font-medium text-white shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse mr-2"></span>
            Demo Mode Active
          </motion.div>
        )}

        <div className="relative">
          <button 
            onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-white" />}
          </button>
          
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <span className="font-bold text-navy">Notifications</span>
                  {unreadCount > 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      onClick={() => markAsRead(notif.id)}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-semibold ${notif.unread ? 'text-navy' : 'text-gray-700'}`}>{notif.title}</span>
                        <span className="text-[10px] text-gray-400">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
                <div 
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-center border-t border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <span className="text-xs font-bold text-primary">Mark all as read</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
            className="flex items-center space-x-3 focus:outline-none hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {currentUser?.first_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-navy">{currentUser?.first_name} {currentUser?.last_name}</span>
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md border mt-0.5", roleColors[role] || 'bg-gray-100 text-gray-600')}>
                {role}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
              >
                <div className="px-4 py-3">
                  <p className="text-sm">Signed in as</p>
                  <p className="text-sm font-medium text-navy truncate">{currentUser?.email}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <Edit3 className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary" />
                    Edit Profile
                  </button>
                </div>
                <div className="py-1">
                  <button onClick={handleLogout} className="group flex items-center w-full px-4 py-2 text-sm text-danger hover:bg-red-50">
                    <LogOut className="mr-3 h-4 w-4 text-danger group-hover:text-danger" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
