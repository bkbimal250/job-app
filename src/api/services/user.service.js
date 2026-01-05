// User Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Get all users
 * @returns {Promise} API response
 */
export const getAllUsers = async () => {
  const response = await API.get(endpoints.users.list);
  // Handle different response structures
  if (response.data && response.data.users) {
    return response.data.users;
  } else if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data;
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise} API response
 */
export const getUserById = async (id) => {
  const response = await API.get(endpoints.users.get(id));
  return response.data;
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise} API response
 */
export const deleteUser = async (userId) => {
  const response = await API.delete(endpoints.users.delete(userId));
  return response.data;
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} API response
 */
export const updateUser = async (id, userData) => {
  const response = await API.put(endpoints.users.update(id), userData);
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} API response
 */
export const getProfile = async () => {
  const response = await API.get(endpoints.users.profile);
  return response.data;
};

/**
 * Update current user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} API response
 */
export const updateProfile = async (profileData) => {
  const response = await API.put(endpoints.users.profile, profileData);
  return response.data;
};

/**
 * Register a new user (admin only)
 * @param {Object} userData - User data
 * @returns {Promise} API response
 */
export const registerUser = async (userData) => {
  const response = await API.post(endpoints.users.register, userData);
  return response.data;
};

export default {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  getProfile,
  updateProfile,
  registerUser,
};

