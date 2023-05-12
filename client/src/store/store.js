import { configureStore } from '@reduxjs/toolkit';
import applicantReducer from './slices/applicantSlice';
import employerReducer from './slices/employerSlice';

export default configureStore({
  reducer: {
    applicant: applicantReducer,
    employer: employerReducer, // Add it to your store
  },
});