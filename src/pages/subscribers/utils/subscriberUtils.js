// Subscriber Utility Functions

/**
 * Format date for display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date
 */
export const formatSubscriberDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Sort subscribers by date (newest first)
 * @param {Array} subscribers - Array of subscribers
 * @returns {Array} Sorted subscribers
 */
export const sortSubscribersByDate = (subscribers) => {
  if (!Array.isArray(subscribers)) return [];
  
  return [...subscribers].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });
};

/**
 * Filter subscribers by search term
 * @param {Array} subscribers - Array of subscribers
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered subscribers
 */
export const filterSubscribers = (subscribers, searchTerm) => {
  if (!Array.isArray(subscribers) || !searchTerm) return subscribers;
  
  const term = searchTerm.toLowerCase();
  return subscribers.filter(subscriber =>
    subscriber.email?.toLowerCase().includes(term) ||
    subscriber.phone?.toLowerCase().includes(term)
  );
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

