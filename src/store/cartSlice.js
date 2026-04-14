/**
 * cartSlice.js — Redux slice for shopping cart state.
 *
 * State shape:
 *  itemCount {number} — number of distinct products in the cart (shown in Navbar badge)
 *  items     {Array}  — enriched cart items from the API:
 *                       [{ productId, name, image, price, size, quantity, total }, ...]
 *
 * This slice acts as a client-side cache of the cart returned by the backend.
 * The authoritative cart is always on the server; the Redux state is updated
 * after every successful API call (add, remove, fetch) so the Navbar badge
 * and Cart page stay in sync without an extra network request.
 *
 * Actions:
 *  addItemToCart(payload)   — replaces the cart state with the latest API response
 *  removeItemsFromCart()    — resets the cart to empty (used after order placement)
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemCount: 0,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * addItemToCart — Syncs the Redux cart with the latest state from the API.
     * Called after any cart mutation (add, remove, fetch) with the full cart response.
     * @param {number} action.payload.itemCount - Total distinct items in the cart
     * @param {Array}  action.payload.items     - Enriched item array from the API
     */
    addItemToCart: (state, action) => {
      state.itemCount = action.payload.itemCount;
      state.items = action.payload.items;
    },
    /**
     * removeItemsFromCart — Resets cart state to empty.
     * Called after a successful order placement to clear the Navbar badge.
     */
    removeItemsFromCart: (state) => {
      state.itemCount = 0;
      state.items = {};
    }
  },
});

export const { addItemToCart, removeItemsFromCart } = cartSlice.actions;

export default cartSlice.reducer;
