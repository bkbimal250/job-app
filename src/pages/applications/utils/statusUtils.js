// Status Utility Functions
import { Clock, CheckCircle2, XCircle, UserCheck } from 'lucide-react';
import { APPLICATION_STATUSES } from '../constants';

/**
 * Get status configuration
 * @param {string} status - Application status
 * @returns {Object} Status configuration object
 */
export const getStatusConfig = (status) => {
  const statusConfig = {
    pending: { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800', 
      icon: Clock, 
      label: 'Pending' 
    },
    shortlisted: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800', 
      icon: CheckCircle2, 
      label: 'Shortlisted' 
    },
    rejected: { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      icon: XCircle, 
      label: 'Rejected' 
    },
    hired: { 
      bg: 'bg-green-100', 
      text: 'text-green-800', 
      icon: UserCheck, 
      label: 'Hired' 
    },
  };
  
  return statusConfig[status?.toLowerCase()] || statusConfig.pending;
};

/**
 * Get status badge styling for modal buttons
 * @param {string} status - Application status
 * @returns {Object} Status button configuration
 */
export const getStatusButtonConfig = (status) => {
  const statusConfig = {
    pending: { 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-300', 
      text: 'text-yellow-700', 
      hover: 'hover:bg-yellow-100' 
    },
    shortlisted: { 
      bg: 'bg-blue-50', 
      border: 'border-blue-300', 
      text: 'text-blue-700', 
      hover: 'hover:bg-blue-100' 
    },
    rejected: { 
      bg: 'bg-red-50', 
      border: 'border-red-300', 
      text: 'text-red-700', 
      hover: 'hover:bg-red-100' 
    },
    hired: { 
      bg: 'bg-green-50', 
      border: 'border-green-300', 
      text: 'text-green-700', 
      hover: 'hover:bg-green-100' 
    },
  };
  
  return statusConfig[status?.toLowerCase()] || statusConfig.pending;
};

/**
 * Get all available statuses
 * @returns {Array} Array of status values
 */
export const getAllStatuses = () => {
  return Object.values(APPLICATION_STATUSES);
};

