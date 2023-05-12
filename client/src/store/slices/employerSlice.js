// src/redux/employerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userType: '',
  companyName: '',
  email: '',
  avatar: '',
};

export const employerSlice = createSlice({
  name: 'employer',
  initialState,
  reducers: {
    setEmployer: (state, action) => {
      state.userType = 'Employer';
      state.companyName = action.payload.companyName;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
  },
});

export const { setEmployer } = employerSlice.actions;

export default employerSlice.reducer;