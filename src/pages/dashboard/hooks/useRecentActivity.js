// Custom Hook for Recent Activity
import { useState, useEffect } from 'react';
import API from '../../../api/config/axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Custom hook for fetching recent activity
 * @returns {Object} Recent activity state
 */
export const useRecentActivity = () => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await API.get(`${BASE_URL}/activity/recent`);
        setActivity(response.data || response);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        setError(err.message || "Failed to fetch recent activity");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return {
    activity,
    loading,
    error,
  };
};

