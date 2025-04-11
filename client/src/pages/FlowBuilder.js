import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Grid, Typography, Button, CircularProgress } from '@mui/material';
import { Save as SaveIcon, PlayArrow as RunIcon } from '@mui/icons-material';

import { useFlow } from '../contexts/FlowContext';
import { useUI } from '../contexts/UIContext';

import FlowCanvas from '../components/flow/FlowCanvas';
import NodePalette from '../components/flow/NodePalette';
import PropertiesPanel from '../components/flow/PropertiesPanel';
import FlowToolbar from '../components/flow/FlowToolbar';
import SaveFlowModal from '../components/flow/SaveFlowModal';
import ValidationErrors from '../components/flow/ValidationErrors';

const FlowBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    flowName, 
    flowId, 
    loading, 
    error, 
    isModified,
    loadFlow, 
    saveFlow, 
    createNewFlow,
    validateFlow
  } = useFlow();
  const { 
    isSidebarOpen, 
    activePanel, 
    setActivePanel,
    isSaveModalOpen, 
    setIsSaveModalOpen,
    showNotification 
  } = useUI();
  
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [] });
  const [isSaving, setIsSaving] = useState(false);

  // Load flow if ID is provided
  useEffect(() => {
    if (id && id !== 'new') {
      loadFlow(id).catch((err) => {
        showNotification(`Error loading flow: ${err.message}`, 'error');
        navigate('/dashboard');
      });
    } else {
      createNewFlow();
    }
  }, [id, loadFlow, createNewFlow, navigate, showNotification]);

  // Handle save flow
  const handleSaveFlow = async () => {
    // Validate flow before saving
    const validation = validateFlow();
    setValidationResult(validation);
    
    if (!validation.isValid) {
      showNotification('Please fix validation errors before saving', 'warning');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const savedFlow = await saveFlow();
      showNotification('Flow saved successfully', 'success');
      
      // If this is a new flow, redirect to the flow's edit page
      if (!flowId && savedFlow.id) {
        navigate(`/flows/${savedFlow.id}`, { replace: true });
      }
    } catch (err) {
      showNotification(`Error saving flow: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
      setIsSaveModalOpen(false);
    }
  };

  // Handle run flow (validate only for now)
  const handleRunFlow = () => {
    const validation = validateFlow();
    setValidationResult(validation);
    
    if (validation.isValid) {
      showNotification('Flow validation passed!', 'success');
    } else {
      showNotification('Flow validation failed. Please fix the errors.', 'error');
    }
  };

  // Show save modal
  const handleShowSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  if (loading && id !== 'new') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Flow Header */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          {flowName} {isModified && '*'}
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleShowSaveModal}
            sx={{ mr: 1 }}
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RunIcon />}
            onClick={handleRunFlow}
          >
            Validate
          </Button>
        </Box>
      </Paper>

      {/* Validation Errors */}
      {!validationResult.isValid && (
        <ValidationErrors errors={validationResult.errors} />
      )}

      {/* Flow Builder Layout */}
      <Grid container spacing={0} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        {isSidebarOpen && (
          <Grid item xs={3} sx={{ height: '100%' }}>
            <Paper sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1 }}>
                <Button 
                  variant={activePanel === 'nodes' ? 'contained' : 'text'} 
                  onClick={() => setActivePanel('nodes')}
                  sx={{ mr: 1 }}
                >
                  Nodes
                </Button>
                <Button 
                  variant={activePanel === 'properties' ? 'contained' : 'text'} 
                  onClick={() => setActivePanel('properties')}
                >
                  Properties
                </Button>
              </Box>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {activePanel === 'nodes' ? (
                  <NodePalette />
                ) : (
                  <PropertiesPanel />
                )}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Canvas */}
        <Grid item xs={isSidebarOpen ? 9 : 12} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%', position: 'relative' }}>
            <FlowToolbar />
            <FlowCanvas />
          </Paper>
        </Grid>
      </Grid>

      {/* Save Modal */}
      <SaveFlowModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveFlow}
      />
    </Box>
  );
};

export default FlowBuilder;
