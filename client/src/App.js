import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';

import './App.css';
import ApplicantDashboard from './Applicant/ApplicantDashboard';
import EmployerDashboard from './Employer/EmployerDashboard';
import Footer from './components/Footer/Footer';
import HomePage from './components/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar';
import NotFound from './components/NotFound/NotFound';
import Protected from './components/Protected';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import { setUser } from './store/slices/authSlice';

function App() {
  const isSignedIn = localStorage.getItem('authToken') !== null;
  const location = useLocation();

  const dispatch = useDispatch();

  const userType = useSelector((state) => state.auth.userType);

  const [isLoading, setIsLoading] = useState(true); // Add this state

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (storedUser && storedUser !== 'undefined' && storedUserType) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(setUser({user: parsedUser, userType: storedUserType}));
    }
    setIsLoading(false); // Set loading to false after checking localStorage
  }, [dispatch]);

  const shouldRenderNavbar = ['/','/signin','/signup'].includes(location.pathname);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <div className="App">
        {shouldRenderNavbar && <Navbar />}
        <div className="content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/signup" element={<SignUp />} />
            {/* Protected Routes */}
            <Route
              path="/applicant/*"
              element={
                <Protected isSignedIn={isSignedIn && userType === 'Applicant'}>
                  <ApplicantDashboard />
                </Protected>
              }
            />
            <Route
              path="/employer/*"
              element={
                <Protected isSignedIn={isSignedIn && userType === 'Employer'}>
                  <EmployerDashboard />
                </Protected>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
    </div>
  );
}

export default App;