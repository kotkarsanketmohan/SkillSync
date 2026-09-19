import api from './api';
import { industryDemoAdapter } from '../demo/adapters/industryAdapter';

const isDemo = import.meta.env.VITE_DATA_MODE !== 'api';

export const industryService = {
  getProfile: async () => {
    if (isDemo) {
      return { company_name: 'Tech Innovations Inc.', designation: 'Senior Talent Acquisition' };
    }
    const res = await api.get('/api/industry/profile');
    return res.data;
  },

  matchColleges: async (requestData) => {
    if (isDemo) {
      return industryDemoAdapter.matchColleges(requestData.job_description, requestData.required_skills);
    }
    try {
      const initRes = await api.post('/api/industry/match', requestData);
      const jobId = initRes.data.job_id;
      
      // Poll for status
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const statusRes = await api.get(`/api/industry/match/status/${jobId}`);
        
        if (statusRes.data.status === 'COMPLETED') {
          const parsedData = JSON.parse(statusRes.data.result_data);
          return {
            success: true,
            message: "Matching completed successfully.",
            results: parsedData.matches,
            provider: parsedData.provider
          };
        } else if (statusRes.data.status === 'FAILED') {
          throw new Error(statusRes.data.error_message || "Match job failed");
        }
        // If QUEUED or RUNNING, continue polling
      }
    } catch (error) {
      console.error("Error matching colleges:", error);
      throw error;
    }
  }
};
