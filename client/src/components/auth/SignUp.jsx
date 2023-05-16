import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import { InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import api from '../../api/api';

export default function SignUp() {
  const [role, setRole] = useState("Applicant");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleRoleChange = (event, newRole) => newRole !== null && setRole(newRole);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setSnackbar(prevSnackbar => ({ ...prevSnackbar, open: false }));
  };
  const navigate = useNavigate();
 
  const onSubmit = async (data) => {
    try {
      const response = await api.post(`/${role.toLowerCase()}/register`, data);
      if (response.status === 201) {
        setSnackbar({ open: true, message: 'Sign up successful', severity: 'success' });
        setTimeout(() => {
          navigate("/signin");
        }, 2500);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Sign up failed', severity: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={{ marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        <ToggleButtonGroup value={role} exclusive onChange={handleRoleChange} sx={{ mt: 2, mb: 2 }}>
          <ToggleButton value="Applicant" sx={{ bgcolor: role === 'Applicant' ? 'primary.main' : '', color: role === 'Applicant' ? 'common.white' : '' }}>
            Applicant
          </ToggleButton>
          <ToggleButton value="Employer" sx={{ bgcolor: role === 'Employer' ? 'primary.main' : '', color: role === 'Employer' ? 'common.white' : '' }}>
            Employer
          </ToggleButton>
        </ToggleButtonGroup>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {role === "Applicant" ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    {...register("firstName", { required: "First name is required" })}
                    error={errors.firstName}
                    helperText={errors.firstName && errors.firstName.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    {...register("lastName", { required: "Last name is required" })}
                    error={errors.lastName}
                    helperText={errors.lastName && errors.lastName.message}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="companyName"
                  label="Company Name"
                  name="companyName"
                  autoComplete="organization"
                  {...register("companyName", { required: "Company name is required" })}
                  error={errors.companyName}
                  helperText={errors.companyName && errors.companyName.message}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                    message: "Wrong email format",
                  },
                })}
                error={errors.email}
                helperText={errors.email && errors.email.message}
                onChange={e => e.target.value = e.target.value.toLowerCase()}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[0-9])/,
                    message: "Password must contain at least 1 uppercase letter and 1 number",
                  },
                })}
                error={errors.password}
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
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
          <Grid container>
            <Grid item>
              <RouterLink to="/signin" style={{ textDecoration: 'none' }}>
                <Link variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}