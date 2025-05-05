import axios from 'axios';

const API_URL = 'http://localhost:5000/api/'; // adjust base URL

export const loginAdmin = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};
