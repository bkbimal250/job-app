// Statistics Utility Functions

/**
 * Format stat value for display
 * @param {number} value - Stat value
 * @returns {string} Formatted value
 */
export const formatStatValue = (value) => {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString();
};

/**
 * Calculate percentage change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {Object} Change data with percentage and type
 */
export const calculateChange = (current, previous) => {
  if (!previous || previous === 0) {
    return { percentage: 0, type: 'neutral' };
  }

  const change = ((current - previous) / previous) * 100;
  return {
    percentage: Math.abs(change).toFixed(1),
    type: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral',
  };
};

/**
 * Format last updated time
 * @param {Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatLastUpdated = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

