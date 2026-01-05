// Custom Hook for Message Filters
import { useMemo } from 'react';
import { filterMessages, filterMessagesByDate } from '../utils';

/**
 * Custom hook for filtering messages
 * @param {Array} messages - Array of messages
 * @param {string} searchTerm - Search term
 * @param {string} startDate - Start date filter
 * @param {string} endDate - End date filter
 * @returns {Object} Filtered messages
 */
export const useMessageFilters = (messages, searchTerm, startDate, endDate) => {
  const filteredMessages = useMemo(() => {
    if (!Array.isArray(messages)) return [];

    // First filter by date range
    let filtered = filterMessagesByDate(messages, startDate, endDate);
    
    // Then filter by search term
    filtered = filterMessages(filtered, searchTerm);
    
    return filtered;
  }, [messages, searchTerm, startDate, endDate]);

  return {
    filteredMessages,
  };
};

