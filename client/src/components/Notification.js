import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useUI } from '../contexts/UIContext';

const Notification = () => {
  const { notification, clearNotification } = useUI();

  if (!notification) return null;

  const { message, type, duration } = notification;

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={duration}
      onClose={clearNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={clearNotification} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
