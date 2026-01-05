// Chart Utility Functions

import { MONTH_LABELS } from '../constants';

/**
 * Convert API data to line chart format for Chart.js
 * @param {Array} data - API response data
 * @param {string} label - Dataset label
 * @param {string} color - Border color
 * @returns {Object} Chart.js data format
 */
export const toLineChartData = (data, label, color) => {
  if (!data || !Array.isArray(data)) {
    return { labels: MONTH_LABELS, datasets: [] };
  }

  // Group by year for multi-year support
  const grouped = {};
  data.forEach(({ _id, count }) => {
    const year = _id.year;
    const month = _id.month;
    if (!grouped[year]) grouped[year] = Array(12).fill(0);
    grouped[year][month - 1] = count;
  });

  // Create datasets for each year
  const datasets = Object.entries(grouped).map(([year, counts], idx) => ({
    label: `${label} ${year}`,
    data: counts,
    borderColor: color,
    backgroundColor: color + '33',
    tension: 0.4,
    fill: true,
  }));

  return { labels: MONTH_LABELS, datasets };
};

/**
 * Convert website visits data to chart format
 * @param {Array} data - Visit data from API
 * @returns {Object} Chart.js data format
 */
export const toVisitChartData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { labels: [], datasets: [] };
  }

  const labels = data.map(d => new Date(d.date).toLocaleDateString());
  const views = data.map(d => d.views || 0);

  return {
    labels,
    datasets: [
      {
        label: 'Website Visits',
        data: views,
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        tension: 0.4,
        fill: true,
      },
    ],
  };
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatChartDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

