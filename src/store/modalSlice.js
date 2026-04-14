/**
 * modalSlice.js — Redux slice for UI modal visibility state.
 *
 * Currently controls the OrderDetailModal on the admin AllOrders page.
 * Keeping modal state in Redux (rather than local component state) allows
 * sibling components to open/close the modal without prop drilling.
 *
 * State shape:
 *  showModal {boolean} — true when the OrderDetailModal should be visible
 *
 * Actions:
 *  setShowModal({ showModal }) — explicitly sets the modal's open/close state
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false // Modal is hidden by default
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    /**
     * setShowModal — Opens or closes the OrderDetailModal.
     * @param {boolean} action.payload.showModal - true to open, false to close
     */
    setShowModal: (state, action) => {
        state.showModal = action.payload.showModal;
    },
  },
});

export const { setShowModal } = modalSlice.actions;

export default modalSlice.reducer;
