// Spa Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Get all spas
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getAllSpas = async (params = {}) => {
  const response = await API.get(endpoints.spas.list, { params });
  // Handle different response structures
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return response.data;
};

/**
 * Get spa by ID
 * @param {string} id - Spa ID
 * @returns {Promise} API response
 */
export const getSpaById = async (id) => {
  // Since the API uses /spas/spaall/, we need to fetch all and find the one
  const allSpas = await getAllSpas();
  const spa = Array.isArray(allSpas) ? allSpas.find(s => s._id === id) : null;
  if (!spa) {
    throw new Error(`Spa with ID ${id} not found`);
  }
  return spa;
};

/**
 * Create new spa
 * @param {FormData|Object} spaData - Spa data (can be FormData for file uploads)
 * @returns {Promise} API response
 */
export const createSpa = async (spaData) => {
  const response = await API.post(endpoints.spas.create, spaData, {
    headers: spaData instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }
  });
  return response.data;
};

/**
 * Update spa
 * @param {string} id - Spa ID
 * @param {FormData|Object} spaData - Spa data to update (can be FormData for file uploads)
 * @returns {Promise} API response
 */
export const updateSpa = async (id, spaData) => {
  const response = await API.put(endpoints.spas.update(id), spaData, {
    headers: spaData instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' }
  });
  return response.data;
};

/**
 * Delete spa
 * @param {string} id - Spa ID
 * @returns {Promise} API response
 */
export const deleteSpa = async (id) => {
  const response = await API.delete(endpoints.spas.delete(id));
  return response.data;
};

export default {
  getAllSpas,
  getSpaById,
  createSpa,
  updateSpa,
  deleteSpa,
};

