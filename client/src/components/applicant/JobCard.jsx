import { Card, CardContent, Typography, IconButton, Chip, Divider, Button } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import React from 'react';

const JobCard = ({ job, onApply, disabled }) => {
  return (
    <Card style={{ borderRadius: '15px', padding: '5px' }}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}> 
          <IconButton><BusinessIcon /></IconButton>
          <div style={{ marginLeft: '10px' }}>
            <Typography variant="h6">{job.title}</Typography>
            <Typography variant="body1">{job.companyName}</Typography>
          </div>
        </div>
        <Typography variant="body2" style={{ marginBottom: '20px' }}>
          {job.description}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton><LocationOnIcon color="primary" /></IconButton>
            <Typography variant="body2" style={{ marginLeft: '5px' }}>{job.location}</Typography>
          </div>
          <div>
            <Chip label={job.type} style={{ marginRight: '5px' }} />
            <Chip label={job.employment} style={{ marginRight: '5px' }} />
            <Chip label={job.category} />
          </div>
        </div>
        <Divider style={{ margin: '10px 0' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton><AttachMoneyIcon color="primary" /></IconButton>
            <Typography variant="body2" style={{ marginLeft: '5px' }}>{`${job.salary} ${job.currency} / ${job.salaryFrequency}`}</Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '15px' }}>
            <IconButton><PeopleIcon color="primary" /></IconButton>
            <Typography variant="body2" style={{ marginLeft: '5px' }}>{`${job.activeApplications} people applied`}</Typography>
            <Button variant="contained" color="primary" style={{ marginLeft: '50px' }} onClick={() => onApply(job)} disabled={disabled}>Apply</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
