// Custom Hook for Applications
import { useState, useEffect } from 'react';
import applicationService from '../../../api/services/application.service';
import { sortApplicationsByDate } from '../utils/dateUtils';

/**
 * Custom hook for fetching and managing applications
 * @param {Object} options - Options object
 * @param {number} options.page - Current page number
 * @param {number} options.itemsPerPage - Items per page
 * @returns {Object} Applications state and methods
 */
export const useApplications = ({ page = 1, itemsPerPage = 15 } = {}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await applicationService.getAllApplications({
          page,
          limit: itemsPerPage,
        });

        console.log("Application data:", response);

        // Handle response structure
        const applicationData = response?.data || response || [];
        const appsArray = Array.isArray(applicationData) ? applicationData : [];
        
        // Sort applications by appliedAt date (newest first)
        const sortedApplications = sortApplicationsByDate(appsArray);
        
        setApplications(sortedApplications);
        setTotalPages(response?.totalPages || 1);
        setTotalItems(response?.total || response?.totalItems || sortedApplications.length);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'An error occurred while fetching applications';
        setError(errorMessage);
        console.error('Error fetching applications:', err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [page, itemsPerPage]);

  return {
    applications,
    loading,
    error,
    totalPages,
    totalItems,
    setApplications,
    setError,
  };
};

