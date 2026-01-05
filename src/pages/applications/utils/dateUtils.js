// Date Utility Functions

/**
 * Format date for display
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return date.toLocaleString();
};

/**
 * Format date to short format (date only)
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return date.toLocaleDateString();
};

/**
 * Sort applications by date (newest first)
 * @param {Array} applications - Array of applications
 * @returns {Array} Sorted applications
 */
export const sortApplicationsByDate = (applications) => {
  if (!Array.isArray(applications)) return [];
  
  return [...applications].sort((a, b) => {
    const dateA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
    const dateB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });
};

