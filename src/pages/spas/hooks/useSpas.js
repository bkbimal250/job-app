// Custom Hook for Spas
import { useState, useEffect, useCallback } from 'react';
import spaService from '../../../api/services/spa.service';
import { sortSpasByName } from '../utils/spaUtils';

/**
 * Custom hook for fetching and managing spas
 * @returns {Object} Spas state and methods
 */
export const useSpas = () => {
  const [spas, setSpas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await spaService.getAllSpas();
      const spasArray = Array.isArray(data) ? data : [];
      const sortedSpas = sortSpasByName(spasArray);
      
      setSpas(sortedSpas);
      
      if (!sortedSpas.length) {
        setError('No spa data found');
      }
    } catch (err) {
      console.error('Error fetching spas:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Unable to load spas data.';
      setError(errorMessage);
      setSpas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpas();
  }, [fetchSpas]);

  return {
    spas,
    loading,
    error,
    setSpas,
    setError,
    refetch: fetchSpas,
  };
};

