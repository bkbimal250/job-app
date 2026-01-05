// Custom Hook for Subscribers
import { useState, useEffect } from 'react';
import subscriberService from '../../../api/services/subscriber.service';
import { sortSubscribersByDate } from '../utils/subscriberUtils';

/**
 * Custom hook for fetching and managing subscribers
 * @returns {Object} Subscribers state and methods
 */
export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscribers = async () => {
    setLoading(true);
    setError(null);

    try {
      const subscribersData = await subscriberService.getAllSubscribers();
      
      // Ensure subscribers is always an array
      let subscribersArray = [];
      if (Array.isArray(subscribersData)) {
        subscribersArray = subscribersData;
      } else if (subscribersData && Array.isArray(subscribersData.data)) {
        subscribersArray = subscribersData.data;
      } else {
        console.warn('Subscribers data is not an array:', subscribersData);
      }
      
      // Sort subscribers by date (newest first)
      const sortedSubscribers = sortSubscribersByDate(subscribersArray);
      
      setSubscribers(sortedSubscribers);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to fetch subscribers';
      setError(errorMessage);
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return {
    subscribers,
    loading,
    error,
    setSubscribers,
    setError,
    refetch: fetchSubscribers,
  };
};

