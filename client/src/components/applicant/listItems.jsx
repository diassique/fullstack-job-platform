import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

const LogoutListItemButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </ListItemButton>
  );
};

const SettingsListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/applicant/settings');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItemButton>
  );
};

const FindJobsListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/applicant/jobs');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Find Jobs" />
    </ListItemButton>
  );
};

const ProfileListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/applicant/profile');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
  );
};

const ApplicationsListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/applicant/applications');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <WorkHistoryRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Applications" />
    </ListItemButton>
  );
};

const CompaniesListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/applicant/companies');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <ApartmentIcon />
      </ListItemIcon>
      <ListItemText primary="Companies" />
    </ListItemButton>
  );
};

export const mainListItems = (
  <React.Fragment>
    <FindJobsListItemButton />
    <ApplicationsListItemButton />
    <ProfileListItemButton />
    <CompaniesListItemButton />
    <SettingsListItemButton />
  </React.Fragment>
);

export { LogoutListItemButton };