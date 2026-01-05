// Custom Hook for User Filters
import { useMemo } from 'react';
import { filterUsers } from '../utils/userUtils';

/**
 * Custom hook for filtering users
 * @param {Array} users - Array of users
 * @param {string} searchTerm - Search term
 * @param {string} roleFilter - Role filter
 * @returns {Object} Filtered users
 */
export const useUserFilters = (users, searchTerm, roleFilter) => {
  const filteredUsers = useMemo(() => {
    return filterUsers(users, searchTerm, roleFilter);
  }, [users, searchTerm, roleFilter]);

  return {
    filteredUsers,
  };
};

