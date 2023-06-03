import React, { useEffect, useState } from 'react';
import { Grid, Typography, Container, Box, Avatar, TablePagination } from '@mui/material';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';  // replace with actual path

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(0);
  };

  const filteredCompanies = companies.filter(company => 
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Companies
          </Typography>
          <SearchBox onSearchChange={handleSearchChange} placeholder="Search companies…" />
          {filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(company => (
            <Link to={`/applicant/companies/${company._id}`} key={company._id}>
              <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Avatar src={company.avatar} alt={company.companyName} sx={{ marginRight: 2 }} />
                <Typography variant="h6">{company.companyName}</Typography>
              </Box>
            </Link>
          ))}
          <TablePagination
            component="div"
            count={filteredCompanies.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}