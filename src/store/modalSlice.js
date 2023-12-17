import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal : false
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setShowModal: (state, action) => {
        state.showModal = action.payload.showModal;
    },
  },
});

export const { setShowModal } = modalSlice.actions;

export default modalSlice.reducer;
