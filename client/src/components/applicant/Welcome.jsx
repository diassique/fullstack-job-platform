import React from 'react';
import { Box, Grid, Typography, Paper, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import banner from '../../assets/banner.jpg';

export default function Welcome() {
  const user = useSelector((state) => state.auth.user);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ height: 300, mb: 3 }}>
          <img src={banner} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: 'grey.200' }}>
              <Typography variant="h4" gutterBottom>
                Welcome to your dashboard, 
                <Typography variant="h4" component="span" fontWeight="bold"> {user.firstName}!</Typography>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}