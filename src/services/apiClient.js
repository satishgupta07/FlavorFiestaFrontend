/**
 * apiClient.js — Centralised Axios instance for all API calls.
 *
 * Eliminates the repetitive `headers` boilerplate in every service file by:
 *  - Setting the base URL once
 *  - Attaching the JWT Bearer token automatically via a request interceptor
 *    that reads the current Redux store state (no prop-drilling of jwtToken)
 *
 * Usage:
 *   import apiClient from './apiClient';
 *   const res = await apiClient.get('/orders');          // authenticated
 *   const res = await apiClient.post('/users/login', body); // public
 */
import axios from 'axios';
import store from '../store/store';

const apiClient = axios.create({
  baseURL: 'https://flavor-fiesta-backend.onrender.com/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach the JWT token from Redux store before every request.
// This way callers never need to pass jwtToken manually.
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.jwtToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
