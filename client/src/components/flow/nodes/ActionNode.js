import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Box, Typography, Paper } from '@mui/material';
import { FlashOn as ActionIcon } from '@mui/icons-material';

const ActionNode = ({ data, selected }) => {
  return (
    <Paper
      elevation={selected ? 8 : 3}
      sx={{
        padding: 1,
        borderRadius: 1,
        width: 200,
        backgroundColor: '#fce4ec',
        borderColor: selected ? '#ff0072' : 'transparent',
        borderWidth: 2,
        borderStyle: 'solid',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ActionIcon sx={{ color: '#ff0072', mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Action'}
        </Typography>
      </Box>
      
      {data.description && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          {data.description}
        </Typography>
      )}
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#ff0072', width: 10, height: 10 }}
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#ff0072', width: 10, height: 10 }}
      />
    </Paper>
  );
};

export default memo(ActionNode);
