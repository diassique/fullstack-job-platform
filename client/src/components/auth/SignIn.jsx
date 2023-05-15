import React, { useState } from 'react';
import api from '../../api';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Snackbar, Alert } from '@mui/material';

export default function SignIn() {
  // To change the user role
  const [role, setRole] = useState("Applicant");

  // To open and hide the password
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('/me'); // Replace with the correct endpoint for fetching user data
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    const { email, password } = data;
  
    try {
      // Send login request to API
      const response = role === 'Applicant'
        ? await api.post('/applicant/login', { email, password })
        : await api.post('/employer/login', { email, password });
  
      if (!response || !response.data || !response.data.token) {
        throw new Error('Login failed');
      }
  
      localStorage.setItem('authToken', response.data.token); // Store the token for future requests
  
      const userData = await fetchUserData();
      console.log('User data:', userData);
      if (userData) {
        const name = userData.name;
        alert(`Hello ${role}! Your ${role === 'Applicant' ? 'name' : 'company name'} is ${name}`);
      }
  
      setSnackbarSeverity('success');
      setSnackbarMessage('Login successful');
      setSnackbarOpen(true);
  
    } catch (error) {
      console.error('Error logging in:', error);
  
      setSnackbarSeverity('error');
      setSnackbarMessage('Email or password is incorrect, or account does not exist');
      setSnackbarOpen(true);
    }
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={handleRoleChange}
          sx={{ mt: 2, mb: 2 }}
        >
          <ToggleButton value="Applicant">
            Applicant
          </ToggleButton>
          <ToggleButton value="Employer">
            Employer
          </ToggleButton>
        </ToggleButtonGroup>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            {...register("email", {
              required: 'Email is required',
              pattern: {
                value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                message: 'Wrong email format',
              },
            })}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            {...register("password", {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <RouterLink to="/signup" style={{ textDecoration: 'none' }}>
                <Link variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}