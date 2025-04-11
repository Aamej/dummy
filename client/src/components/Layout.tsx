import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Notification from './Notification';
import { useUI } from '../contexts/UIContext';

const Layout: React.FC = () => {
  const { notification } = useUI();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }} maxWidth={false}>
        <Outlet />
      </Container>
      {notification && <Notification />}
    </Box>
  );
};

export default Layout;
