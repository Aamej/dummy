import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Box, Typography, Paper } from '@mui/material';
import { Transform as TransformerIcon } from '@mui/icons-material';

const TransformerNode = ({ data, selected }) => {
  return (
    <Paper
      elevation={selected ? 8 : 3}
      sx={{
        padding: 1,
        borderRadius: 1,
        width: 200,
        backgroundColor: '#fff8e1',
        borderColor: selected ? '#ff9900' : 'transparent',
        borderWidth: 2,
        borderStyle: 'solid',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <TransformerIcon sx={{ color: '#ff9900', mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Transformer'}
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
        style={{ background: '#ff9900', width: 10, height: 10 }}
      />
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: '#ff9900', width: 10, height: 10 }}
      />
    </Paper>
  );
};

export default memo(TransformerNode);
