import React from 'react';
import { Grid, Typography, Container } from '@mui/material';

export default function ProfilePage() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Profile
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}