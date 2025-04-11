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
import { FlowNode, NodeType, FormErrors } from '../../types';

// Node configuration forms
import WebhookTriggerForm from './forms/WebhookTriggerForm';
import HttpActionForm from './forms/HttpActionForm';

// Define the interface for form components
interface NodeConfigFormProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
  errors: FormErrors;
}

interface NodeConfigFormComponent extends React.FC<NodeConfigFormProps> {
  validate?: (config: Record<string, any>) => FormErrors;
}

// Map of node types to their configuration forms
const nodeConfigForms: Record<NodeType, Record<string, NodeConfigFormComponent>> = {
  trigger: {
    webhook: WebhookTriggerForm,
    schedule: WebhookTriggerForm, // Placeholder, replace with actual component
    event: WebhookTriggerForm, // Placeholder, replace with actual component
  },
  action: {
    http: HttpActionForm,
    email: HttpActionForm, // Placeholder, replace with actual component
    database: HttpActionForm, // Placeholder, replace with actual component
  },
  condition: {
    if: WebhookTriggerForm, // Placeholder, replace with actual component
    switch: WebhookTriggerForm, // Placeholder, replace with actual component
  },
  transformer: {
    transform: WebhookTriggerForm, // Placeholder, replace with actual component
    filter: WebhookTriggerForm, // Placeholder, replace with actual component
    map: WebhookTriggerForm, // Placeholder, replace with actual component
  },
};

// Node type labels
const nodeTypeLabels: Record<NodeType, string> = {
  trigger: 'Trigger',
  action: 'Action',
  condition: 'Condition',
  transformer: 'Transformer',
};

// Node subtype labels
const nodeSubtypeLabels: Record<string, string> = {
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

const PropertiesPanel: React.FC = () => {
  const { selectedNode, updateNodeConfig, removeNode } = useFlow();
  const { showNotification } = useUI();
  
  const [nodeConfig, setNodeConfig] = useState<Record<string, any>>({});
  const [nodeName, setNodeName] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setNodeConfig(selectedNode.data || {});
      setNodeName(selectedNode.data?.label || 
        (selectedNode.subtype && nodeSubtypeLabels[selectedNode.subtype]) || '');
      setErrors({});
    } else {
      setNodeConfig({});
      setNodeName('');
      setErrors({});
    }
  }, [selectedNode]);

  // Handle node name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNodeName(e.target.value);
  };

  // Handle node config change
  const handleConfigChange = (config: Record<string, any>): void => {
    setNodeConfig((prev) => ({ ...prev, ...config }));
  };

  // Handle save node configuration
  const handleSave = (): void => {
    // Basic validation
    const newErrors: FormErrors = {};
    
    if (!nodeName.trim()) {
      newErrors.name = 'Node name is required';
    }
    
    // Get the appropriate form component for validation
    const FormComponent = selectedNode && selectedNode.type && selectedNode.subtype && 
      nodeConfigForms[selectedNode.type]?.[selectedNode.subtype];
    
    if (FormComponent && FormComponent.validate) {
      const formErrors = FormComponent.validate(nodeConfig);
      Object.assign(newErrors, formErrors);
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Update node configuration
    if (selectedNode) {
      updateNodeConfig(selectedNode.id, {
        ...nodeConfig,
        label: nodeName,
      });
      
      showNotification('Node configuration saved', 'success');
    }
  };

  // Handle delete node
  const handleDelete = (): void => {
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
  const FormComponent = selectedNode.type && selectedNode.subtype && 
    nodeConfigForms[selectedNode.type]?.[selectedNode.subtype];

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
          {selectedNode.type && nodeTypeLabels[selectedNode.type]} - 
          {selectedNode.subtype && nodeSubtypeLabels[selectedNode.subtype]}
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
