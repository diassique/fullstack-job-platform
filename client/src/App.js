import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import SignIn from './components/auth/Signin';
import SignUp from './components/auth/Signup';
import Navbar from './components/common/Navbar';
import Homepage from './components/common/Homepage';
import Footer from './components/common/Footer';
import ApplicantDashboard from './components/applicant/Dashboard';
import EmployerDashboard from './components/employer/Dashboard';
import PrivateRoute from './components/auth/Private';

import { useDispatch } from 'react-redux';
import { rehydrate } from './redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  const location = useLocation();
  const shouldRenderNavbar = ['/','/signin','/signup'].includes(location.pathname);
  
  return (
    <div className="App">
      {shouldRenderNavbar && <Navbar />}
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          {/* Protected routes */}
          <Route path="/applicant/*" element={
            <PrivateRoute role="Applicant">
              <ApplicantDashboard />
            </PrivateRoute>
          }/>
          <Route path="/employer/*" element={
            <PrivateRoute role="Employer">
              <EmployerDashboard />
            </PrivateRoute>
          }/>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;