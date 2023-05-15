import { configureStore } from '@reduxjs/toolkit';
import applicantReducer from './slices/applicantSlice';
import employerReducer from './slices/employerSlice';
import authReducer from './slices/authSlice'; // import the auth reducer

export default configureStore({
  reducer: {
    applicant: applicantReducer,
    employer: employerReducer,
    auth: authReducer, // Add it to your store
  },
});