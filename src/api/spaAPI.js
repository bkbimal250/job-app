import apiService from './apiService';

export const fetchAllSpas = () => apiService.get('/spas');
export const addSpa = (spaData) => apiService.post('/spas', spaData);
export const deleteSpa = (id) => apiService.delete(`/spas/${id}`);
