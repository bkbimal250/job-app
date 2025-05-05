import apiService from './apiService';

export const fetchAllUsers = () => {
  return apiService.get('/users');
};

export const deleteUser = (userId) => {
  return apiService.delete(`/users/${userId}`);
};
