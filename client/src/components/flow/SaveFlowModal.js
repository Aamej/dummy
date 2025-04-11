import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useFlow } from '../../contexts/FlowContext';

const SaveFlowModal = ({ open, onClose, onSave }) => {
  const { flowName, flowDescription, setFlowName, setFlowDescription } = useFlow();
  
  const [name, setName] = useState(flowName);
  const [description, setDescription] = useState(flowDescription);
  const [errors, setErrors] = useState({});

  // Update local state when flow name/description changes
  useEffect(() => {
    setName(flowName);
    setDescription(flowDescription);
  }, [flowName, flowDescription, open]);

  // Handle name change
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle save
  const handleSave = () => {
    // Validate
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Flow name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Update flow name and description
    setFlowName(name);
    setFlowDescription(description);
    
    // Call onSave callback
    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Flow</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Flow Name"
            fullWidth
            value={name}
            onChange={handleNameChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={handleDescriptionChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFlowModal;
