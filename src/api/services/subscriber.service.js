// Subscriber Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Get all subscribers
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getAllSubscribers = async (params = {}) => {
  const response = await API.get(endpoints.subscribers.list, { params });
  return response.data;
};

/**
 * Delete subscriber
 * @param {string} id - Subscriber ID
 * @returns {Promise} API response
 */
export const deleteSubscriber = async (id) => {
  const response = await API.delete(endpoints.subscribers.delete(id));
  return response.data;
};

export default {
  getAllSubscribers,
  deleteSubscriber,
};

