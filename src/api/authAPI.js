import apiService from './apiService';

export const adminLogin = (credentials) => {
  return apiService.post('/admin/login', credentials);
};
