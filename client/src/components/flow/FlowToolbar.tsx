import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Paper,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as FitViewIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Delete as DeleteIcon,
  MenuOpen as ToggleSidebarIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

import { useUI } from '../../contexts/UIContext';

const FlowToolbar: React.FC = () => {
  const {
    zoomLevel,
    setZoomLevel,
    resetView,
    toggleSidebar,
    setIsHelpModalOpen,
  } = useUI();

  // Handle zoom in
  const handleZoomIn = (): void => {
    setZoomLevel(Math.min(zoomLevel + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = (): void => {
    setZoomLevel(Math.max(zoomLevel - 0.1, 0.5));
  };

  // Handle fit view
  const handleFitView = (): void => {
    resetView();
  };

  // Handle toggle sidebar
  const handleToggleSidebar = (): void => {
    toggleSidebar();
  };

  // Handle show help
  const handleShowHelp = (): void => {
    setIsHelpModalOpen(true);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        p: 0.5,
      }}
    >
      <Tooltip title="Toggle Sidebar" placement="left">
        <IconButton size="small" onClick={handleToggleSidebar} sx={{ mb: 1 }}>
          <ToggleSidebarIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider sx={{ my: 0.5 }} />

      <Tooltip title="Zoom In" placement="left">
        <IconButton size="small" onClick={handleZoomIn} sx={{ mb: 1 }}>
          <ZoomInIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Zoom Out" placement="left">
        <IconButton size="small" onClick={handleZoomOut} sx={{ mb: 1 }}>
          <ZoomOutIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Fit View" placement="left">
        <IconButton size="small" onClick={handleFitView} sx={{ mb: 1 }}>
          <FitViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider sx={{ my: 0.5 }} />

      <Tooltip title="Undo" placement="left">
        <span>
          <IconButton size="small" disabled sx={{ mb: 1 }}>
            <UndoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Redo" placement="left">
        <span>
          <IconButton size="small" disabled sx={{ mb: 1 }}>
            <RedoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Divider sx={{ my: 0.5 }} />

      <Tooltip title="Delete Selected" placement="left">
        <span>
          <IconButton size="small" disabled sx={{ mb: 1 }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Divider sx={{ my: 0.5 }} />

      <Tooltip title="Help" placement="left">
        <IconButton size="small" onClick={handleShowHelp}>
          <HelpIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default FlowToolbar;
