import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem,
  Drawer, List, ListItem, ListItemText, Box, Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const commonStyles = {
    textDecoration: 'none',
    color: 'white',
    marginLeft: 2,
    fontWeight: 500
  };

  const drawerLinks = () => {
    if (!user) {
      return [
        { text: 'Login', to: '/login' },
        { text: 'Register', to: '/signup' }
      ];
    }
    if (user.userType === 'jobseeker') {
      return [
        { text: 'My Applications', to: '/applications' },
        { text: 'Saved Jobs', to: '/saved-jobs' },
        { text: 'Blogs', to: '/blogs' }
      ];
    }
    if (user.userType === 'employer') {
      return [
        { text: 'Post Job', to: '/post-job' },
        { text: 'My Jobs', to: '/my-jobs' },
        { text: 'View Candidates', to: '/candidates' },
        { text: 'Post Blog', to: '/post-blog' }
      ];
    }
    return [];
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#0A192F' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ ...commonStyles, color: 'white', textDecoration: 'none' }}
          >
            JobConnect
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {drawerLinks().map((item) => (
              <Typography
                key={item.text}
                component={Link}
                to={item.to}
                sx={commonStyles}
              >
                {item.text}
              </Typography>
            ))}

            {user && (
              <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 2, color: 'white' }}>
                <Avatar sx={{ width: 30, height: 30 }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            )}
          </Box>

          {/* Mobile Hamburger */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {drawerLinks().map((item) => (
              <ListItem button key={item.text} component={Link} to={item.to}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {user?.userType === 'jobseeker' && (
              <ListItem button component={Link} to="/profile">
                <ListItemText primary="Edit Profile" />
              </ListItem>
            )}
            {user && (
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Profile Menu (Desktop) */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {user?.userType === 'jobseeker' && (
          <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
            Edit Profile
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
