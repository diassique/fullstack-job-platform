import React, { useState, useEffect } from 'react';
import { Grid, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import JobCard from './JobCard';
import FilterBox from './FilterBox';
import SearchBox from './SearchBox'
import api from '../../api/api';

export default function FindJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSettings, setFilterSettings] = useState({
    type: '',
    location: '',
    category: '',
    salaryRange: [0, 1000000], // Assuming salary is a number
  });

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

  useEffect(() => {
    let newFilteredJobs = jobs;
    
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


  // dialog and job application
  const [applyJob, setApplyJob] = useState(null);
  const [isApplyDialogOpen, setApplyDialogOpen] = useState(false);
  const handleApply = (job) => {
    setApplyJob(job);
    setApplyDialogOpen(true);
  };
  const handleJobApplication = () => {
    // Placeholder function. You might want to do something else here, like send the job application through an API.
    setApplyDialogOpen(false);
  };


  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Find Jobs
          </Typography>
        </Grid>
        <Grid item xs={12}>
          
        </Grid>
        <Grid item xs={3}>
          <FilterBox onFilterChange={handleFilterChange} />
          
        </Grid>
        <Grid item xs={9}>
          <SearchBox onSearchChange={handleSearchChange} />
          {filteredJobs.map((job) => (
            <Grid item xs={12} key={job._id} style={{ marginBottom: '20px' }}>
              <JobCard job={job} onApply={handleApply} />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Dialog open={isApplyDialogOpen} onClose={() => setApplyDialogOpen(false)}>
        <DialogTitle>Apply to {applyJob && applyJob.title}</DialogTitle>
        <DialogContent>
          {/* Job details and application form here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleJobApplication} color="primary">
            Apply Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}