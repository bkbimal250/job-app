// API Endpoints Configuration
// Centralized endpoint definitions for the admin dashboard

const API_BASE = '';

export const endpoints = {
  // Authentication
  auth: {
    adminLogin: `${API_BASE}/admin/login`,
  },

  // Users
  users: {
    list: `${API_BASE}/users`,
    get: (id) => `${API_BASE}/users/${id}`,
    delete: (id) => `${API_BASE}/users/${id}`,
    update: (id) => `${API_BASE}/users/${id}`,
    profile: `${API_BASE}/users/profile`,
    register: `${API_BASE}/users/register`,
  },

  // Jobs
  jobs: {
    list: `${API_BASE}/spajobs`,
    get: (id) => `${API_BASE}/spajobs/${id}`,
    create: `${API_BASE}/spajobs`,
    update: (id) => `${API_BASE}/spajobs/${id}`,
    delete: (id) => `${API_BASE}/spajobs/${id}`,
    stats: `${API_BASE}/spajobs/stats`,
  },

  // Spas
  spas: {
    list: `${API_BASE}/spas/spaall/`,
    get: (id) => `${API_BASE}/spas/spa/${id}`,
    create: `${API_BASE}/spas/spa`,
    update: (id) => `${API_BASE}/spas/spa/${id}`,
    delete: (id) => `${API_BASE}/spas/spa/${id}`,
  },

  // Applications
  applications: {
    list: `${API_BASE}/application/admin/applications`,
    get: (id) => `${API_BASE}/application/${id}`,
    update: (id) => `${API_BASE}/application/admin/applications/status/${id}`,
    delete: (id) => `${API_BASE}/application/user/applications/${id}`,
  },

  // Messages
  messages: {
    list: `${API_BASE}/messages`,
    get: (id) => `${API_BASE}/messages/${id}`,
    create: `${API_BASE}/messages`,
    delete: (id) => `${API_BASE}/messages/${id}`,
    reply: (id) => `${API_BASE}/messages/${id}/reply`,
  },

  // Categories
  categories: {
    list: `${API_BASE}/enums`,
  },

  // Statistics
  stats: {
    dashboard: `${API_BASE}/stats`,
    views: `${API_BASE}/views`,
    siteStats: `${API_BASE}/site/stats`,
    dailyVisits: `${API_BASE}/site/visits/daily`,
  },

  // Subscribers (Note: Backend uses /suscribers with typo)
  subscribers: {
    list: `${API_BASE}/suscribers`,
    delete: (id) => `${API_BASE}/suscribers/${id}`,
  },
};

export default endpoints;

