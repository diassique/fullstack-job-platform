import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import contentImageFirst from '../../assets/pic-1.svg';
import contentImageSecond from '../../assets/pic-2.svg';
import contentImageThird from '../../assets/pic-3.svg';
import styled from 'styled-components';

import video from '../../assets/video.mp4'

const ContentImage = styled('img')`
  width: 60%;
  margin-bottom: 1rem;
`;

export default function Homepage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero section */}
      <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <video autoPlay loop muted 
          style={{
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-1"
          }}
        >
          <source src={video} type="video/mp4" />
        </video>
        <Typography variant="h2" component="h1" gutterBottom sx={{ textAlign: 'center', px: { xs: 2, sm: 0 }, zIndex: '1', color: '#ffffff' }}>
          Online Recruitment System
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ textAlign: 'center', px: { xs: 2, sm: 0 }, zIndex: '1', color: '#ffffff' }}>
          Find your dream job or hire the best talent
        </Typography>
        <Box mt={4}>
          <Button variant="contained" color="primary" component={RouterLink} to="/signin" sx={{ mr: 1 }}>
            Sign In
          </Button>
          <Button variant="contained" color="secondary" component={RouterLink} to="/signup" sx={{ ml: 1 }}>
            Sign Up
          </Button>
        </Box>
      </Box>

      {/* Features section */}
      <Box p={4}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px' }}>
              <ContentImage src={contentImageFirst} alt="Job Positions"/>
              <Typography variant="h6" component="h3">
                Wide Range of Job Positions
              </Typography>
              <Typography>
                Our platform offers a diverse selection of job positions across various industries, ensuring you can find the perfect opportunity.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px' }}>
              <ContentImage src={contentImageSecond} alt="Recruitment Process"/>
              <Typography variant="h6" component="h3">
                Efficient Recruitment Process
              </Typography>
              <Typography>
                Our recruitment system connects employers and job seekers efficiently, streamlining the recruitment process.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px' }}>
              <ContentImage src={contentImageThird} alt="Candidate Profiles"/>
              <Typography variant="h6" component="h3">
                Comprehensive Candidate Profiles
              </Typography>
              <Typography>
                Job seekers can create detailed profiles showcasing their skills, experience, and education, making it easier for employers to find the right candidate.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>


      {/* Available job positions section */}
      <Box p={4}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Available Job Positions
        </Typography>
        <Grid container spacing={4} justifyContent="center">
            {/* You can replace the following with dynamic content from your API */}
            <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="h3">
                Software Engineer
              </Typography>
              <Typography>
                Company A - Full-time
              </Typography>
              <Button variant="contained" color="primary" component={RouterLink} to="/job-details">
                View Details
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="h3">
                Graphic Designer
              </Typography>
              <Typography>
                Company B - Part-time
              </Typography>
              <Button variant="contained" color="primary" component={RouterLink} to="/job-details">
                View Details
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 4, minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="h3">
                Marketing Manager
              </Typography>
              <Typography>
                Company C - Full-time
              </Typography>
              <Button variant="contained" color="primary" component={RouterLink} to="/job-details">
                View Details
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Button variant="outlined" color="primary" component={RouterLink} to="/jobs">
            View All Job Positions
          </Button>
        </Box>
      </Box>
    </Box>
  );
}