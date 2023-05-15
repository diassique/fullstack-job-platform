import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.role = action.payload.role;
      state.email = action.payload.email;
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;