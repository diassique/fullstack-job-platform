import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useSelector } from 'react-redux';
import api from '../../api/api';

const Input = styled('input')({
  display: 'none',
});

function MonthSelect({ label }) {
  return (
    <TextField select label={label} fullWidth variant="filled" SelectProps={{ native: true }}>
      <option value="" />
      <option value={1}>January</option>
      <option value={2}>February</option>
      <option value={3}>March</option>
      <option value={4}>April</option>
      <option value={5}>May</option>
      <option value={6}>June</option>
      <option value={7}>July</option>
      <option value={8}>August</option>
      <option value={9}>September</option>
      <option value={10}>October</option>
      <option value={11}>November</option>
      <option value={12}>December</option>
    </TextField>
  );
}


export default function SettingsPage() {
  const [update, setUpdate] = useState(0);  // new state
  const [profileImg, setProfileImg] = useState(null);
  useEffect(() => {
    api.get('/me')
      .then((res) => {
        const userDetails = res.data;
        if(userDetails.avatar) {
          const avatarUrl = `${api.defaults.baseURL}/uploads/applicants/${userDetails.id}/${userDetails.avatar}`;
          setProfileImg(avatarUrl);
        }
        if(userDetails.resume) {
          setResumeUploaded(true);
        }
      })
      .catch(console.error);
  }, []);
  
  const email = useSelector((state) => state.auth.user.email);
  const [positions, setPositions] = useState([]);
  const [educations, setEducations] = useState([]); // New state for education
  const [certifications, setCertifications] = useState([]);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
  
      api.post('/applicant/avatar', formData)
        .then((res) => {
          const avatarPath = `${api.defaults.baseURL}/uploads/applicants/${res.data.id}/${res.data.avatar}?${Date.now()}`;
          setProfileImg(avatarPath);
          setUpdate(update + 1);
          window.location.reload();
        })
        .catch(console.error);
    }
  };

  const handleAvatarRemove = () => {
    api.delete('/applicant/avatar').then(() => setProfileImg(null)).catch(console.error);
  };

  // resume
  const [resumeUploaded, setResumeUploaded] = useState(false);
  useEffect(() => {
    api.get('/applicant/resume')
      .then((res) => {
        setResumeUploaded(res.data.resumeExists);
      })
      .catch(console.error);
  }, []);

  const handleResumeUpload = (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('resume', e.target.files[0]);
  
      api.post('/applicant/resume', formData)
        .then((res) => {
          // handle the response
          console.log(res.data);
          // setResumeUploaded(true);
          // window.location.reload();
        })
        .catch(console.error);
    }
  };
  const handleResumeRemove = () => {
    api.delete('/applicant/resume')
      .then(() => {
        setResumeUploaded(false);
        // window.location.reload();
      })
      .catch(console.error);
  };
  

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Personal Info
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

        {/* 2 row: Email */}
        <Grid item xs={12}>
          <TextField label="Email" fullWidth value={email} InputProps={{ readOnly: true }} disabled
        />
        </Grid>
        {/* 3 row: First Name and Last Name */}
        <Grid item xs={12} sm={6}>
          <TextField label="First Name" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Last Name" fullWidth />
        </Grid>

        {/* 4 row: Location and Phone */}
        <Grid item xs={12} sm={6}>
          <TextField label="Location" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Phone" fullWidth />
        </Grid>
        {/* 5 row: Professional Title */}
        <Grid item xs={12}>
          <TextField label="Professional Title" fullWidth />
        </Grid>

        {/* 6 row: Short Bio */}
        <Grid item xs={12}>
          <TextField 
            label="Short Bio"
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
        {/* Upload resume */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              border: '2px solid #2E79D5', 
              borderRadius: '5px', 
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              p: 2,
              mt: 2
            }}
          >
            <UploadFileIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Box mb={2}>Upload your resume</Box>
            <Input
              accept="application/pdf"
              id="resume-upload"
              type="file"
              onChange={handleResumeUpload}
            />
            <label htmlFor="resume-upload">
              <Button component="span" variant="contained">
                Upload Resume
              </Button>
              {resumeUploaded && (
                <Button 
                  variant="outlined" 
                  sx={{ borderRadius: 50 }} 
                  color="error" 
                  component="span" 
                  onClick={handleResumeRemove} 
                  startIcon={<DeleteIcon />}
                >
                  Delete Resume
                </Button>
              )}
            </label>
          </Box>
        </Grid>

        {/* Employment record book */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="success"
            onClick={() => setPositions([...positions, {}])}
          >
            Add Position
          </Button>
        </Grid>
        {/* Position forms */}
        {positions.map((position, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12}>
              <Typography variant="h6">Position {index + 1}</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Occupation/Title" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Company" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              {/* Start month */}
              <MonthSelect label="Start Month" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField variant="filled" label="Start Year" fullWidth />
            </Grid>
            <Grid item xs={6} sm={3}>
              {/* End month */}
              <MonthSelect label="End Month" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField variant="filled" label="End Year" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  const newPositions = positions.filter((_, idx) => idx !== index);
                  setPositions(newPositions);
                }}
              >
                Remove this position
              </Button>
            </Grid>
          </React.Fragment>
        ))}

      {/* Add Education button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setEducations([...educations, {}])}
        >
          Add Education
        </Button>
      </Grid>
      
      {/* Education forms */}
      {educations.map((education, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12}>
            <Typography variant="h6">Education {index + 1}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="University" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Degree" fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField variant="filled" label="Start Year" fullWidth />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField variant="filled" label="End Year" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                const newEducations = educations.filter((_, idx) => idx !== index);
                setEducations(newEducations);
              }}
            >
              Remove this education
            </Button>
          </Grid>
        </React.Fragment>
      ))}

      {/* Add Certification button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setCertifications([...certifications, {}])}
        >
          Add Certification
        </Button>
      </Grid>

      {/* Certification forms */}
      {certifications.map((certification, index) => (
        <React.Fragment key={index}>
          <Grid item xs={12}>
            <Typography variant="h6">Certification {index + 1}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Name" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Authority" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="License Number" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                const newCertifications = certifications.filter((_, idx) => idx !== index);
                setCertifications(newCertifications);
              }}
            >
              Remove this certification
            </Button>
          </Grid>
        </React.Fragment>
      ))}

        {/* Update Profile button */}
        <Grid item xs={12}>
        <Button variant="contained" color="primary" size="large">
            Update Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}