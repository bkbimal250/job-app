// Custom Hook for Daily Visits
import { useState, useEffect } from 'react';
import API from '../../../api/config/axios';
import { endpoints } from '../../../api/config/endpoints';

/**
 * Custom hook for fetching daily website visits
 * @returns {Object} Daily visits state
 */
export const useDailyVisits = () => {
  const [dailyVisits, setDailyVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyVisits = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await API.get(endpoints.stats.dailyVisits);
        const data = response.data || response;
        setDailyVisits(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.warn('Daily visits endpoint not available:', err);
        setDailyVisits([]);
        setError('Unable to load daily visits data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyVisits();
  }, []);

  return {
    dailyVisits,
    loading,
    error,
  };
};

