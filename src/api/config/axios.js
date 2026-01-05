// Axios Configuration for Admin Dashboard
// Centralized axios instance with interceptors

import axios from 'axios';

// Choose base URL based on environment
// Supports both new (VITE_API_URL_PROD/DEV) and legacy (VITE_API_BASE_URL) variables
const PROD_URL = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_BASE_URL;
const DEV_URL = import.meta.env.VITE_API_URL_DEV || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

function chooseBaseURL() {
  try {
    // Use Vite's build mode to determine environment
    if (import.meta.env?.DEV) {
      if (DEV_URL) {
        return DEV_URL;
      }
      // Fallback for development
      console.warn('⚠️ VITE_API_URL_DEV not set, using localhost fallback');
      return 'http://localhost:5000/api/v1';
    }
    
    if (import.meta.env?.PROD) {
      if (PROD_URL) {
        return PROD_URL;
      }
      // Fallback for production - use VITE_API_BASE_URL if available
      const fallback = import.meta.env.VITE_API_BASE_URL;
      if (fallback) {
        console.warn('⚠️ VITE_API_URL_PROD not set, using VITE_API_BASE_URL fallback');
        return fallback;
      }
      console.error('❌ VITE_API_URL_PROD is not set in .env file');
      throw new Error('VITE_API_URL_PROD environment variable is required');
    }
    
    // Fallback: detect by hostname
    const hostname = window?.location?.hostname || '';
    const isLocal = /localhost|127\.0\.0\.1|\.local|^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
    const selectedURL = isLocal ? (DEV_URL || 'http://localhost:5000/api/v1') : (PROD_URL || import.meta.env.VITE_API_BASE_URL);
    
    if (!selectedURL) {
      console.error('❌ No API URL configured. Please set VITE_API_URL_DEV or VITE_API_URL_PROD in .env file');
      // Return a default to prevent complete failure
      return 'http://localhost:5000/api/v1';
    }
    
    return selectedURL;
  } catch (error) {
    console.error('❌ Error choosing base URL:', error.message);
    // Return default instead of throwing to prevent app crash
    return 'http://localhost:5000/api/v1';
  }
}

// Create axios instance
const API = axios.create({
  baseURL: chooseBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Optional cache-busting for GET requests
    if (config.method === 'get' && config.params && config._noCache) {
      config.params._t = Date.now();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error?.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Surface useful network errors
    if (error?.response == null) {
      error.message = error.message || 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default API;

