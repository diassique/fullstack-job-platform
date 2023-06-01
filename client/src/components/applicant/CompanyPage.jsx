import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Container, Avatar, Card, CardContent, Box } from '@mui/material';
import api from '../../api/api';

export default function CompanyPage() {
  const { companyId } = useParams();
  const [userData, setUserData] = useState(null);
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/employers/${companyId}`);
        setUserData(response.data);
        if (response.data.avatar) {
          const avatarUrl = `${api.defaults.baseURL}/uploads/employers/${response.data._id}/${response.data.avatar}`;
          setProfileImg(avatarUrl);
        }
      } catch (error) {
        console.error('Failed to fetch user data: ', error);
      }
    };
    fetchData();
  }, [companyId]);  

  if (!userData) return 'Loading...';

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar alt={userData.companyName} src={profileImg} sx={{ width: 150, height: 150, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {userData.companyName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'grey' }}>
                  {userData.email}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {userData.phone}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {userData.location}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Company Bio
              </Typography>
              <Typography variant="body1" gutterBottom>
                {userData.shortBio}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}