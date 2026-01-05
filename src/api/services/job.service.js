// Job Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Get all jobs
 * @param {Object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} API response
 */
export const getAllJobs = async (params = {}) => {
  const response = await API.get(endpoints.jobs.list, { params });
  return response.data;
};

/**
 * Get job by ID
 * @param {string} id - Job ID
 * @returns {Promise} API response
 */
export const getJobById = async (id) => {
  const response = await API.get(endpoints.jobs.get(id));
  return response.data;
};

/**
 * Create new job
 * @param {Object} jobData - Job data
 * @returns {Promise} API response
 */
export const createJob = async (jobData) => {
  const response = await API.post(endpoints.jobs.create, jobData);
  return response.data;
};

/**
 * Update job
 * @param {string} id - Job ID
 * @param {Object} jobData - Job data to update
 * @returns {Promise} API response
 */
export const updateJob = async (id, jobData) => {
  const response = await API.put(endpoints.jobs.update(id), jobData);
  return response.data;
};

/**
 * Delete job
 * @param {string} id - Job ID
 * @returns {Promise} API response
 */
export const deleteJob = async (id) => {
  const response = await API.delete(endpoints.jobs.delete(id));
  return response.data;
};

/**
 * Get job statistics
 * @returns {Promise} API response
 */
export const getJobStats = async () => {
  const response = await API.get(endpoints.jobs.stats);
  return response.data;
};

export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
};

