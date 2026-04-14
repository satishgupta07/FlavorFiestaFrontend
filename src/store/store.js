/**
 * store.js — Redux store configuration with manual localStorage persistence.
 *
 * Slices:
 *  auth  — logged-in status, user profile, and JWT access token
 *  cart  — item count and cart item array for the Navbar badge and Cart page
 *  modal — show/hide state for the admin OrderDetailModal
 *
 * Persistence strategy:
 *  The entire Redux state is serialised to localStorage on every state change
 *  via store.subscribe() and rehydrated via preloadedState on page load.
 *  This keeps the user logged in and the cart populated across browser refreshes
 *  without a separate persistence library.
 *
 *  Caveat: If the state shape changes between deployments, the old serialised
 *  state may cause a parsing error — the loadState() catch block returns
 *  `undefined` in that case, letting the store start from its slice defaults.
 */
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import cartSlice from "./cartSlice";
import modalSlice from "./modalSlice";

/**
 * saveState — Serialises the Redux state tree to localStorage.
 * Called on every store state change via store.subscribe().
 */
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    // Ignore write errors (e.g. storage quota exceeded)
    console.error("Error saving state to local storage:", err);
  }
};

/**
 * loadState — Rehydrates the Redux state from localStorage on startup.
 * Returns undefined if no saved state exists, which causes Redux to
 * initialise each slice from its own initialState default.
 */
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined; // No saved state — use each slice's default
    }
    return JSON.parse(serializedState);
  } catch (err) {
    // Corrupted or incompatible saved state — start fresh
    console.error("Error loading state from local storage:", err);
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    auth: authSlice,   // Authentication state (login status, user data, JWT)
    cart: cartSlice,   // Shopping cart state (item count + items array)
    modal: modalSlice, // UI state for the order detail modal
  },
  // Rehydrate from localStorage so state survives page refreshes
  preloadedState: loadState(),
});

// Persist the entire state to localStorage after every dispatched action
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
