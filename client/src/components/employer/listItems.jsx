import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import WorkHistoryRoundedIcon from '@mui/icons-material/WorkHistoryRounded';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import MarkunreadMailboxRoundedIcon from '@mui/icons-material/MarkunreadMailboxRounded';
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
  const handleClick = () => navigate('/employer/settings');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItemButton>
  );
};

const CreateJobListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/employer/createjob');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <MarkunreadMailboxRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Create Job" />
    </ListItemButton>
  );
};

const ProfileListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/employer/profile');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
  );
};

const ManageJobsListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/employer/managejobs');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <WorkHistoryRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Manage Jobs" />
    </ListItemButton>
  );
};

const ApplicantsListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/employer/applications');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <ApartmentIcon />
      </ListItemIcon>
      <ListItemText primary="Applications" />
    </ListItemButton>
  );
};

const BlogPostsListItemButton = () => {
  const navigate = useNavigate();
  const handleClick = () => navigate('/employer/blog');
  return (
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="HR Resources" />
    </ListItemButton>
  );
};

export const mainListItems = (
  <React.Fragment>
    <CreateJobListItemButton />
    <ManageJobsListItemButton />
    <ApplicantsListItemButton />
    <ProfileListItemButton />
    <SettingsListItemButton />
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Additional Features
    </ListSubheader>
    <BlogPostsListItemButton />
  </React.Fragment>
);

export { LogoutListItemButton };