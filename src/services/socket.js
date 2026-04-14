/**
 * socket.js — Socket.io client singleton.
 *
 * Creating a new socket on every module import caused multiple concurrent
 * connections (one per component that imported socket.io-client directly).
 *
 * This module exports a single shared socket instance so OrderStatus and
 * OrderDetail reuse the same underlying WebSocket connection.
 *
 * The socket connects lazily on first import. Components are responsible
 * for cleaning up their own event listeners on unmount (socket.off).
 */
import { io } from 'socket.io-client';

// Use the same origin as the backend. Falls back to the deployed URL.
const SOCKET_URI =
  import.meta.env.VITE_SOCKET_URI ||
  'https://flavor-fiesta-backend.onrender.com';

const socket = io(SOCKET_URI, {
  // Only connect when there's something to listen for (avoids idle connections)
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
