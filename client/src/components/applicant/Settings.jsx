import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, TextField, Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AddIcon from '@mui/icons-material/Add';
import { Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import api from '../../api/api';

const Input = styled('input')({
  display: 'none',
});

function MonthSelect({ label, onChange, value }) {
  return (
    <TextField
      select
      label={label}
      fullWidth
      variant="filled"
      SelectProps={{ native: true }}
      onChange={onChange}
      value={value}
    >
      <option value="" />
      <option value="January">January</option>
      <option value="February">February</option>
      <option value="March">March</option>
      <option value="April">April</option>
      <option value="May">May</option>
      <option value="June">June</option>
      <option value="July">July</option>
      <option value="August">August</option>
      <option value="September">September</option>
      <option value="October">October</option>
      <option value="November">November</option>
      <option value="December">December</option>
    </TextField>
  );
}

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
        const avatarUrl = `${api.defaults.baseURL}/uploads/applicants/${userDetails.id}/${userDetails.avatar}`;
        setProfileImg(avatarUrl);
      }
      if(userDetails.resume) {
        setResumeUploaded(true);
        const resumeUrl = `${api.defaults.baseURL}/uploads/resumes/${userDetails.id}/${userDetails.resume}`;
        setResumePath(resumeUrl);
      }})
      .catch(console.error);
  }, []);
  

  const [positions, setPositions] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Fetch initial user details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [shortBio, setShortBio] = useState('');
  useEffect(() => {
    api.get('/me')
      .then(res => {
        const user = res.data;
        console.log(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setLocation(user.location);
        setPhone(user.phone);
        setProfessionalTitle(user.professionalTitle);
        setShortBio(user.shortBio);
      });
  }, []);

  const handleUpdateProfile = () => {
    api.put('/applicant/details', { firstName, lastName, location, phone, professionalTitle, shortBio })
      .then(res => {
        setSnackbar({ open: true, message: 'Profile update success', severity: 'success' });
      })
      .catch(err => {
        setSnackbar({ open: true, message: 'Profile update error', severity: 'error' });
      });
  };

  // avatar related fun
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
    setSnackbar({ open: true, message: 'Profile deleted successfully', severity: 'success' });
    window.location.reload();
  };

  // resume part
  const [resumePath, setResumePath] = useState(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  useEffect(() => {
    api.get('/applicant/resume').then(res => setResumeUploaded(res.data.resumeExists)).catch(console.error);
  }, []);

  const handleResumeUpload = (e) => {
    if (e.target.files[0]) {
      const formData = new FormData();
      formData.append('resume', e.target.files[0]);
  
      api.post('/applicant/resume', formData)
        .then((res) => {
          console.log(res.data);
          window.location.reload();
        })
        .catch(console.error);
    }
  };
  const handleResumeRemove = () => {
    api.delete('/applicant/resume').then(() => setResumeUploaded(false)).catch(console.error);
  };

  // job positions
  useEffect(() => {
    api.get('/applicant/positions')
      .then(response => {
        setPositions(response.data);
      })
      .catch(err => {
        console.error(err);
        // Handle error accordingly
      });
  }, []);
  const handleSavePosition = (index) => {
    const position = positions[index];

    if (position._id) { // Update if it's an existing position
      api.put(`/applicant/positions/${position._id}`, position)
        .then(response => {
          // Replace the position in the array with the updated one from the server
          const updatedPositions = [...positions];
          updatedPositions[index] = response.data;
          setPositions(updatedPositions);
        })
        .catch(err => {
          console.error(err);
          // Handle error accordingly
        });
    } else { // Add a new position
      api.post('/applicant/positions', position)
        .then(response => {
          // Replace the position in the array with the one from the server (which includes the _id)
          const updatedPositions = [...positions];
          updatedPositions[index] = response.data;
          setPositions(updatedPositions);
        })
        .catch(err => {
          console.error(err);
          // Handle error accordingly
        });
    }
    setSnackbar({ open: true, message: 'Position entry saved', severity: 'success' });
  };
  const handleRemovePosition = (index) => {
    const position = positions[index];
    
    if (position._id) { // Only delete it on the server if it's an existing position
      api.delete(`/applicant/positions/${position._id}`)
        .then(() => {
          const updatedPositions = positions.filter((_, idx) => idx !== index);
          setPositions(updatedPositions);
        })
        .catch(err => {
          console.error(err);
          // Handle error accordingly
        });
    } else { // If it's a new position (without _id), just remove it from the local state
      const updatedPositions = positions.filter((_, idx) => idx !== index);
      setPositions(updatedPositions);
    }
  };
  
  // education section
  useEffect(() => {
    const fetchEducation = async () => {
      const response = await api.get("/applicant/education");
      setEducations(response.data);
    };
    fetchEducation();
  }, []);
  const handleAddEducation = () => {
    setEducations([...educations, { university: "", degree: "", startYear: "", endYear: "", description: "" }]);
  };
  const handleUpdateEducation = async (index) => {
    const education = educations[index];
    if (education._id) {
      await api.put(`/applicant/education`, {...education, educationId: education._id});
    } else {
      const response = await api.post("/applicant/education", education);
      educations[index]._id = response.data._id;
    }
    setSnackbar({ open: true, message: 'Education entry saved', severity: 'success' });
  };
  const handleRemoveEducation = async (index) => {
    const education = educations[index];
    if (education._id) {
      await api.delete(`/applicant/education/${education._id}`);
    }
    const newEducations = educations.filter((_, idx) => idx !== index);
    setEducations(newEducations);
  };


  // certification section
  useEffect(() => {
    const fetchCertification = async () => {
      const response = await api.get("/applicant/certification");
      setCertifications(response.data);
    };
    fetchCertification();
  }, []);
  const handleAddCertification = () => {
    setCertifications([...certifications, { name: "", authority: "", licenseNumber: "", description: "" }]);
  };
  const handleUpdateCertification = async (index) => {
    const certification = certifications[index];
    if (certification._id) {
      await api.put(`/applicant/certification`, {...certification, certificationId: certification._id});
    } else {
      const response = await api.post("/applicant/certification", certification);
      certifications[index]._id = response.data._id;
    }
    setSnackbar({ open: true, message: 'Certification entry saved', severity: 'success' });
  }
  const handleRemoveCertification = async (index) => {
    const certification = certifications[index];
    if (certification._id) {
      await api.delete(`/applicant/certification/${certification._id}`);
    }
    const newCertifications = certifications.filter((_, idx) => idx !== index);
    setCertifications(newCertifications);
  }


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
            Personal Info
          </Typography>
        </Grid>
        {/* Avatar upload section */}
        <Grid item xs={12}>
          <Grid container direction="column" alignItems="center" justifyContent="center">
            <Avatar src={profileImg || undefined} sx={{ width: 100, height: 100, m: 1, backgroundColor: 'white' }}>
              {profileImg === null && <AccountCircleIcon style={{ fontSize: 130, color: 'grey' }} />}
            </Avatar>
            <Box display="flex" justifyContent="center" pt={1}>
              <Input accept="image/*" id="avatar-upload" type="file" onChange={handleAvatarChange}/>
              <label htmlFor="avatar-upload">
                <Box mr={2}><Button variant="contained" sx={{ borderRadius: 50 }} color="primary" component="span" startIcon={<PhotoCamera />}>Upload</Button></Box>
              </label>
              <Button variant="outlined" sx={{ borderRadius: 50 }} color="error" component="span" onClick={handleAvatarRemove} startIcon={<DeleteIcon />}>Delete</Button>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TextField label="Email" fullWidth value={email} InputProps={{ readOnly: true }} disabled />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="First Name" variant="outlined" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Last Name" variant="outlined" value={lastName} onChange={e => setLastName(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Location" variant="outlined" value={location} onChange={e => setLocation(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Phone" variant="outlined" value={phone} onChange={e => setPhone(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Professional Title" variant="outlined" value={professionalTitle} onChange={e => setProfessionalTitle(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Short Bio" variant="outlined" value={shortBio} onChange={e => setShortBio(e.target.value)} multiline rows={4}/>
        </Grid>

        {/* Upload resume */}
        <Grid item xs={12}>
          <Box sx={{ border: '2px solid #2E79D5', borderRadius: '5px', backgroundColor: 'white', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexDirection: 'column', p: 2, mt: 2
            }}
          >
            <UploadFileIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Box mb={2}>Upload your resume</Box>
            <Input accept="application/pdf" id="resume-upload" type="file" onChange={handleResumeUpload}/>
            <label htmlFor="resume-upload">
              <Button component="span" variant="contained" sx={{ borderRadius: 50 }} >Upload Resume</Button>
              {resumeUploaded && (
                <>
                  <Button  variant="outlined" sx={{ borderRadius: 50, ml: 1 }} color="error" component="span" onClick={handleResumeRemove} startIcon={<DeleteIcon />}>
                    Delete CV
                  </Button>
                  <Button variant="outlined" sx={{ borderRadius: 50, ml: 1 }}  component="a" href={resumePath} download >
                    Download CV
                  </Button>
                </>
              )}
            </label>
          </Box>
        </Grid>

        {/* Employment record book */}
        <Grid item xs={12}>
          <Button variant="contained" color="success" onClick={() => setPositions([...positions, {}])} sx={{ borderRadius: 50 }} startIcon={<AddIcon />}>
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
              <TextField label="Occupation/Title" value={position.title || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].title = e.target.value;
                  setPositions(newPositions);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Company" fullWidth value={position.company || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].company = e.target.value;
                  setPositions(newPositions);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" fullWidth value={position.location || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].location = e.target.value;
                  setPositions(newPositions);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              {/* Start month */}
              <MonthSelect label="Start Month" value={position.startMonth || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].startMonth = e.target.value;
                  setPositions(newPositions);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField variant="filled" label="Start Year" fullWidth value={position.startYear || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].startYear = e.target.value;
                  setPositions(newPositions);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              {/* End month */}
              <MonthSelect label="End Month" value={position.endMonth || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].endMonth = e.target.value;
                  setPositions(newPositions);
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField variant="filled" label="End Year" fullWidth value={position.endYear || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].endYear = e.target.value;
                  setPositions(newPositions);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" fullWidth multiline rows={4} value={position.description || ''}
                onChange={(e) => {
                  const newPositions = [...positions];
                  newPositions[index].description = e.target.value;
                  setPositions(newPositions);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="error" sx={{ borderRadius: 50 }} startIcon={<DeleteIcon />}
                onClick={() => handleRemovePosition(index)}
              >
                Remove this position
              </Button>
              <Button variant="contained" color="primary" sx={{ borderRadius: 50, ml: 1 }} startIcon={<SaveIcon />}
                onClick={() => handleSavePosition(index)}
              >
                Save this position
              </Button>
            </Grid>
          </React.Fragment>
        ))}

      {/* Add Education button */}
      <Grid item xs={12}>
        <Button variant="contained" color="success" onClick={handleAddEducation} sx={{ borderRadius: 50 }} startIcon={<AddIcon />}>
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
            <TextField label="University" fullWidth value={education.university}
              onChange={(e) => {
                const newEducation = [...educations];
                newEducation[index].university = e.target.value;
                setEducations(newEducation);
              }} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Degree" fullWidth value={education.degree}
              onChange={(e) => {
                const newEducation = [...educations];
                newEducation[index].degree = e.target.value;
                setEducations(newEducation);
              }} 
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField variant="filled" label="Start Year" fullWidth value={education.startYear}
              onChange={(e) => {
                const newEducation = [...educations];
                newEducation[index].startYear = e.target.value;
                setEducations(newEducation);
              }} 
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField variant="filled" label="End Year" fullWidth value={education.endYear}
              onChange={(e) => {
                const newEducation = [...educations];
                newEducation[index].endYear = e.target.value;
                setEducations(newEducation);
              }} 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth multiline rows={4} value={education.description}
              onChange={(e) => {
                const newEducation = [...educations];
                newEducation[index].description = e.target.value;
                setEducations(newEducation);
              }} 
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" color="error" sx={{ borderRadius: 50 }} startIcon={<DeleteIcon />}
              onClick={() => handleRemoveEducation(index)}
            >
              Remove this education
            </Button>
            <Button variant="contained" color="primary" sx={{ borderRadius: 50, ml: 1 }} startIcon={<SaveIcon />}
              onClick={() => handleUpdateEducation(index)}
            >
              Save this position
            </Button>
          </Grid>
        </React.Fragment>
      ))}

      {/* Add Certification button */}
      <Grid item xs={12}>
        <Button variant="contained" color="success" onClick={handleAddCertification} sx={{ borderRadius: 50 }} startIcon={<AddIcon />}>
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
          <TextField label="Name" fullWidth value={certification.name}
            onChange={(e) => {
              const newCertifications = [...certifications];
              newCertifications[index].name = e.target.value;
              setCertifications(newCertifications);
            }}
          />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField label="Authority" fullWidth value={certification.authority}
            onChange={(e) => {
              const newCertifications = [...certifications];
              newCertifications[index].authority = e.target.value;
              setCertifications(newCertifications);
            }} 
          />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField label="License Number" fullWidth value={certification.licenseNumber}
            onChange={(e) => {
              const newCertifications = [...certifications];
              newCertifications[index].licenseNumber = e.target.value;
              setCertifications(newCertifications);
            }} 
          />
          </Grid>
          <Grid item xs={12}>
          <TextField label="Description" fullWidth multiline rows={4} value={certification.description}
            onChange={(e) => {
              const newCertifications = [...certifications];
              newCertifications[index].description = e.target.value;
              setCertifications(newCertifications);
            }} 
          />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" color="error" sx={{ borderRadius: 50 }} startIcon={<DeleteIcon />}
              onClick={() => handleRemoveCertification(index)}
            >
              Remove this certification
            </Button>
            <Button variant="contained" color="primary" sx={{ borderRadius: 50, ml: 1 }} startIcon={<SaveIcon />}
              onClick={() => handleUpdateCertification(index)}
            >
              Save this certification
            </Button>
          </Grid>
        </React.Fragment>
      ))}
        {/* Update Profile button */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpdateProfile}>Update Profile</Button>
        </Grid>
      </Grid>
    </Container>
  );
}