import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, bounce back to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const getTickets = (params) => client.get('/tickets', { params }).then(res => res.data);
export const getTicket = (ticketId) => client.get(`/tickets/${ticketId}`).then(res => res.data);
export const createTicket = (data) => client.post('/tickets', data).then(res => res.data);
export const updateTicket = (ticketId, data) => client.put(`/tickets/${ticketId}`, data).then(res => res.data);