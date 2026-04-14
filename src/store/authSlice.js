/**
 * authSlice.js — Redux slice for authentication state.
 *
 * State shape:
 *  status    {boolean} — true when a user is logged in
 *  userData  {object}  — { _id, name, email, role } populated after login/register
 *  jwtToken  {string}  — JWT access token used as the Bearer token in API requests
 *
 * The jwtToken is stored in Redux (and therefore in localStorage via store.js)
 * rather than in an httpOnly cookie because the backend is deployed on a
 * separate domain (Render) and setting cross-domain cookies is restricted.
 *
 * Actions:
 *  login(payload)  — sets status = true and stores user data + token
 *  logout()        — clears status and user data (token is removed via localStorage clear)
 */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,    // false = not logged in
    userData: null,   // null until user logs in
    jwtToken: ""      // empty string until user logs in
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /**
         * login — Called after a successful login or registration API response.
         * @param {object} action.payload.userData  - User profile object
         * @param {string} action.payload.jwtToken  - JWT access token
         */
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.jwtToken = action.payload.jwtToken;
        },
        /**
         * logout — Clears the authentication state.
         * The token is effectively invalidated because the state (and localStorage)
         * will no longer hold it after this action is dispatched.
         */
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
     }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;