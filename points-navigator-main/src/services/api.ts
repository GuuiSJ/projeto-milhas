import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints helpers
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
  updateProfile: (data: { name?: string; email?: string }) => 
    api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) => 
    api.put('/auth/password', { currentPassword, newPassword }),
};

export const cardsAPI = {
  getAll: () => api.get('/cards'),
  getById: (id: string) => api.get(`/cards/${id}`),
  create: (data: { name: string; brand: string; programId: string }) => 
    api.post('/cards', data),
  update: (id: string, data: { name?: string; brand?: string; programId?: string }) => 
    api.put(`/cards/${id}`, data),
  delete: (id: string) => api.delete(`/cards/${id}`),
};

export const purchasesAPI = {
  getAll: () => api.get('/purchases'),
  getById: (id: string) => api.get(`/purchases/${id}`),
  create: (data: FormData) => 
    api.post('/purchases', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: { status?: string }) => 
    api.put(`/purchases/${id}`, data),
  delete: (id: string) => api.delete(`/purchases/${id}`),
};

export const programsAPI = {
  getAll: () => api.get('/programs'),
  getById: (id: string) => api.get(`/programs/${id}`),
};

export const reportsAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getHistory: (filters?: { startDate?: string; endDate?: string; cardId?: string }) => 
    api.get('/reports/history', { params: filters }),
  exportPDF: (filters?: { startDate?: string; endDate?: string }) => 
    api.get('/reports/export/pdf', { params: filters, responseType: 'blob' }),
  exportCSV: (filters?: { startDate?: string; endDate?: string }) => 
    api.get('/reports/export/csv', { params: filters, responseType: 'blob' }),
};
