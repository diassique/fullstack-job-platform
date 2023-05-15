import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: 'black' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="h6" component="div" sx={{ textAlign: 'left', ml: 'auto' }}>
                Recruitment System
              </Typography>
            </RouterLink>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button variant="contained" color="primary" component={RouterLink} to="/signin" sx={{ ml: 3 }}>
              Sign In
            </Button>
            <Button variant="contained" color="secondary" component={RouterLink} to="/signup" sx={{ ml: 2 }}>
              Sign Up
            </Button>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { sm: 'none' } }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose} component={RouterLink} to="/signin">
              Sign In
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={RouterLink} to="/signup">
              Sign Up
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}