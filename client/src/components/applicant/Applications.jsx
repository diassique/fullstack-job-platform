import React, { useEffect, useState } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import api from '../../api/api'; // Import your api instance

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get('/applicant/applications')
      .then(response => {
        // Update each application to rename _id to id
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
  

  const columns = [
    {
      field: 'jobId', 
      headerName: 'Job ID', 
      width: 250,
      valueGetter: (params) => params.row.jobId ? params.row.jobId._id : 'Job Deleted',
      renderCell: (params) => {
        if (params.value === 'Job Deleted') {
          return (
            <Button variant="outlined" color="secondary" disabled>
              {params.value}
            </Button>
          );
        } else {
          return params.value;
        }
      }
    },   
    { 
      field: 'companyName', 
      headerName: 'Company Name', 
      width: 250,
      valueGetter: (params) => params.row.recruiterId.companyName, 
    },
    {
      field: 'jobTitle', 
      headerName: 'Job Title', 
      width: 250, 
      valueGetter: (params) => params.row.jobId ? params.row.jobId.title : 'Job Deleted',
      renderCell: (params) => {
        if (params.value === 'Job Deleted') {
          return (
            <Button variant="outlined" color="secondary" disabled>
              {params.value}
            </Button>
          );
        } else {
          return params.value;
        }
      }
    },    
    {
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => {
        let color, icon;
        switch(params.value) {
          case 'applied':
            color = '#808080'; // grey color
            icon = <HourglassEmptyIcon/>;
            break;
          case 'shortlisted':
            color = '#FFA500'; // orange color
            icon = <ThumbUpIcon/>;
            break;
          case 'accepted':
            color = '#008000'; // green color
            icon = <CheckCircleOutlineIcon/>;
            break;
          case 'rejected':
            color = '#FF0000'; // red color
            icon = <HighlightOffIcon/>;
            break;
          default:
            color = '#808080'; // grey color
            icon = null;
        }
    
        return (
          <Button variant="outlined" sx={{ borderColor: color, color: color }} startIcon={icon}>
            {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          </Button>
        )
      }
    },
    { 
      field: 'dateOfApplication', 
      headerName: 'Application Date', 
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
    }
  ];
  

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
          autoHeight 
          getRowId={(row) => row._id}  // New prop here
        />
        </Grid>
      </Grid>
    </Container>
  );
}
