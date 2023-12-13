import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemCount: 0,
  items: []
  // You can add more cart-related state here
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      state.itemCount = action.payload.itemCount;
      state.items = action.payload.items;
    },
    incrementItemCount: (state) => {
      state.itemCount += 1;
    },
    decrementItemCount: (state) => {
      if (state.itemCount > 0) {
        state.itemCount -= 1;
      }
    },
    resetItemCount: (state) => {
      state.itemCount = 0;
    },
  },
});

export const { addItemToCart, incrementItemCount, decrementItemCount, resetItemCount } =
  cartSlice.actions;

export default cartSlice.reducer;
