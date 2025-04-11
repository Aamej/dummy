import React, { useState, useEffect, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useUI } from '../contexts/UIContext';
import { Flow } from '../types';

const Dashboard: React.FC = () => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  
  const { showNotification } = useUI();
  
  // Fetch flows on component mount
  useEffect(() => {
    fetchFlows();
  }, []);
  
  // Fetch flows from API
  const fetchFlows = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<{ flows: Flow[] }>('/api/flows');
      setFlows(response.data.flows || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch flows';
      setError(errorMessage);
      showNotification('Failed to fetch flows', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };
  
  // Filter flows based on search term
  const filteredFlows = flows.filter((flow) =>
    flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (flow.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  // Handle flow menu open
  const handleMenuOpen = (event: MouseEvent<HTMLElement>, flowId: string): void => {
    setAnchorEl(event.currentTarget);
    setSelectedFlowId(flowId);
  };
  
  // Handle flow menu close
  const handleMenuClose = (): void => {
    setAnchorEl(null);
    setSelectedFlowId(null);
  };
  
  // Handle delete flow
  const handleDeleteFlow = async (): Promise<void> => {
    if (!selectedFlowId) return;
    
    try {
      await axios.delete(`/api/flows/${selectedFlowId}`);
      setFlows(flows.filter((flow) => flow.id !== selectedFlowId));
      showNotification('Flow deleted successfully', 'success');
    } catch (err) {
      showNotification('Failed to delete flow', 'error');
    } finally {
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };
  
  // Handle duplicate flow
  const handleDuplicateFlow = async (): Promise<void> => {
    if (!selectedFlowId) return;
    
    const flowToDuplicate = flows.find((flow) => flow.id === selectedFlowId);
    
    if (!flowToDuplicate) return;
    
    try {
      const duplicatedFlow: Omit<Flow, 'id'> = {
        ...flowToDuplicate,
        name: `${flowToDuplicate.name} (Copy)`,
      };
      
      // Remove id property
      const { id, ...flowWithoutId } = flowToDuplicate;
      
      const response = await axios.post<Flow>('/api/flows', {
        ...flowWithoutId,
        name: `${flowToDuplicate.name} (Copy)`,
      });
      
      setFlows([...flows, response.data]);
      showNotification('Flow duplicated successfully', 'success');
    } catch (err) {
      showNotification('Failed to duplicate flow', 'error');
    } finally {
      handleMenuClose();
    }
  };
  
  // Render loading state
  if (loading && flows.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Flows
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/flows/new"
        >
          Create New Flow
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search flows..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}
      
      {filteredFlows.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No flows found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm
              ? `No flows matching "${searchTerm}"`
              : "You haven't created any flows yet."}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/flows/new"
            >
              Create Your First Flow
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredFlows.map((flow) => (
            <Grid item xs={12} sm={6} md={4} key={flow.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {flow.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => flow.id && handleMenuOpen(e, flow.id)}
                      aria-label="flow options"
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {flow.description || 'No description'}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Created: {flow.createdAt ? new Date(flow.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {flow.updatedAt ? new Date(flow.updatedAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/flows/${flow.id}`}
                  >
                    Edit
                  </Button>
                  <Button size="small" color="secondary">
                    Run
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Flow Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDuplicateFlow}>
          <DuplicateIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Flow</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this flow? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteFlow} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
