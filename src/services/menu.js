/**
 * services/menu.js — Product catalogue API calls.
 *
 * getAllProducts is public (no auth). createNewProduct is admin-only (token
 * attached automatically by the apiClient interceptor).
 */
import apiClient from './apiClient';

/** Fetch all products sorted newest-first. */
export const getAllProducts = () => apiClient.get('/products');

/** Create a new product (admin only). */
export const createNewProduct = (data) => apiClient.post('/products', data);
