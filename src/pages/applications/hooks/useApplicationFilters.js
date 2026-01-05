// Custom Hook for Application Filters
import { useState, useEffect, useMemo } from 'react';
import { filterApplications, sortApplicationsByDate } from '../utils';

/**
 * Custom hook for filtering applications
 * @param {Array} applications - Array of applications
 * @returns {Object} Filter state and filtered applications
 */
export const useApplicationFilters = (applications) => {
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredApplications = useMemo(() => {
    if (!Array.isArray(applications)) return [];

    const filtered = filterApplications(applications, jobFilter, statusFilter);
    return sortApplicationsByDate(filtered);
  }, [applications, jobFilter, statusFilter]);

  return {
    jobFilter,
    statusFilter,
    setJobFilter,
    setStatusFilter,
    filteredApplications,
  };
};

