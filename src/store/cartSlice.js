import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemCount: 0,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      state.itemCount = action.payload.itemCount;
      state.items = action.payload.items;
    },
    removeItemsFromCart: (state) => {
      state.itemCount = 0;
      state.items = {};
    }
  },
});

export const { addItemToCart, removeItemsFromCart } = cartSlice.actions;

export default cartSlice.reducer;
