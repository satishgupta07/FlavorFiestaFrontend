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
  },
});

export const { addItemToCart } = cartSlice.actions;

export default cartSlice.reducer;
