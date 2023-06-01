import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, TablePagination } from '@mui/material';
import JobCard from './JobCard';
import FilterBox from './FilterBox';
import SearchBox from './SearchBox';
import api from '../../api/api';
import { useForm } from 'react-hook-form';
import { Snackbar, Alert } from '@mui/material';

export default function FindJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSettings, setFilterSettings] = useState({
    type: '',
    location: '',
    category: '',
    salaryRange: [0, 1000000],
  });

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
        setFilteredJobs(response.data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  // filter jobs
  useEffect(() => {
    let newFilteredJobs = jobs;

    setPage(0);
    
    if (search) {
      newFilteredJobs = newFilteredJobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) || 
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterSettings.type) {
      newFilteredJobs = newFilteredJobs.filter(job => job.type === filterSettings.type);
    }

    if (filterSettings.location) {
      newFilteredJobs = newFilteredJobs.filter(job => job.location.toLowerCase().includes(filterSettings.location.toLowerCase()));
    }

    if (filterSettings.category) {
      newFilteredJobs = newFilteredJobs.filter(job => job.category === filterSettings.category);
    }

    newFilteredJobs = newFilteredJobs.filter(job => {
      const jobSalary = parseInt(job.salary);
      return jobSalary >= filterSettings.salaryRange[0] && jobSalary <= filterSettings.salaryRange[1];
    });

    setFilteredJobs(newFilteredJobs);
  }, [filterSettings, jobs, search]);

  const handleSearchChange = (newSearch) => {
    setSearch(newSearch);
  };

  const handleFilterChange = (newFilterSettings) => {
    setFilterSettings(newFilterSettings);
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setSnackbar(prevSnackbar => ({ ...prevSnackbar, open: false }));
  };

  // dialog and job application
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [applyJob, setApplyJob] = useState(null);
  const [isApplyDialogOpen, setApplyDialogOpen] = useState(false);
  const handleApply = (job) => {
    setApplyJob(job);
    setApplyDialogOpen(true);
  };

  const handleJobApplication = handleSubmit(async (data) => {
    try {
      const response = await api.post('/applications', {
        jobId: applyJob._id, 
        recruiterId: applyJob.userId, 
        sop: data.sop
      });
      
      if(response.status === 201) {
        setSnackbar({ open: true, message: 'Application successful', severity: 'success' });
        const response = await api.get('/applicant/applications');
        setUserApplications(response.data);
      } else {
        setSnackbar({ open: true, message: 'Application failed', severity: 'error' });
      }

      // window.location.reload();
      
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
    
    setApplyDialogOpen(false);
  });

  // check if user already applied to a job
  const [userApplications, setUserApplications] = useState([]);
  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        const response = await api.get('/applicant/applications');
        setUserApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch user applications:', error);
      }
    };
    fetchUserApplications();
  }, []);

  console.log(userApplications)
  return (
    <Container maxWidth="lg">
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Find Jobs
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <FilterBox onFilterChange={handleFilterChange} />
        </Grid>
        <Grid item xs={9}>
          <SearchBox onSearchChange={handleSearchChange} />
          {filteredJobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job) => {
            const hasApplied = userApplications.some(application => String(application.jobId._id) === String(job._id));
            return (
              <Grid item xs={12} key={job._id} style={{ marginBottom: '20px' }}>
                <JobCard job={job} onApply={handleApply} disabled={hasApplied} />
              </Grid>
            );
          })}
          <TablePagination
            component="div"
            count={filteredJobs.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25]}
          />

        </Grid>
      </Grid>
      <Dialog open={isApplyDialogOpen} onClose={() => setApplyDialogOpen(false)}>
        <DialogTitle>Apply to {applyJob && applyJob.title}</DialogTitle>
        <form onSubmit={handleJobApplication}>
          <DialogContent>
            {applyJob && (
              <>
                <Typography variant="h6">Company: {applyJob.companyName}</Typography>
                <Typography variant="subtitle1">Job Title: {applyJob.title}</Typography>
                <Typography variant="subtitle1">Type: {applyJob.type}</Typography>
                <Typography variant="subtitle1">Location: {applyJob.location}</Typography>
                <Typography variant="subtitle1">Employment: {applyJob.employment}</Typography>
                <Typography variant="subtitle1">Category: {applyJob.category}</Typography>
                <Typography variant="subtitle2">Description: {applyJob.description}</Typography>
                <Typography variant="subtitle2">{`Salary: ${applyJob.salary} ${applyJob.currency} / ${applyJob.salaryFrequency}`}</Typography>
                <Typography variant="subtitle2">{`${applyJob.activeApplications} people applied`}</Typography>
                <TextField
                  label="Statement of Purpose"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  id="sop"
                  name="sop"
                  {...register('sop', { required: 'Statement of Purpose is required.' })}
                  margin="normal"
                  error={errors.sop}
                  helperText={errors.sop && errors.sop.message}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApplyDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Apply Now
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}