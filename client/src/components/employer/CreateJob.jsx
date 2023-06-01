import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Grid, Typography, Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import api from '../../api/api';

export default function CreateJobPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [jobType, setJobType] = React.useState('On Site');
  const [employment, setEmployment] = React.useState('Full Time');
  const [category, setCategory] = React.useState('IT / Software Development');
  const [salaryCurrency, setSalaryCurrency] = React.useState('GBP');
  const [salaryFrequency, setSalaryFrequency] = React.useState('Anually')
  const [open, setOpen] = React.useState(false);

  const [companyName, setCompanyName] = React.useState('');
  useEffect(() => {
    api.get('/me')
      .then(res => {
        const user = res.data;
        console.log(user);
        setCompanyName(user.companyName);
      });
  }, [])

  const handleChange = (event, setState) => {
    setState(event.target.value);
  };

  const onSubmit = async data => {
    try {
      const response = await api.post('/jobs', {
        ...data,
        type: jobType,
        employment: employment,
        category: category,
        currency: salaryCurrency,
        salaryFrequency: salaryFrequency,
        companyName: companyName
      });
      console.log(response.data); // log the created job
      setOpen(true);
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Create Job
            </Typography>
          </Grid>

          <Grid item xs={12}>
          <TextField fullWidth label="Job Title" variant="outlined" {...register("title", { required: "Job Title is required" })} error={errors.title} helperText={errors.title && errors.title.message} />
          </Grid>

          <Grid container item xs={12} spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Job Type</InputLabel>
                <Select
                  label="Job Type"
                  onChange={(e) => handleChange(e, setJobType)}
                  value={jobType}
                >
                  <MenuItem value="On Site">On Site</MenuItem>
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Job Location (Country, City)" variant="outlined" {...register("location", { required: "Job Location is required" })} error={errors.location} helperText={errors.location && errors.location.message} />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Employment</FormLabel>
              <RadioGroup row value={employment} onChange={(e) => setEmployment(e.target.value)}>
                <FormControlLabel value="Full Time" control={<Radio />} label="Full Time" />
                <FormControlLabel value="Part Time" control={<Radio />} label="Part Time" />
                <FormControlLabel value="Contractor" control={<Radio />} label="Contractor" />
                <FormControlLabel value="Temporary" control={<Radio />} label="Temporary" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                onChange={(e) => handleChange(e, setCategory)}
                value={category}
              >
                <MenuItem value="IT / Software Development">IT / Software Development</MenuItem>
                <MenuItem value="Design / Creative">Design / Creative</MenuItem>
                <MenuItem value="Architecture / Building / Construction">Architecture / Building / Construction</MenuItem>
                <MenuItem value="Engineering / Electronics">Engineering / Electronics</MenuItem>
                <MenuItem value="Accounting / Finance">Accounting / Finance</MenuItem>
                <MenuItem value="Education / Training">Education / Training</MenuItem>
                <MenuItem value="Automotive">Automotive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Description"
              multiline
              rows={4}
              variant="outlined"
              {...register("description", {
                required: "Job Description is required",
                maxLength: { value: 700, message: "Job Description should be 700 words or less" }
              })}
              error={errors.description}
              helperText={errors.description && errors.description.message} />
          </Grid>

          <Grid container item xs={12} spacing={3}>
            <Grid item xs={4}>
              <TextField fullWidth label="Salary Amount" variant="outlined" 
                {...register("salary", { 
                  required: "Salary Amount is required", 
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Salary Amount must be a number"
                  } 
                })} 
                error={errors.salary} 
                helperText={errors.salary && errors.salary.message} 
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Currency</InputLabel>
                <Select
                  label="Currency"
                  onChange={(e) => handleChange(e, setSalaryCurrency)}
                  value={salaryCurrency}
                >
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="TRY">TRY</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Salary Frequency</InputLabel>
                <Select
                  label="Salary Frequency"
                  onChange={(e) => handleChange(e, setSalaryFrequency)}
                  value={salaryFrequency}
                >
                  <MenuItem value="Anually">Anually</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Hourly">Hourly</MenuItem>
                  <MenuItem value="Fixed Price">Fixed Price</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained" 
              color="success"
              sx={{ borderRadius: '50px' }}
              type="submit"
            >
              Post Job
            </Button>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            width: '300px',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <DialogTitle id="alert-dialog-title" style={{ textAlign: 'center' }}>
            <CheckCircleOutlineIcon style={{ color: 'green', fontSize: '60px' }} />
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" component="div" style={{ textAlign: 'center' }}>
              Done!
            </Typography>
            <DialogContentText id="alert-dialog-description" style={{ textAlign: 'center' }}>
              Job Added
            </DialogContentText>
          </DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}