import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
} from '@mui/material';
import { FormErrors } from '../../../types';

interface WebhookTriggerFormProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
  errors: FormErrors;
}

interface WebhookTriggerFormComponent extends React.FC<WebhookTriggerFormProps> {
  validate: (config: Record<string, any>) => FormErrors;
}

const WebhookTriggerForm: React.FC<WebhookTriggerFormProps> = ({ config, onChange, errors }) => {
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

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name) {
      onChange({ [name]: checked });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Path"
          name="path"
          value={config.path || ''}
          onChange={handleTextChange}
          error={!!errors.path}
          helperText={errors.path || 'The URL path for this webhook (e.g., /my-webhook)'}
        />
      </Grid>
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
            <MenuItem value="ANY">ANY</MenuItem>
          </Select>
          {errors.method && <FormHelperText>{errors.method}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={config.requireAuth || false}
              onChange={handleSwitchChange}
              name="requireAuth"
            />
          }
          label="Require Authentication"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={config.description || ''}
          onChange={handleTextChange}
          multiline
          rows={2}
          placeholder="Enter a description for this webhook"
        />
      </Grid>
    </Grid>
  );
};



const WebhookTriggerFormWithValidation = WebhookTriggerForm as WebhookTriggerFormComponent;
WebhookTriggerFormWithValidation.validate = (config: Record<string, any>): FormErrors => {
  const errors: FormErrors = {};

  if (!config.path) {
    errors.path = 'Path is required';
  } else if (!config.path.startsWith('/')) {
    errors.path = 'Path must start with /';
  }

  if (!config.method) {
    errors.method = 'Method is required';
  }

  return errors;
};

export default WebhookTriggerFormWithValidation;
