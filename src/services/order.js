/**
 * services/order.js — Order placement and management API calls.
 *
 * All endpoints are authenticated. The JWT token is attached automatically
 * by the apiClient interceptor — no need to pass it as a parameter.
 */
import apiClient from './apiClient';

/** Place an order and receive a Stripe sessionId. */
export const createOrder = (data) => apiClient.post('/orders/place-order', data);

/** Fetch paginated orders for the logged-in customer. Supports { page, limit, status } params. */
export const getAllOrdersOfUser = (params = {}) => apiClient.get('/orders', { params });

/** Fetch a single order with enriched product details. */
export const getOrderById = (orderId) => apiClient.get(`/orders/${orderId}`);

/** Cancel an order that is still in "order_placed" status. */
export const cancelOrder = (orderId) => apiClient.patch(`/orders/${orderId}/cancel`);

/** Admin: fetch paginated orders across all customers. Supports { page, limit, status, search }. */
export const getAllOrders = (params = {}) => apiClient.get('/orders/all-orders', { params });

/** Admin: update an order's fulfilment status. */
export const updateStatus = (data) => apiClient.post('/orders/order/status', data);
