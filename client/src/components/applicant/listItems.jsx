import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

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

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Additional Features
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <ContactPageIcon />
      </ListItemIcon>
      <ListItemText primary="CV Creator" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Career Resources" />
    </ListItemButton>
  </React.Fragment>
);