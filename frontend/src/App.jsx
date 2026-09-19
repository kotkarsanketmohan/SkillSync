import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleProtectedRoute } from './components/auth/ProtectedRoutes';

// Layouts
import AppShell from './components/layout/AppShell';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Common Authenticated Pages
import ProfilePage from './pages/common/ProfilePage';
import SettingsPage from './pages/common/SettingsPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CollegeSearch from './pages/student/CollegeSearch';
import CollegeAnalysis from './pages/student/CollegeAnalysis';
import StudentRegisterPage from './pages/student/StudentRegisterPage';

// University Pages
import UniversityDashboard from './pages/university/UniversityDashboard';
import FetchSyllabus from './pages/university/FetchSyllabus';
import AnalysisDashboard from './pages/university/AnalysisDashboard';
import UniversityRegisterPage from './pages/university/UniversityRegisterPage';

// Industry Pages
import IndustryDashboard from './pages/industry/IndustryDashboard';
import JobDescriptionInput from './pages/industry/JobDescriptionInput';
import IndustryRegisterPage from './pages/industry/IndustryRegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/student" element={<StudentRegisterPage />} />
          <Route path="/register/university" element={<UniversityRegisterPage />} />
          <Route path="/register/industry" element={<IndustryRegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes enclosed in AppShell */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              
              {/* Common Routes */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Student Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={['STUDENT']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/search" element={<CollegeSearch />} />
                <Route path="/student/colleges/:collegeId" element={<CollegeAnalysis />} />
              </Route>

              {/* University Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={['UNIVERSITY']} />}>
                <Route path="/university/dashboard" element={<UniversityDashboard />} />
                <Route path="/university/syllabus" element={<FetchSyllabus />} />
                <Route path="/university/analysis" element={<AnalysisDashboard />} />
              </Route>

              {/* Industry Routes */}
              <Route element={<RoleProtectedRoute allowedRoles={['INDUSTRY']} />}>
                <Route path="/industry/dashboard" element={<IndustryDashboard />} />
                <Route path="/industry/job-description" element={<JobDescriptionInput />} />
              </Route>

            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
