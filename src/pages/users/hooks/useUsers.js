// Custom Hook for Users
import { useState, useEffect } from 'react';
import userService from '../../../api/services/user.service';

/**
 * Custom hook for fetching and managing users
 * @returns {Object} Users state and methods
 */
export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const usersData = await userService.getAllUsers();
      const usersArray = Array.isArray(usersData) ? usersData : [];
      setUsers(usersArray);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Unable to load users data.';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    setUsers,
    setError,
    refetch: fetchUsers,
  };
};

