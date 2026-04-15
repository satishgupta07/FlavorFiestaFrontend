/**
 * services/menu.js — Product catalogue API calls.
 *
 * getAllProducts is public (no auth). createNewProduct is admin-only (token
 * attached automatically by the apiClient interceptor).
 */
import apiClient from './apiClient';

/** Fetch all products sorted newest-first. Pass a category string to filter. */
export const getAllProducts = (category) =>
  apiClient.get('/products', { params: category ? { category } : {} });

/** Create a new product (admin only). */
export const createNewProduct = (data) => apiClient.post('/products', data);

/** Partially update an existing product's fields (admin only). */
export const updateProduct = (id, data) => apiClient.put(`/products/${id}`, data);

/** Permanently delete a product (admin only). */
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);
