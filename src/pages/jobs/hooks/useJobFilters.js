// Custom Hook for Job Filters
import { useMemo } from 'react';
import { filterJobs } from '../utils/jobUtils';

/**
 * Custom hook for filtering jobs
 * @param {Array} jobs - Array of jobs
 * @param {string} searchTerm - Search term
 * @param {string} categoryFilter - Category filter
 * @param {string} locationFilter - Location filter
 * @param {string} spaFilter - Spa filter
 * @returns {Object} Filtered jobs
 */
export const useJobFilters = (jobs, searchTerm, categoryFilter, locationFilter, spaFilter) => {
  const filteredJobs = useMemo(() => {
    return filterJobs(jobs, searchTerm, categoryFilter, locationFilter, spaFilter);
  }, [jobs, searchTerm, categoryFilter, locationFilter, spaFilter]);

  return {
    filteredJobs,
  };
};

