import React, { useEffect, useState } from 'react';
import { Grid, Typography, Container, Box, Avatar } from '@mui/material';
import api from '../../api/api';
import { Link } from 'react-router-dom';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get('/employers')
      .then(response => {
        const companyProfile = response.data.map(company => {
          if (company.avatar) {
            return {
              ...company,
              avatar: `${api.defaults.baseURL}/uploads/employers/${company._id}/${company.avatar}`
            };
          }
          return company;
        });
        setCompanies(companyProfile);
      })
      .catch(error => console.error(error));
  }, []);  

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Companies
          </Typography>
          {companies.map(company => (
            <Link to={`/applicant/companies/${company._id}`}>
              <Box key={company._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Avatar src={company.avatar} alt={company.companyName} sx={{ marginRight: 2 }} />
                <Typography variant="h6">{company.companyName}</Typography>
              </Box>
            </Link>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}