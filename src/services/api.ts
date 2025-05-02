import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const eventService = {
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  createReservation: async (eventId: string, reservationData: any) => {
    const response = await api.post(`/reservations/events/${eventId}/reserve`, reservationData);
    return response.data;
  },
};

export const reservationService = {
  getUserReservations: async () => {
    const response = await api.get('/reservations/my-reservations');
    return response.data;
  },
};

export default api;