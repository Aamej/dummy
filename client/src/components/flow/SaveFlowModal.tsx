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
import { FormErrors } from '../../types';

interface SaveFlowModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SaveFlowModal: React.FC<SaveFlowModalProps> = ({ open, onClose, onSave }) => {
  const { flowName, flowDescription, setFlowName, setFlowDescription } = useFlow();
  
  const [name, setName] = useState<string>(flowName);
  const [description, setDescription] = useState<string>(flowDescription);
  const [errors, setErrors] = useState<FormErrors>({});

  // Update local state when flow name/description changes
  useEffect(() => {
    setName(flowName);
    setDescription(flowDescription);
  }, [flowName, flowDescription, open]);

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(e.target.value);
  };

  // Handle save
  const handleSave = (): void => {
    // Validate
    const newErrors: FormErrors = {};
    
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
