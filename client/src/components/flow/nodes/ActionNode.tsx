import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Box, Typography, Paper } from '@mui/material';
import { FlashOn as ActionIcon } from '@mui/icons-material';

const ActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <Paper
      elevation={selected ? 8 : 3}
      sx={{
        padding: 1,
        borderRadius: 1,
        borderColor: 'secondary.main',
        borderWidth: selected ? 2 : 0,
        borderStyle: selected ? 'solid' : 'none',
        bgcolor: 'background.paper',
        width: 200,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box
          sx={{
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1,
          }}
        >
          <ActionIcon fontSize="small" />
        </Box>
        <Typography variant="subtitle2" noWrap>
          {data.label}
        </Typography>
      </Box>

      {data.description && (
        <Typography variant="caption" color="text.secondary">
          {data.description}
        </Typography>
      )}

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#ff0072', width: 10, height: 10 }}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#ff0072', width: 10, height: 10 }}
      />
    </Paper>
  );
};

export default memo(ActionNode);
