// Custom Hook for Messages
import { useState, useEffect } from 'react';
import messageService from '../../../api/services/message.service';
import { formatMessage } from '../utils/messageUtils';
import { sortMessagesByDate } from '../utils/dateUtils';

/**
 * Custom hook for fetching and managing messages
 * @param {Object} options - Options object
 * @param {number} options.page - Current page number
 * @param {number} options.itemsPerPage - Items per page
 * @param {string} options.startDate - Start date filter
 * @param {string} options.endDate - End date filter
 * @returns {Object} Messages state and methods
 */
export const useMessages = ({ 
  page = 1, 
  itemsPerPage = 15,
  startDate = '',
  endDate = '',
} = {}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [messageCount, setMessageCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = { page };
        if (startDate && endDate) {
          params.startDate = startDate;
          params.endDate = endDate;
        }

        const response = await messageService.getAllMessages(params);

        if (response.success) {
          const messagesData = response.data || [];
          const formattedMessages = messagesData.map(formatMessage);
          const sortedMessages = sortMessagesByDate(formattedMessages);
          
          setMessages(sortedMessages);
          setTotalPages(response.pages || 1);
          setMessageCount(response.total || 0);
        } else {
          setError("Failed to fetch messages");
          setMessages([]);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 
                            err.message || 
                            "Failed to fetch messages";
        setError(errorMessage);
        console.error('Error fetching messages:', err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [page, itemsPerPage, startDate, endDate, refreshTrigger]);

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    messages,
    loading,
    error,
    totalPages,
    messageCount,
    setMessages,
    setError,
    refetch,
  };
};

