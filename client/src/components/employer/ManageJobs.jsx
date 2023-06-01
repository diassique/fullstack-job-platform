import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, Container,
  Card, CardContent, CardActions, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import api from '../../api/api';
import { useForm } from 'react-hook-form';
import { Snackbar, Alert } from '@mui/material';

import StatsCharts from './StatsCharts';
import { useSelector } from 'react-redux';

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleOpenDialog = (jobId) => { setJobToDelete(jobId); setDialogOpen(true)};  
  const handleCloseDialog = () => { setJobToDelete(null); setDialogOpen(false)};

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setSnackbar(prevSnackbar => ({ ...prevSnackbar, open: false }));
  };

  const handleDeleteJob = () => {
    api.delete(`/jobs/${jobToDelete}`)
      .then(() => {
        setJobs(jobs.filter(job => job._id !== jobToDelete));
        handleCloseDialog();
        setSnackbar({ open: true, message: 'Job deleted successfully', severity: 'success' });
      })
      .catch(err => console.error('Failed to delete job:', err));
  };

  useEffect(() => {
    api.get('/employer/jobs')
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => console.error('Failed to fetch jobs:', err));
  }, []);

  // edit jobs
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const handleOpenEditDialog = (jobId) => {
    const job = { ...jobs.find((job) => job._id === jobId) };
    ['title', 'location', 'description', 'salary'].forEach(field => setValue(field, job[field]));
    setJobToEdit(job);
    setEditJobDialogOpen(true);
  };
  const handleCloseEditDialog = () => {
    setJobToEdit(null);
    setEditJobDialogOpen(false);
  };
  const handleEditJob = (updatedJob) => {
    api.put(`/jobs/${jobToEdit._id}`, updatedJob)
      .then(res => {
        setJobs(jobs.map(job => job._id === jobToEdit._id ? res.data : job));
        setEditJobDialogOpen(false);
        setSnackbar({ open: true, message: 'Job updated successfully', severity: 'success' });
      })
      .catch(err => console.error('Failed to update job:', err));
  };

  const user = useSelector((state) => state.auth.user);

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
            Manage Jobs
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <StatsCharts employerId={user.id} />
        </Grid>
        {jobs.map((job, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{job.title}</Typography>
                <Typography variant="subtitle1" gutterBottom>{job.companyName}</Typography>
                <Typography variant="body2" color="text.secondary">{job.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {job.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {job.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Employment: {job.employment}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {job.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salary: {job.salary} {job.currency} ({job.salaryFrequency})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Posted on: {new Date(job.dateOfPosting).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Applications: {job.activeApplications}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accepted Candidates: {job.acceptedCandidates}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleOpenEditDialog(job._id)}>Edit</Button>
                <Button size="small" color="secondary" onClick={() => handleOpenDialog(job._id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={editJobDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <DialogTitle id="edit-dialog-title">{"Edit Job"}</DialogTitle>
        <DialogContent>
          {jobToEdit && (
            <form id="edit-job-form" onSubmit={handleSubmit(handleEditJob)}>
              <TextField 
                autoFocus margin="dense" id="title" label="Job Title" type="text" 
                fullWidth 
                {...register('title', { required: 'Job Title is required.' })}
                helperText={errors.title?.message}
                error={!!errors.title}
              />
              <TextField 
                autoFocus margin="dense" id="location" label="Location" type="text" 
                fullWidth 
                {...register('location', { required: 'Location is required.' })}
                helperText={errors.location?.message}
                error={!!errors.location}
              />
              <TextField 
                autoFocus margin="dense" id="description" label="Description" type="text" 
                fullWidth 
                {...register('description', { required: 'Description is required.' })}
                helperText={errors.description?.message}
                error={!!errors.description}
              />
              <TextField 
                autoFocus 
                margin="dense" 
                id="salary" 
                label="Salary" 
                type="text" 
                fullWidth 
                {...register('salary', { 
                  required: 'Salary is required.', 
                  pattern: {
                    value: /^\d+$/,
                    message: 'Salary must be a number.'
                  } 
                })}
                helperText={errors.salary?.message}
                error={!!errors.salary}
              />
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button form="edit-job-form" type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this job?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteJob} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}