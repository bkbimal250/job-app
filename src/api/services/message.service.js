// Message Service
import API from '../config/axios';
import { endpoints } from '../config/endpoints';

/**
 * Get all messages
 * @param {Object} params - Query parameters
 * @returns {Promise} API response
 */
export const getAllMessages = async (params = {}) => {
  const response = await API.get(endpoints.messages.list, { params });
  return response.data;
};

/**
 * Get message by ID
 * @param {string} id - Message ID
 * @returns {Promise} API response
 */
export const getMessageById = async (id) => {
  const response = await API.get(endpoints.messages.get(id));
  return response.data;
};

/**
 * Create new message
 * @param {Object} messageData - Message data
 * @returns {Promise} API response
 */
export const createMessage = async (messageData) => {
  const response = await API.post(endpoints.messages.create, messageData);
  return response.data;
};

/**
 * Delete message
 * @param {string} id - Message ID
 * @returns {Promise} API response
 */
export const deleteMessage = async (id) => {
  const response = await API.delete(endpoints.messages.delete(id));
  return response.data;
};

/**
 * Reply to message
 * @param {string} id - Message ID
 * @param {Object} replyData - Reply data (replyMessage, repliedBy)
 * @returns {Promise} API response
 */
export const replyToMessage = async (id, replyData) => {
  const response = await API.post(endpoints.messages.reply(id), replyData);
  return response.data;
};

export default {
  getAllMessages,
  getMessageById,
  createMessage,
  deleteMessage,
  replyToMessage,
};

