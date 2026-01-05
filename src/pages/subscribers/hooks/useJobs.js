// Custom Hook for Jobs (for email sending)
import { useState, useEffect } from 'react';
import jobService from '../../../api/services/job.service';

/**
 * Custom hook for fetching jobs for email sending
 * @returns {Object} Jobs state
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const jobsData = await jobService.getAllJobs({ all: true });
        
        // Ensure jobs is always an array
        let jobsArray = [];
        if (Array.isArray(jobsData)) {
          jobsArray = jobsData;
        } else if (jobsData && Array.isArray(jobsData.data)) {
          jobsArray = jobsData.data;
        } else {
          console.warn('Jobs data is not an array:', jobsData);
        }
        
        setJobs(jobsArray);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Failed to fetch jobs';
        setError(errorMessage);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
  };
};

