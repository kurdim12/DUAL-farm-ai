import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  register: (username, password) =>
    api.post('/auth/register', { username, password }),
};

// Sensor APIs
export const sensorAPI = {
  ingest: (data) => api.post('/sensors/ingest', data),
  getLatest: () => api.get('/sensors/latest'),
  getHistory: (range = '1h', limit = 1000) =>
    api.get(`/sensors/history?range=${range}&limit=${limit}`),
  getStats: () => api.get('/sensors/stats'),
};

// Control APIs
export const controlAPI = {
  controlPump: (state, reason = null) =>
    api.post('/control/pump', { state, reason }),
  doseNutrients: (amount_ml, reason = null) =>
    api.post('/control/dose', { amount_ml, reason }),
  diluteSolution: (amount_ml) =>
    api.post('/control/dilute', amount_ml, {
      params: { amount_ml },
    }),
};

// Action APIs
export const actionAPI = {
  getHistory: (limit = 100, action_type = null) => {
    const params = { limit };
    if (action_type) params.action_type = action_type;
    return api.get('/actions/history', { params });
  },
  getRecent: (hours = 24) =>
    api.get(`/actions/recent?hours=${hours}`),
  getStats: () => api.get('/actions/stats'),
};

// Alert APIs
export const alertAPI = {
  getLatest: (limit = 50) => api.get(`/alerts/latest?limit=${limit}`),
  getActive: (limit = 50) => api.get(`/alerts/active?limit=${limit}`),
  getHistory: (limit = 100) => api.get(`/alerts/history?limit=${limit}`),
  resolve: (alertId) => api.post(`/alerts/${alertId}/resolve`),
  getStats: () => api.get('/alerts/stats'),
};

// Simulation APIs
export const simulationAPI = {
  start: () => api.post('/simulate/start'),
  stop: () => api.post('/simulate/stop'),
  getStatus: () => api.get('/simulate/status'),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getInsights: () => api.get('/analytics/insights'),
};

export default api;
