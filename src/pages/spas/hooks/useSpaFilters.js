// Custom Hook for Spa Filters
import { useMemo } from 'react';
import { filterSpas } from '../utils/spaUtils';

/**
 * Custom hook for filtering spas
 * @param {Array} spas - Array of spas
 * @param {string} searchTerm - Search term
 * @param {string} stateFilter - State filter
 * @param {string} cityFilter - City filter
 * @param {string} phoneFilter - Phone filter
 * @returns {Object} Filtered spas
 */
export const useSpaFilters = (spas, searchTerm, stateFilter, cityFilter, phoneFilter) => {
  const filteredSpas = useMemo(() => {
    return filterSpas(spas, searchTerm, stateFilter, cityFilter, phoneFilter);
  }, [spas, searchTerm, stateFilter, cityFilter, phoneFilter]);

  return {
    filteredSpas,
  };
};

