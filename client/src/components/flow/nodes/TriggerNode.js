import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Box, Typography, Paper } from '@mui/material';
import { PlayArrow as TriggerIcon } from '@mui/icons-material';

const TriggerNode = ({ data, selected }) => {
  return (
    <Paper
      elevation={selected ? 8 : 3}
      sx={{
        padding: 1,
        borderRadius: 1,
        width: 200,
        backgroundColor: '#e3f2fd',
        borderColor: selected ? '#0041d0' : 'transparent',
        borderWidth: 2,
        borderStyle: 'solid',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <TriggerIcon sx={{ color: '#0041d0', mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Trigger'}
        </Typography>
      </Box>
      
      {data.description && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          {data.description}
        </Typography>
      )}
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#0041d0', width: 10, height: 10 }}
      />
    </Paper>
  );
};

export default memo(TriggerNode);
