import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import api from '../../api/api';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get('/employer/applications')
      .then(response => {
        const updatedApplications = response.data.map(app => ({
          ...app,
          id: app._id,
        }));
        setApplications(updatedApplications);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const [openSOP, setOpenSOP] = useState(false);
  const [sopContent, setSopContent] = useState('');

  const handleOpenSOP = (sop) => {
    setSopContent(sop);
    setOpenSOP(true);
  };
  
  const handleCloseSOP = () => {
    setOpenSOP(false);
  };
  
  const columns = [
    { field: 'id', headerName: 'Application ID', width: 200 },
    { 
      field: 'firstName', 
      headerName: 'First Name', 
      width: 200, 
      valueGetter: (params) => params.row.userId.firstName
    },
    { 
      field: 'lastName', 
      headerName: 'Last Name', 
      width: 200, 
      valueGetter: (params) => params.row.userId.lastName
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200, 
      valueGetter: (params) => params.row.userId.email
    },
    { 
      field: 'jobTitle', 
      headerName: 'Job Title', 
      width: 200, 
      valueGetter: (params) => params.row.jobId ? params.row.jobId.title : 'Job Deleted'
    },    
    {
      field: 'resume',
      headerName: 'Resume',
      width: 200,
      renderCell: (params) => (
        params.row.userId.resume
          ? <Button variant="contained" href={`${api.defaults.baseURL}/uploads/resumes/${params.row.userId._id}/${params.row.userId.resume}`} download>Download</Button>
          : <Button variant="contained" disabled>No resume</Button>
      )
    },   
    {
      field: 'status', 
      headerName: 'Status', 
      width: 300, 
      renderCell: (params) => {
        if (params.row.status === 'shortlisted') {
          return (
            <div>
              <Button variant="contained" color="primary" onClick={() => handleUpdate(params.row, 'accepted')}>Accept</Button>
              <Button variant="contained" color="secondary" disabled>Reject</Button>
            </div>
          );
        } else if (params.row.status === 'applied') {
          return (
            <div>
              <Button variant="contained" color="primary" onClick={() => handleUpdate(params.row, 'shortlisted')}>Shortlist</Button>
              <Button variant="contained" color="secondary" onClick={() => handleUpdate(params.row, 'rejected')}>Reject</Button>
            </div>
          );
        } else {
          return (
            <div>
              <Button variant="contained" disabled>{params.row.status}</Button>
            </div>
          );
        }
      }
    },
    {
      field: 'sop',
      headerName: 'SOP',
      width: 200,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleOpenSOP(params.row.sop)}>View SOP</Button>
      ),
    }  
  ];

  const handleUpdate = async (application, status) => {
    try {
      const response = await api.put(`/applications/${application.id}`, { status });
      if (response.status === 200) {
        setApplications(applications.map(app => app.id === application.id ? { ...app, status: status } : app));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Applications
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <DataGrid 
            rows={applications} 
            columns={columns} 
            pageSize={5} 
            rowsPerPageOptions={[5]}
          />

          <Dialog
            open={openSOP}
            onClose={handleCloseSOP}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Statement of Purpose"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {sopContent}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSOP} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Container>
  );
}