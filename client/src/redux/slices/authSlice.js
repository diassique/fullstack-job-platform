import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isLoggingIn: false,
  loginError: null,
  user: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoggingIn = true;
      state.loginError = null;
    },
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.isLoggingIn = false;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.isLoggingIn = false;
      state.loginError = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },    
    rehydrate: (state) => {
      const authToken = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user'));

      if (authToken && user) {
        state.isLoggedIn = true;
        state.user = user;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, rehydrate } = authSlice.actions;

export default authSlice.reducer;