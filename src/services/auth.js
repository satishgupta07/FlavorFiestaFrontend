/**
 * services/auth.js — Authentication API calls.
 *
 * Uses the shared apiClient which handles base URL and Content-Type.
 * Auth endpoints are public so no Bearer token is attached by the interceptor.
 */
import apiClient from './apiClient';

export class AuthService {
  async createAccount(data) {
    return apiClient.post('/users/register', data);
  }

  async login(data) {
    return apiClient.post('/users/login', data);
  }
}

const authService = new AuthService();
export default authService;
