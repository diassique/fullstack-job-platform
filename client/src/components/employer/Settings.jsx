import React, { useState, useEffect } from 'react';
import { Grid, Box, Button, Typography, TextField, Container, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import api from '../../api/api';

const Input = styled('input')({
  display: 'none',
});

export default function SettingsPage() {
  const email = useSelector((state) => state.auth.user.email);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setSnackbar(prevSnackbar => ({ ...prevSnackbar, open: false }));
  };

  const [update, setUpdate] = useState(0);  // new state
  const [profileImg, setProfileImg] = useState(null);
  useEffect(() => {
    api.get('/me')
    .then((res) => {
        const userDetails = res.data;
        if(userDetails.avatar) {
          const avatarUrl = `${api.defaults.baseURL}/uploads/employers/${userDetails.id}/${userDetails.avatar}`;
          setProfileImg(avatarUrl);
        }
      })
      .catch(console.error);
    }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
  
      api.post('/employer/avatar', formData)
        .then((res) => {
          const avatarPath = `${api.defaults.baseURL}/uploads/employers/${res.data.id}/${res.data.avatar}?${Date.now()}`;
          setProfileImg(avatarPath);
          setUpdate(update + 1);
          window.location.reload();
        })
        .catch(console.error);
    }
  };
  const handleAvatarRemove = () => {
    api.delete('/employer/avatar').then(() => setProfileImg(null)).catch(console.error);
  };

  // Fetch initial user details
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [shortBio, setShortBio] = useState('');
  useEffect(() => {
    api.get('/me')
      .then(res => {
        const user = res.data;
        console.log(user);
        setCompanyName(user.companyName);
        setLocation(user.location);
        setPhone(user.phone);
        setShortBio(user.shortBio);
      });
  }, [])
  const handleUpdateProfile = () => {
    api.put('/employer/details', { companyName, location, phone, shortBio })
      .then(res => {
        setSnackbar({ open: true, message: 'Profile update success', severity: 'success' });
      })
      .catch(err => {
        setSnackbar({ open: true, message: 'Profile update error', severity: 'error' });
      })
  };

  return (
    <Container maxWidth="md">
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Company Info
          </Typography>
        </Grid>
        {/* Avatar upload section */}
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar src={profileImg || undefined} sx={{ width: 100, height: 100, m: 1, backgroundColor: 'white' }}>
              {profileImg === null && <AccountCircleIcon style={{ fontSize: 130, color: 'grey' }} />}
            </Avatar>

            <Box display="flex" justifyContent="center" pt={1}>
              <Input
                accept="image/*"
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <Box mr={2}>
                  <Button variant="contained" sx={{ borderRadius: 50 }} color="primary" component="span" startIcon={<PhotoCamera />}>
                    Upload
                  </Button>
                </Box>
              </label>
              <Button variant="outlined" sx={{ borderRadius: 50 }} color="error" component="span" onClick={handleAvatarRemove} startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>
        {/* Email */}
        <Grid item xs={12}>
          <TextField label="Email" fullWidth value={email} InputProps={{ readOnly: true }} disabled/>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Company Name" variant="outlined" value={companyName} onChange={e => setCompanyName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Location" variant="outlined" value={location} onChange={e => setLocation(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Phone" variant="outlined" value={phone} onChange={e => setPhone(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Short Bio" variant="outlined" value={shortBio} onChange={e => setShortBio(e.target.value)} multiline rows={4}/>
        </Grid>
        {/* Update Profile button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpdateProfile}>Update Profile</Button>
        </Grid>
      </Grid>
    </Container>
  );
}