// Statistics Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Get dashboard statistics
 * @returns {Promise} API response
 */
export const getDashboardStats = async () => {
  const response = await API.get(endpoints.stats.dashboard);
  return response.data;
};

/**
 * Get view statistics
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getViewStats = async (params = {}) => {
  const response = await API.get(endpoints.stats.views, { params });
  return response.data;
};

export default {
  getDashboardStats,
  getViewStats,
};

