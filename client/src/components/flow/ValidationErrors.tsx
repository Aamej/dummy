import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface ValidationErrorsProps {
  errors: string[];
  onClose?: () => void;
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors, onClose }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <Paper
      sx={{
        mb: 2,
        p: 2,
        bgcolor: 'error.light',
        color: 'error.contrastText',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ErrorIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Validation Errors
        </Typography>
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ ml: 'auto', color: 'inherit' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <List dense>
        {errors.map((error, index) => (
          <ListItem key={index}>
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <ErrorIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={error} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ValidationErrors;
