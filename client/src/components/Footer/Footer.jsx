import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Footer = (props) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgb(211, 211, 211)',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {'Copyright © Dias Mukash. 2023 EUL Graduation Project ❤️'}
      </Typography>
    </Box>
  );
};

export default Footer;