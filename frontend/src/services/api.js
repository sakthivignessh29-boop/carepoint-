import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hospitality_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth API
export const authApi = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('hospitality_jwt', res.data.token);
      localStorage.setItem('hospitality_user', JSON.stringify(res.data));
    }
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('hospitality_jwt', res.data.token);
      localStorage.setItem('hospitality_user', JSON.stringify(res.data));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('hospitality_jwt');
    localStorage.removeItem('hospitality_user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('hospitality_user');
    return user ? JSON.parse(user) : null;
  }
};

// Patients API
export const patientsApi = {
  getAll: (params) => api.get('/patients', { params }).then(r => r.data),
  getById: (id) => api.get(`/patients/${id}`).then(r => r.data),
  create: (data) => api.post('/patients', data).then(r => r.data),
  update: (id, data) => api.put(`/patients/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/patients/${id}`).then(r => r.data),
};

// Resources API
export const resourcesApi = {
  getAll: (params) => api.get('/resources', { params }).then(r => r.data),
  create: (data) => api.post('/resources', data).then(r => r.data),
  update: (id, data) => api.put(`/resources/${id}`, data).then(r => r.data),
};

// Bookings API (Handles 409 Conflict explicitly and update/reschedule)
export const bookingsApi = {
  getAll: (params) => api.get('/bookings', { params }).then(r => r.data),
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          isConflict: true,
          status: 409,
          message: error.response.data?.message || '⚠️ Conflict: This slot was just booked by another user. Please refresh and pick an alternate time.'
        };
      }
      return {
        success: false,
        isConflict: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'An unexpected error occurred during booking.'
      };
    }
  },
  update: async (id, bookingData) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          isConflict: true,
          status: 409,
          message: error.response.data?.message || '⚠️ Conflict: Rescheduled slot overlaps with an existing reservation.'
        };
      }
      return {
        success: false,
        isConflict: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'An unexpected error occurred while updating booking.'
      };
    }
  },
  cancel: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.status === 204 || response.status === 200;
  }
};

// Feedback API
export const feedbackApi = {
  getAll: (params) => api.get('/feedback', { params }).then(r => r.data),
  create: (data) => api.post('/feedback', data).then(r => r.data),
  respond: (id, data) => api.put(`/feedback/${id}/respond`, data).then(r => r.data),
};

// Queries Desk API
export const queriesApi = {
  getAll: (params) => api.get('/queries', { params }).then(r => r.data),
  create: (data) => api.post('/queries', data).then(r => r.data),
  answer: (id, data) => api.put(`/queries/${id}/answer`, data).then(r => r.data),
};

// AI Chatbot API
export const chatApi = {
  ask: (data) => api.post('/chat', data).then(r => r.data),
};

export default api;
