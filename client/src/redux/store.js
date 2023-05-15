import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';

const preloadedState = () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (authToken && user) {
      return {
        auth: {
          isLoggedIn: true,
          isLoggingIn: false,
          loginError: null,
          user,
        }
      }
    } else {
      return undefined;
    }
  } catch(err) {
    return undefined;
  }
}

export default configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
  preloadedState: preloadedState(),
});