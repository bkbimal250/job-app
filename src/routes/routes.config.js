// Route Configuration
// Centralized route definitions for the admin dashboard

export const publicRoutes = [
  { path: '/login', name: 'Login' },
];

export const privateRoutes = [
  { path: '/dashboard', name: 'Dashboard', icon: 'Layout' },
  { path: '/jobs', name: 'Jobs', icon: 'Briefcase' },
  { path: '/spas', name: 'Spas', icon: 'Building2' },
  { path: '/applications', name: 'Applications', icon: 'FileText' },
  { path: '/messages', name: 'Messages', icon: 'Mail' },
  { path: '/users', name: 'Users', icon: 'Users' },
  { path: '/suscribers', name: 'Subscribers', icon: 'Bell' },
  { path: '/add-spa-job', name: 'Add Job', icon: 'Plus' },
  { path: '/addSpa', name: 'Add Spa', icon: 'Plus' },
];

export const routePaths = {
  // Public
  login: '/login',
  
  // Dashboard
  dashboard: '/dashboard',
  
  // Jobs
  jobs: '/jobs',
  addJob: '/add-spa-job',
  editJob: (id) => `/job/${id}`,
  viewJob: (id) => `/view-job/${id}`,
  
  // Spas
  spas: '/spas',
  addSpa: '/addSpa',
  editSpa: (id) => `/edit-spa/${id}`,
  viewSpa: (id) => `/view-spa/${id}`,
  
  // Applications
  applications: '/applications',
  
  // Messages
  messages: '/messages',
  
  // Users
  users: '/users',
  viewProfile: '/view-profile',
  editProfile: '/edit-profile',
  
  // Subscribers
  subscribers: '/suscribers',
};

export default {
  publicRoutes,
  privateRoutes,
  routePaths,
};

