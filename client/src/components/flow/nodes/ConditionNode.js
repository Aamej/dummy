import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { CallSplit as ConditionIcon } from '@mui/icons-material';

const ConditionNode = ({ data, selected }) => {
  return (
    <Paper
      elevation={selected ? 8 : 3}
      sx={{
        padding: 1,
        borderRadius: 1,
        width: 200,
        backgroundColor: '#e8eaf6',
        borderColor: selected ? '#1a192b' : 'transparent',
        borderWidth: 2,
        borderStyle: 'solid',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ConditionIcon sx={{ color: '#1a192b', mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Condition'}
        </Typography>
      </Box>
      
      {data.description && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          {data.description}
        </Typography>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'success.main' }}>
          True
        </Typography>
        <Typography variant="caption" sx={{ color: 'error.main' }}>
          False
        </Typography>
      </Box>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: '#1a192b', width: 10, height: 10 }}
      />
      
      {/* True output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ background: '#4caf50', width: 10, height: 10, top: '35%' }}
      />
      
      {/* False output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ background: '#f44336', width: 10, height: 10, top: '65%' }}
      />
    </Paper>
  );
};

export default memo(ConditionNode);
