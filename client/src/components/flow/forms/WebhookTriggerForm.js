import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Paper,
} from '@mui/material';

const WebhookTriggerForm = ({ config, onChange, errors = {} }) => {
  // Handle endpoint change
  const handleEndpointChange = (e) => {
    onChange({ endpoint: e.target.value });
  };

  // Handle method change
  const handleMethodChange = (e) => {
    onChange({ method: e.target.value });
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Webhook Endpoint"
        value={config.endpoint || ''}
        onChange={handleEndpointChange}
        margin="normal"
        error={!!errors.endpoint}
        helperText={errors.endpoint || 'The path where this webhook will receive requests'}
      />

      <FormControl fullWidth margin="normal" error={!!errors.method}>
        <InputLabel id="method-label">HTTP Method</InputLabel>
        <Select
          labelId="method-label"
          value={config.method || 'POST'}
          onChange={handleMethodChange}
          label="HTTP Method"
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </Select>
        <FormHelperText>{errors.method || 'The HTTP method this webhook will accept'}</FormHelperText>
      </FormControl>

      <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="subtitle2" gutterBottom>
          Webhook URL
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          {config.endpoint ? `https://yourapp.com/api/webhooks${config.endpoint}` : 'Define an endpoint path above'}
        </Typography>
      </Paper>
    </Box>
  );
};

// Static validation function
WebhookTriggerForm.validate = (config) => {
  const errors = {};
  
  if (!config.endpoint) {
    errors.endpoint = 'Webhook endpoint is required';
  } else if (!config.endpoint.startsWith('/')) {
    errors.endpoint = 'Endpoint must start with a slash (/)';
  }
  
  return errors;
};

export default WebhookTriggerForm;
