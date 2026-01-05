// Form Utility Functions

import { isValidEmail, isValidPhone, isValidPassword } from './userUtils';

/**
 * Validate user form data
 * @param {Object} formData - Form data object
 * @returns {Object} Errors object
 */
export const validateUserForm = (formData) => {
  const errors = {};

  // Email validation
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // First name validation
  if (!formData.firstname?.trim()) {
    errors.firstname = 'First name is required';
  }

  // Last name validation
  if (!formData.lastname?.trim()) {
    errors.lastname = 'Last name is required';
  }

  // Phone validation
  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (10-15 digits)';
  }

  // Password validation (only for new users)
  if (formData.password !== undefined) {
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }
  }

  return errors;
};

/**
 * Generate full name from first and last name
 * @param {string} firstname - First name
 * @param {string} lastname - Last name
 * @returns {string} Full name
 */
export const generateFullName = (firstname, lastname) => {
  return `${firstname || ''} ${lastname || ''}`.trim();
};

/**
 * Clean form data (trim strings, remove empty values)
 * @param {Object} formData - Form data object
 * @returns {Object} Cleaned form data
 */
export const cleanFormData = (formData) => {
  const cleaned = { ...formData };
  
  Object.keys(cleaned).forEach(key => {
    if (typeof cleaned[key] === 'string') {
      cleaned[key] = cleaned[key].trim();
    }
  });

  return cleaned;
};

