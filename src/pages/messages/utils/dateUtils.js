// Date Utility Functions for Messages

/**
 * Format date for display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {Object} Formatted date object with date and time
 */
export const formatMessageDate = (dateString) => {
  if (!dateString) return { date: 'N/A', time: 'N/A' };
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { date: 'N/A', time: 'N/A' };
  
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    full: date.toLocaleString(),
  };
};

/**
 * Sort messages by date (newest first)
 * @param {Array} messages - Array of messages
 * @returns {Array} Sorted messages
 */
export const sortMessagesByDate = (messages) => {
  if (!Array.isArray(messages)) return [];
  
  return [...messages].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });
};

