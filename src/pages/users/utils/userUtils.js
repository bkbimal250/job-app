// User Utility Functions

import { ROLE_BADGE_COLORS } from '../constants';

/**
 * Get role badge color class
 * @param {string} role - User role
 * @returns {string} Tailwind CSS classes
 */
export const getRoleBadgeColor = (role) => {
  if (!role) return ROLE_BADGE_COLORS.default;
  return ROLE_BADGE_COLORS[role.toLowerCase()] || ROLE_BADGE_COLORS.default;
};

/**
 * Get user display name
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  return user.fullName || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email || 'Unknown User';
};

/**
 * Get user initials
 * @param {Object} user - User object
 * @returns {string} User initials
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  const first = user.firstname?.charAt(0) || '';
  const last = user.lastname?.charAt(0) || '';
  return (first + last).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
};

/**
 * Filter users by search term and role
 * @param {Array} users - Array of users
 * @param {string} searchTerm - Search term
 * @param {string} roleFilter - Role filter
 * @returns {Array} Filtered users
 */
export const filterUsers = (users, searchTerm, roleFilter) => {
  if (!Array.isArray(users)) return [];

  const lowerSearch = searchTerm.toLowerCase();
  
  return users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(lowerSearch) ||
      user.email?.toLowerCase().includes(lowerSearch) ||
      user.phone?.toLowerCase().includes(lowerSearch) ||
      `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase().includes(lowerSearch);

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {boolean} Is valid password
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

