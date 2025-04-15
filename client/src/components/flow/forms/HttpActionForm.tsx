import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import { FormErrors } from '../../../types';

interface HttpActionFormProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
  errors: FormErrors;
}

interface HttpActionFormComponent extends React.FC<HttpActionFormProps> {
  validate: (config: Record<string, any>) => FormErrors;
}

const HttpActionForm: React.FC<HttpActionFormProps> = ({ config, onChange, errors }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      onChange({ [name]: value });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      onChange({ [name]: value });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.method}>
          <InputLabel id="method-label">Method</InputLabel>
          <Select
            labelId="method-label"
            id="method"
            name="method"
            value={config.method || ''}
            label="Method"
            onChange={handleSelectChange}
          >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
            <MenuItem value="PATCH">PATCH</MenuItem>
          </Select>
          {errors.method && <FormHelperText>{errors.method}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="URL"
          name="url"
          value={config.url || ''}
          onChange={handleTextChange}
          error={!!errors.url}
          helperText={errors.url}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Headers"
          name="headers"
          value={config.headers || ''}
          onChange={handleTextChange}
          multiline
          rows={3}
          placeholder="Enter headers in JSON format"
          error={!!errors.headers}
          helperText={errors.headers}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Body"
          name="body"
          value={config.body || ''}
          onChange={handleTextChange}
          multiline
          rows={4}
          placeholder="Enter request body"
          error={!!errors.body}
          helperText={errors.body}
        />
      </Grid>
    </Grid>
  );
};



const HttpActionFormWithValidation = HttpActionForm as HttpActionFormComponent;
HttpActionFormWithValidation.validate = (config: Record<string, any>): FormErrors => {
  const errors: FormErrors = {};

  if (!config.method) {
    errors.method = 'Method is required';
  }

  if (!config.url) {
    errors.url = 'URL is required';
  } else if (!config.url.startsWith('http')) {
    errors.url = 'URL must start with http:// or https://';
  }

  if (config.headers) {
    try {
      JSON.parse(config.headers);
    } catch (e) {
      errors.headers = 'Headers must be valid JSON';
    }
  }

  return errors;
};

export default HttpActionFormWithValidation;
