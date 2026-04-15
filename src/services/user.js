/**
 * services/user.js — User profile and admin stats API calls.
 *
 * Auth token is attached automatically by the apiClient interceptor.
 */
import apiClient from './apiClient';

/** Fetch the current user's profile (name, email, role). */
export const getProfile = () => apiClient.get('/users/getCurrentUser');

/** Update the current user's name, email, and/or password. */
export const updateProfile = (data) => apiClient.patch('/users/me', data);

/** Admin: fetch aggregated stats for the dashboard. */
export const getAdminStats = () => apiClient.get('/users/admin/stats');
