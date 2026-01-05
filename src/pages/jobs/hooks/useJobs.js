// Custom Hook for Jobs
import { useState, useEffect } from 'react';
import jobService from '../../../api/services/job.service';

/**
 * Custom hook for fetching and managing jobs
 * @returns {Object} Jobs state and methods
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const jobsData = await jobService.getAllJobs();

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
                          'Unable to load jobs data.';
      setError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    setJobs,
    setError,
    refetch: fetchJobs,
  };
};

