import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Container, Avatar, Card, CardContent, Box, Link } from '@mui/material';
import api from '../../api/api';

export default function ApplicantPage() {
  const { applicantId } = useParams();
  const [userData, setUserData] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [resumePath, setResumePath] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/applicants/${applicantId}`);
        setUserData(response.data);
        if (response.data.avatar) {
          const avatarUrl = `${api.defaults.baseURL}/uploads/applicants/${response.data._id}/${response.data.avatar}`;
          setProfileImg(avatarUrl);
        }
        if(response.data.resume) {
          const resumeUrl = `${api.defaults.baseURL}/uploads/resumes/${response.data._id}/${response.data.resume}`;
          setResumePath(resumeUrl);
        }
      } catch (error) {
        console.error('Failed to fetch user data: ', error);
      }
    };
    fetchData();
  }, [applicantId]);

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
            <Box mt={2} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" gutterBottom>
                      {position.title}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {position.company}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {position.startYear} - {position.current ? 'Present' : position.endYear}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {position.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            Education
          </Typography>
          {userData.education.map((edu, index) => (
            <Box mt={2} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" gutterBottom>
                      {edu.university}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {edu.degree}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {edu.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
            Certifications
          </Typography>
          {userData.certifications.map((cert, index) => (
            <Box mt={2} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" gutterBottom>
                      {cert.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {cert.authority}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" gutterBottom>
                    License Number: {cert.licenseNumber}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {cert.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
