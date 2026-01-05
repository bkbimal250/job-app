// Authentication Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Admin login
 * @param {Object} credentials - Login credentials { email/phone, password }
 * @returns {Promise} API response
 */
export const adminLogin = async (credentials) => {
  const response = await API.post(endpoints.auth.adminLogin, credentials);
  return response.data;
};

export default {
  adminLogin,
};

