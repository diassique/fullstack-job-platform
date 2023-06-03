import React, { useEffect, useState } from 'react';
import { Grid, Typography, Container, Box, Avatar, TablePagination } from '@mui/material';
import api from '../../api/api';
import { Link } from "react-router-dom";
import SearchBox from '../applicant/SearchBox';

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    api.get('/applicants')
      .then(response => {
        const applicantProfile = response.data.map(applicant => {
          if (applicant.avatar) {
            return {
              ...applicant,
              avatar: `${api.defaults.baseURL}/uploads/applicants/${applicant._id}/${applicant.avatar}`
            };
          }
          return applicant;
        });
        setApplicants(applicantProfile);
      })
      .catch(error => console.error(error));
  }, []);

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(0);
  };

  const filteredApplicants = applicants.filter(applicant =>
    (applicant.firstName.toLowerCase() + ' ' + applicant.lastName.toLowerCase()).includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Find Applicants
          </Typography>
          <SearchBox onSearchChange={handleSearchChange} placeholder="Search applicants..." />
          {filteredApplicants.map(applicant => (
            <Link to={`/employer/applicants/${applicant._id}`}>
              <Box key={applicant._id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <Avatar src={applicant.avatar} alt={`${applicant.firstName} ${applicant.lastName}`} sx={{ marginRight: 2 }} />
                <Typography variant="h6">{`${applicant.firstName} ${applicant.lastName}`}</Typography>
              </Box>
            </Link>
          ))}
          <TablePagination
            component="div"
            count={filteredApplicants.length}
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