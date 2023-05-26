import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Avatar, Card, CardContent, Box, Link } from '@mui/material';
import api from '../../api/api';

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [resumePath, setResumePath] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/me');
        console.log(response);
        setUserData(response.data);
        if (response.data.avatar) {
          const avatarUrl = `${api.defaults.baseURL}/uploads/applicants/${response.data.id}/${response.data.avatar}`;
          setProfileImg(avatarUrl);
        }
        if(response.data.resume) {
          const resumeUrl = `${api.defaults.baseURL}/uploads/resumes/${response.data.id}/${response.data.resume}`;
          setResumePath(resumeUrl);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchData();
  }, []);

  if (!userData) return 'Loading...';



  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar alt={userData.firstName} src={profileImg} sx={{ width: 150, height: 150, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {userData.firstName + ' ' + userData.lastName}
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
          <Box mt={2}>
            <Card>
              <CardContent>
                <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">
                    CV (Resume)
                  </Typography>
                  <Link href={resumePath} target="_blank" rel="noopener noreferrer">
                    View
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {userData.professionalTitle}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {userData.shortBio}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            Positions
          </Typography>
          {userData.positions.map((position, index) => (
            <Box mt={2}>
              <Card key={index}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6">{position.title}</Typography>
                      <Typography variant="subtitle1">{position.company}</Typography>
                      <Typography variant="subtitle1">{position.description}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'grey' }}>{`${position.startMonth} ${position.startYear} - ${position.endMonth} ${position.endYear}`}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            Education
          </Typography>
          {userData.education.map((edu, index) => (
            <Box mt={2}>
              <Card key={index}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6">{edu.degree}</Typography>
                      <Typography variant="subtitle1">{edu.university}</Typography>
                      <Typography variant="subtitle1">{edu.description}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'grey' }}>{`${edu.startYear} - ${edu.endYear}`}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            Certifications
          </Typography>
          {userData.certifications.map((cert, index) => (
            <Box mt={2}>
              <Card key={index}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="h6">{cert.name}</Typography>
                      <Typography variant="subtitle1">{cert.authority}</Typography>
                      <Typography variant="subtitle1">{cert.description}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ color: 'grey' }}>{`License Number: ${cert.licenseNumber}`}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}