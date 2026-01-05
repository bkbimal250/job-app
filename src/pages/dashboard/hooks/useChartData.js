// Custom Hook for Chart Data
import { useState, useEffect } from 'react';
import API from '../../../api/config/axios';
import { CHART_COLORS } from '../constants';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Custom hook for fetching chart data
 * @returns {Object} Chart data state
 */
export const useChartData = () => {
  const [chartData, setChartData] = useState({
    userData: null,
    jobData: null,
    messageData: null,
    visitData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Note: These endpoints might need to be added to endpoints.js
        // For now, using direct API calls similar to ChartsSection
        const [userRes, jobRes, msgRes, visitRes] = await Promise.all([
          API.get(`${BASE_URL}/users/chart/monthly`),
          API.get(`${BASE_URL}/spajobs/chart/monthly`),
          API.get(`${BASE_URL}/messages/chart/monthly`),
          API.get(`${BASE_URL}/site/visits/daily`),
        ]);

        setChartData({
          userData: userRes.data?.data || userRes.data,
          jobData: jobRes.data?.data || jobRes.data,
          messageData: msgRes.data?.data || msgRes.data,
          visitData: visitRes.data?.data || visitRes.data,
        });
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError("Unable to load chart data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return {
    chartData,
    loading,
    error,
  };
};

