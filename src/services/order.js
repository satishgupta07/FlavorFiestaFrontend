/**
 * services/order.js — Order placement and management API calls.
 *
 * All endpoints are authenticated. The JWT token is attached automatically
 * by the apiClient interceptor — no need to pass it as a parameter.
 */
import apiClient from './apiClient';

/** Place an order and receive a Stripe sessionId. */
export const createOrder = (data) => apiClient.post('/orders/place-order', data);

/** Fetch all orders for the logged-in customer. */
export const getAllOrdersOfUser = () => apiClient.get('/orders');

/** Fetch a single order with enriched product details. */
export const getOrderById = (orderId) => apiClient.get(`/orders/${orderId}`);

/** Admin: fetch every order across all customers. */
export const getAllOrders = () => apiClient.get('/orders/all-orders');

/** Admin: update an order's fulfilment status. */
export const updateStatus = (data) => apiClient.post('/orders/order/status', data);
