import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// Resumes API
export const resumes = {
  getAll: () => api.get('/resumes'),
  getById: (id) => api.get(`/resumes/${id}`),
  create: (data) => api.post('/resumes', data),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  duplicate: (id) => api.post(`/resumes/${id}/duplicate`),
  exportPdf: (id) => api.get(`/resumes/${id}/export/pdf`),
};

// Sections API
export const sections = {
  getAll: (resumeId) => api.get(`/resumes/${resumeId}/sections`),
  create: (resumeId, data) => api.post(`/resumes/${resumeId}/sections`, data),
  update: (resumeId, sectionId, data) => 
    api.put(`/resumes/${resumeId}/sections/${sectionId}`, data),
  delete: (resumeId, sectionId) => 
    api.delete(`/resumes/${resumeId}/sections/${sectionId}`),
  updateOrder: (resumeId, sections) => 
    api.put(`/resumes/${resumeId}/sections/order`, { sections }),
};

// Entries API
export const entries = {
  getAll: (resumeId, sectionId) => 
    api.get(`/resumes/${resumeId}/sections/${sectionId}/entries`),
  create: (resumeId, sectionId, data) => 
    api.post(`/resumes/${resumeId}/sections/${sectionId}/entries`, data),
  update: (resumeId, sectionId, entryId, data) => 
    api.put(`/resumes/${resumeId}/sections/${sectionId}/entries/${entryId}`, data),
  delete: (resumeId, sectionId, entryId) => 
    api.delete(`/resumes/${resumeId}/sections/${sectionId}/entries/${entryId}`),
  updateOrder: (resumeId, sectionId, entries) => 
    api.put(`/resumes/${resumeId}/sections/${sectionId}/entries/order`, { entries }),
};

export default api;
