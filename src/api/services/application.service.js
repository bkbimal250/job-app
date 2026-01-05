// Application Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Get all applications
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getAllApplications = async (params = {}) => {
  const response = await API.get(endpoints.applications.list, { params });
  return response.data;
};

/**
 * Get application by ID
 * @param {string} id - Application ID
 * @returns {Promise} API response
 */
export const getApplicationById = async (id) => {
  const response = await API.get(endpoints.applications.get(id));
  return response.data;
};

/**
 * Update application status
 * @param {string} id - Application ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateApplicationStatus = async (id, status) => {
  const response = await API.put(endpoints.applications.update(id), { status });
  return response.data;
};

/**
 * Update application
 * @param {string} id - Application ID
 * @param {Object} applicationData - Application data to update
 * @returns {Promise} API response
 */
export const updateApplication = async (id, applicationData) => {
  const response = await API.put(endpoints.applications.update(id), applicationData);
  return response.data;
};

/**
 * Delete application
 * @param {string} id - Application ID
 * @returns {Promise} API response
 */
export const deleteApplication = async (id) => {
  const response = await API.delete(endpoints.applications.delete(id));
  return response.data;
};

export default {
  getAllApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
};

