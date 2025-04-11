import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';

import { useFlow } from '../../contexts/FlowContext';
import { useUI } from '../../contexts/UIContext';

// Node configuration forms
import WebhookTriggerForm from './forms/WebhookTriggerForm';
import ScheduleTriggerForm from './forms/ScheduleTriggerForm';
import EventTriggerForm from './forms/EventTriggerForm';
import HttpActionForm from './forms/HttpActionForm';
import EmailActionForm from './forms/EmailActionForm';
import DatabaseActionForm from './forms/DatabaseActionForm';
import IfConditionForm from './forms/IfConditionForm';
import SwitchConditionForm from './forms/SwitchConditionForm';
import TransformForm from './forms/TransformForm';
import FilterForm from './forms/FilterForm';
import MapForm from './forms/MapForm';

// Map of node types to their configuration forms
const nodeConfigForms = {
  trigger: {
    webhook: WebhookTriggerForm,
    schedule: ScheduleTriggerForm,
    event: EventTriggerForm,
  },
  action: {
    http: HttpActionForm,
    email: EmailActionForm,
    database: DatabaseActionForm,
  },
  condition: {
    if: IfConditionForm,
    switch: SwitchConditionForm,
  },
  transformer: {
    transform: TransformForm,
    filter: FilterForm,
    map: MapForm,
  },
};

// Node type labels
const nodeTypeLabels = {
  trigger: 'Trigger',
  action: 'Action',
  condition: 'Condition',
  transformer: 'Transformer',
};

// Node subtype labels
const nodeSubtypeLabels = {
  webhook: 'Webhook',
  schedule: 'Schedule',
  event: 'Event',
  http: 'HTTP Request',
  email: 'Send Email',
  database: 'Database',
  if: 'If Condition',
  switch: 'Switch',
  transform: 'Transform',
  filter: 'Filter',
  map: 'Map',
};

const PropertiesPanel = () => {
  const { selectedNode, updateNodeConfig, removeNode } = useFlow();
  const { showNotification } = useUI();
  
  const [nodeConfig, setNodeConfig] = useState({});
  const [nodeName, setNodeName] = useState('');
  const [errors, setErrors] = useState({});

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setNodeConfig(selectedNode.data || {});
      setNodeName(selectedNode.data?.label || nodeSubtypeLabels[selectedNode.subtype] || '');
      setErrors({});
    } else {
      setNodeConfig({});
      setNodeName('');
      setErrors({});
    }
  }, [selectedNode]);

  // Handle node name change
  const handleNameChange = (e) => {
    setNodeName(e.target.value);
  };

  // Handle node config change
  const handleConfigChange = (config) => {
    setNodeConfig((prev) => ({ ...prev, ...config }));
  };

  // Handle save node configuration
  const handleSave = () => {
    // Basic validation
    const newErrors = {};
    
    if (!nodeName.trim()) {
      newErrors.name = 'Node name is required';
    }
    
    // Get the appropriate form component for validation
    const FormComponent = selectedNode && nodeConfigForms[selectedNode.type]?.[selectedNode.subtype];
    
    if (FormComponent && FormComponent.validate) {
      const formErrors = FormComponent.validate(nodeConfig);
      Object.assign(newErrors, formErrors);
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Update node configuration
    updateNodeConfig(selectedNode.id, {
      ...nodeConfig,
      label: nodeName,
    });
    
    showNotification('Node configuration saved', 'success');
  };

  // Handle delete node
  const handleDelete = () => {
    if (selectedNode) {
      removeNode(selectedNode.id);
      showNotification('Node deleted', 'info');
    }
  };

  // If no node is selected
  if (!selectedNode) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Select a node to configure its properties.
        </Typography>
      </Box>
    );
  }

  // Get the appropriate form component
  const FormComponent = nodeConfigForms[selectedNode.type]?.[selectedNode.subtype];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Node Properties
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Node Type
        </Typography>
        <Typography variant="body1" gutterBottom>
          {nodeTypeLabels[selectedNode.type]} - {nodeSubtypeLabels[selectedNode.subtype]}
        </Typography>
        
        <TextField
          fullWidth
          label="Node Name"
          value={nodeName}
          onChange={handleNameChange}
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
      </Paper>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Configuration
      </Typography>
      
      {FormComponent ? (
        <FormComponent
          config={nodeConfig}
          onChange={handleConfigChange}
          errors={errors}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          No configuration options available for this node type.
        </Typography>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default PropertiesPanel;
