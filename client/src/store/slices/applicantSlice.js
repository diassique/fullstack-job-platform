import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userType: '',
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
};

export const applicantSlice = createSlice({
  name: 'applicant',
  initialState,
  reducers: {
    setApplicant: (state, action) => {
      state.userType = 'Applicant';
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
  },
});

export const { setApplicant } = applicantSlice.actions;

export default applicantSlice.reducer;