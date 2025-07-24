import axios from 'axios';

// Use environment variable or fallback to localhost for development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Property services
export const propertyService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const response = await api.get(`/properties?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  update: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  getMyListings: async () => {
    const response = await api.get('/properties/my/listings');
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/properties/${id}/status`, { status });
    return response.data;
  }
};

// User services
export const userService = {
  getLandlords: async () => {
    const response = await api.get('/users/landlords');
    return response.data;
  },

  getAgents: async () => {
    const response = await api.get('/users/agents');
    return response.data;
  }
};

export default api;
