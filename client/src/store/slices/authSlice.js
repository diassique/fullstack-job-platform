import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const signIn = createAsyncThunk('auth/signIn', async (credentials) => {
  const response = await axios.post(`/${credentials.userType.toLowerCase()}/login`, credentials);
  return response.data;
});

export const signUp = createAsyncThunk('auth/signUp', async ({ role, ...userData }) => {
  const response = await axios.post(`/${role.toLowerCase()}/register`, userData);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    userType: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userType = action.payload.userType;
      state.user = action.payload.user;
    },
    signOut: (state) => {
      state.token = null;
      state.user = null;
      state.userType = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userType = action.payload.user.userType;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.userType = action.payload.user.userType;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setUser, signOut } = authSlice.actions;

export default authSlice.reducer;