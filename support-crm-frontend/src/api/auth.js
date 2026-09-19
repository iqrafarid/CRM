import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = (data) => {
  return axios.post(`${API_BASE}/auth/login`, data).then(res => res.data);
};

export const register = (data) => {
  return axios.post(`${API_BASE}/auth/register`, data).then(res => res.data);
};