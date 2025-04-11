import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const HttpActionForm = ({ config, onChange, errors = {} }) => {
  const [headers, setHeaders] = useState(config.headers || {});
  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');

  // Handle URL change
  const handleUrlChange = (e) => {
    onChange({ url: e.target.value });
  };

  // Handle method change
  const handleMethodChange = (e) => {
    onChange({ method: e.target.value });
  };

  // Handle body change
  const handleBodyChange = (e) => {
    onChange({ body: e.target.value });
  };

  // Handle add header
  const handleAddHeader = () => {
    if (newHeaderKey.trim()) {
      const updatedHeaders = {
        ...headers,
        [newHeaderKey]: newHeaderValue,
      };
      setHeaders(updatedHeaders);
      onChange({ headers: updatedHeaders });
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  // Handle remove header
  const handleRemoveHeader = (key) => {
    const updatedHeaders = { ...headers };
    delete updatedHeaders[key];
    setHeaders(updatedHeaders);
    onChange({ headers: updatedHeaders });
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="URL"
        value={config.url || ''}
        onChange={handleUrlChange}
        margin="normal"
        error={!!errors.url}
        helperText={errors.url || 'The URL to send the request to'}
      />

      <FormControl fullWidth margin="normal" error={!!errors.method}>
        <InputLabel id="method-label">HTTP Method</InputLabel>
        <Select
          labelId="method-label"
          value={config.method || 'GET'}
          onChange={handleMethodChange}
          label="HTTP Method"
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
          <MenuItem value="PATCH">PATCH</MenuItem>
        </Select>
        <FormHelperText>{errors.method || 'The HTTP method to use for the request'}</FormHelperText>
      </FormControl>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Headers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {Object.entries(headers).map(([key, value]) => (
              <Grid container spacing={2} key={key} sx={{ mb: 1 }}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    value={key}
                    disabled
                    label="Header Name"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    size="small"
                    value={value}
                    disabled
                    label="Value"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveHeader(key)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  size="small"
                  value={newHeaderKey}
                  onChange={(e) => setNewHeaderKey(e.target.value)}
                  label="Header Name"
                  placeholder="Content-Type"
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  size="small"
                  value={newHeaderValue}
                  onChange={(e) => setNewHeaderValue(e.target.value)}
                  label="Value"
                  placeholder="application/json"
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddHeader}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {(config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') && (
        <TextField
          fullWidth
          label="Request Body"
          value={config.body || ''}
          onChange={handleBodyChange}
          margin="normal"
          multiline
          rows={4}
          error={!!errors.body}
          helperText={errors.body || 'The body of the request (JSON format)'}
        />
      )}
    </Box>
  );
};

// Static validation function
HttpActionForm.validate = (config) => {
  const errors = {};
  
  if (!config.url) {
    errors.url = 'URL is required';
  } else {
    try {
      new URL(config.url);
    } catch (e) {
      errors.url = 'Invalid URL format';
    }
  }
  
  if (!config.method) {
    errors.method = 'HTTP method is required';
  }
  
  if ((config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') && config.body) {
    try {
      JSON.parse(config.body);
    } catch (e) {
      errors.body = 'Invalid JSON format';
    }
  }
  
  return errors;
};

export default HttpActionForm;
