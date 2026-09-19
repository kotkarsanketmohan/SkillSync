import api from './api';
import { studentDemoAdapter } from '../demo/adapters/studentAdapter';

const isDemo = import.meta.env.VITE_DATA_MODE !== 'api';

export const studentService = {
  getProfile: async () => {
    if (isDemo) {
      return { city: 'Pune', state: 'Maharashtra', branch_interest: 'Computer Engineering' };
    }
    const res = await api.get('/api/student/profile');
    return res.data;
  },

  getBranches: async () => {
    if (isDemo) {
      return ["Computer Engineering", "Information Technology", "AI & Data Science", "Electronics"];
    }
    try {
      const res = await api.get('/api/student/branches');
      return res.data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      return [];
    }
  },

  searchColleges: async (requestData) => {
    if (isDemo) {
      // Use the first city for demo, or a default
      const cityToUse = requestData.cities && requestData.cities.length > 0 ? requestData.cities[0] : (requestData.city || 'Pune');
      return studentDemoAdapter.searchColleges(cityToUse, requestData.state, requestData.branch_interest);
    }
    try {
      const initRes = await api.post('/api/student/college-search', requestData);
      const jobId = initRes.data.job_id;
      
      // Poll for status
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusRes = await api.get(`/api/student/college-search/${jobId}/status`);
        
        if (statusRes.data.status === 'COMPLETED') {
          return statusRes.data.result;
        } else if (statusRes.data.status === 'FAILED') {
          throw new Error(statusRes.data.error || "Search job failed");
        }
        // If QUEUED or PROCESSING, continue polling
      }
    } catch (error) {
      console.error("Error searching colleges:", error);
      throw error;
    }
  },

  getCollegeAnalysis: async (collegeId) => {
    if (isDemo) {
      return studentDemoAdapter.getCollegeAnalysis(collegeId);
    }
    try {
      const res = await api.get(`/api/student/colleges/${collegeId}/analysis`);
      return res.data;
    } catch (error) {
      console.error("Error fetching college analysis:", error);
      throw error;
    }
  },

  fetchCollegeSyllabus: async (collegeId) => {
    if (isDemo) {
      // In demo mode, simulate success after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    }
    try {
      const res = await api.post(`/api/student/colleges/${collegeId}/fetch-syllabus`);
      return res.data;
    } catch (error) {
      console.error("Error fetching college syllabus:", error);
      throw error;
    }
  }
};
