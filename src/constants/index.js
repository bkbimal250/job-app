// Application Constants

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 15000,
  MAX_RETRIES: 3,
};

// Application Statuses
export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  HIRED: 'hired',
};

// Job Statuses
export const JOB_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CLOSED: 'closed',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SPA_ADMIN: 'spa_admin',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ALLOWED_DOC_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY HH:mm',
};

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  PINCODE_REGEX: /^[0-9]{6}$/,
};

// Chart Colors
export const CHART_COLORS = [
  '#8884d8', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042', 
  '#a4de6c', '#d0ed57', '#d8854f', '#d0ed57', '#a28fd0',
  '#f7b267', '#f4845f', '#f27059', '#4f98ca', '#3da5d9',
  '#62c370', '#b2f7ef', '#f6dfeb', '#f7b7a3', '#ea5f89',
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created!',
  UPDATED: 'Successfully updated!',
  DELETED: 'Successfully deleted!',
  UPLOADED: 'File uploaded successfully!',
};

export default {
  API_CONFIG,
  APPLICATION_STATUSES,
  JOB_STATUSES,
  USER_ROLES,
  PAGINATION,
  FILE_UPLOAD,
  DATE_FORMATS,
  VALIDATION,
  CHART_COLORS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};

