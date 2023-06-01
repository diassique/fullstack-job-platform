import * as React from 'react';
import { useState, useEffect } from 'react';
// import { useEffect, useCallback } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Button, Box, CssBaseline, Divider, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import List from '@mui/material/List';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { mainListItems, secondaryListItems, LogoutListItemButton  } from './listItems';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProfilePage from './Profile';
import SettingsPage from './Settings';
import CreateJobPage from './CreateJob';
import ApplicationsPage from './Applications';
import ManageJobsPage from './ManageJobs';
import api from '../../api/api';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import BlogPage from './Blog';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => setOpen(!open);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const dispatch = useDispatch();  
  const navigate = useNavigate();
  const handleLogout = () => { dispatch(logout()); handleCloseUserMenu(); };

  const [profileImg, setProfileImg] = useState(null);
  useEffect(() => {
    api.get('/me')
      .then((res) => {
        const userDetails = res.data;
        if(userDetails.avatar) {
          const avatarUrl = `${api.defaults.baseURL}/uploads/employers/${userDetails.id}/${userDetails.avatar}`;
          setProfileImg(avatarUrl);
        }
      })
      .catch(console.error);
  }, []);

  const user = useSelector((state) => state.auth.user);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{ backgroundColor: 'white', color: 'black', boxShadow: (theme) => theme.shadows[4] }}>
          <Toolbar sx={{ pr: '24px' }}>
            <IconButton
              edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>Employer Dashboard</Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Button
                startIcon={
                  profileImg ?
                  <img src={profileImg} alt="Profile" style={{width: 42, height: 42, borderRadius: '50%'}} /> :
                  <AccountCircleIcon sx={{ width: 42, height: 42 }}/>
                }
                endIcon={<ArrowDropDownIcon />}
                onClick={handleOpenUserMenu}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textTransform: 'none', 
                  color: 'inherit'
                }}
              >
                <Box textAlign="left">
                  <Typography variant="subtitle1" fontWeight="medium">
                    {user.companyName}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Button>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{ sx: { width: 'fit-content', minWidth: 200 } }} // updated this line to match the width of the button
              >
                <MenuItem onClick={() => {handleCloseUserMenu(); navigate('/employer/profile');}}>Profile</MenuItem>
                <MenuItem onClick={() => {handleCloseUserMenu(); navigate('/employer/settings');}}>Settings</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
            <IconButton onClick={toggleDrawer}><ChevronLeftIcon /></IconButton>
          </Toolbar>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1 }}>
              <List component="nav">
                {mainListItems}
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
              </List>
            </Box>
            <List>
              <LogoutListItemButton />
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="createjob" element={<CreateJobPage />} />
            <Route path="managejobs" element={<ManageJobsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="blog" element={<BlogPage />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function EmployerDashboard() {
  return <DashboardContent />;
}