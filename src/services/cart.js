/**
 * services/cart.js — Shopping cart API calls.
 *
 * Uses apiClient which automatically attaches the JWT Bearer token from
 * the Redux store, so callers no longer need to pass jwtToken manually.
 */
import apiClient from './apiClient';

/** Add a product to the cart or update its quantity (absolute value, not delta). */
export const addToCart = (productId, data) =>
  apiClient.post(`/cart/item/${productId}`, data);

/** Fetch the authenticated user's enriched cart. */
export const getCart = () => apiClient.get('/cart');

/** Remove a product entirely from the cart. */
export const removeFromCart = (productId) =>
  apiClient.delete(`/cart/item/${productId}`);

/** Empty all items from the cart. */
export const clearCart = () => apiClient.delete('/cart/clear');
