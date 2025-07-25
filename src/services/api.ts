
import axios from 'axios';
import { BASE_URL, COMPANY_ID } from './config';
import { ApiResponse } from '@/types/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-company-id': COMPANY_ID,
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if you need cookies
});

// Add a request interceptor to attach the token for non-public APIs
api.interceptors.request.use(
  (config) => {
    // Only attach token for non-public API endpoints
    if (config.url && !config.url.startsWith('/api/public/')) {
      const token = localStorage.getItem('authToken');
      if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`);
        } else if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Do not assign config.headers to a plain object
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiService = {
  get: <T>(url: string, config = {}) => api.get<any, ApiResponse<T>>(url, config).then(res => res.data),
  post: <T>(url: string, data?: unknown, config = {}) => api.post<any, ApiResponse<T>>(url, data, config).then(res => res.data),
  put: <T>(url: string, data?: unknown, config = {}) => api.put<any, ApiResponse<T>>(url, data, config).then(res => res.data),
  delete: <T>(url: string, config = {}) => api.delete<any, ApiResponse<T>>(url, config).then(res => res.data),
};
