import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { authDemoAdapter } from '../demo/adapters/authAdapter';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const isDemo = import.meta.env.VITE_DATA_MODE !== 'api';

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          let user;
          if (isDemo) {
            user = await authDemoAdapter.getMe();
          } else {
            const res = await api.get('/api/auth/me');
            user = res.data;
          }
          setCurrentUser(user);
          setRole(user.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to restore session", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [isDemo]);

  const login = async (email, password) => {
    try {
      let data;
      if (isDemo) {
        data = await authDemoAdapter.login(email, password);
      } else {
        const res = await api.post('/api/auth/login', { email, password });
        data = res.data;
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      // Fetch user profile
      let user;
      if (isDemo) {
        user = await authDemoAdapter.getMe();
      } else {
        // Axios interceptor will use the new token
        const userRes = await api.get('/api/auth/me');
        user = userRes.data;
      }
      
      setCurrentUser(user);
      setRole(user.role);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken && !isDemo) {
      try {
        await api.post('/api/auth/logout', { refresh_token: refreshToken });
      } catch (e) {
        console.error("Logout request failed", e);
      }
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setCurrentUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const register = async (userData, roleType) => {
    try {
      if (isDemo) {
        await authDemoAdapter.register(userData, roleType);
        // Automatically login after demo register
        return login(userData.email, userData.password);
      } else {
        await api.post(`/api/auth/register/${roleType.toLowerCase()}`, userData);
        return login(userData.email, userData.password);
      }
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    if (isDemo) {
      // Mock successful password update in demo mode
      return new Promise(resolve => setTimeout(resolve, 500));
    } else {
      await api.put('/api/auth/update-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, isAuthenticated, loading, login, logout, register, updatePassword, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};
