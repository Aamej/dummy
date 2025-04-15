import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  PlayArrow as TriggerIcon,
  FlashOn as ActionIcon,
  CallSplit as ConditionIcon,
  Transform as TransformerIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

import { useFlow } from '../../contexts/FlowContext';
import { NodeType } from '../../types';

interface NodeDefinition {
  id: string;
  name: string;
  description: string;
}

interface NodeCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  nodes: NodeDefinition[];
}

// Node type definitions
const nodeCategories: NodeCategory[] = [
  {
    id: 'triggers',
    name: 'Triggers',
    icon: <TriggerIcon />,
    color: '#0041d0',
    nodes: [
      { id: 'webhook', name: 'Webhook', description: 'Trigger on HTTP request' },
      { id: 'schedule', name: 'Schedule', description: 'Trigger on a schedule' },
      { id: 'event', name: 'Event', description: 'Trigger on an event' },
    ],
  },
  {
    id: 'actions',
    name: 'Actions',
    icon: <ActionIcon />,
    color: '#ff0072',
    nodes: [
      { id: 'http', name: 'HTTP Request', description: 'Make an HTTP request' },
      { id: 'email', name: 'Send Email', description: 'Send an email' },
      { id: 'database', name: 'Database', description: 'Interact with a database' },
    ],
  },
  {
    id: 'conditions',
    name: 'Conditions',
    icon: <ConditionIcon />,
    color: '#1a192b',
    nodes: [
      { id: 'if', name: 'If Condition', description: 'Branch based on a condition' },
      { id: 'switch', name: 'Switch', description: 'Multiple branches based on a value' },
    ],
  },
  {
    id: 'transformers',
    name: 'Transformers',
    icon: <TransformerIcon />,
    color: '#ff9900',
    nodes: [
      { id: 'transform', name: 'Transform', description: 'Transform data format' },
      { id: 'filter', name: 'Filter', description: 'Filter data' },
      { id: 'map', name: 'Map', description: 'Map data to a new structure' },
    ],
  },
];

const NodePalette: React.FC = () => {
  const { addNode } = useFlow();

  // Handle drag start for a node
  const onDragStart = (event: React.DragEvent<HTMLElement>, nodeType: string, nodeSubtype: string): void => {
    console.log('Drag start:', nodeType, nodeSubtype);
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      subtype: nodeSubtype
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Node Palette
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Drag and drop nodes onto the canvas to build your flow.
      </Typography>

      {nodeCategories.map((category) => (
        <Accordion key={category.id} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${category.id}-content`}
            id={`${category.id}-header`}
            sx={{ bgcolor: 'action.hover' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1, color: category.color }}>{category.icon}</Box>
              <Typography variant="subtitle1">{category.name}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List dense>
              {category.nodes.map((node) => (
                <React.Fragment key={node.id}>
                  <ListItem
                    button
                    draggable
                    onDragStart={(event) => onDragStart(
                      event,
                      category.id.slice(0, -1) as NodeType,
                      node.id
                    )}
                    sx={{
                      cursor: 'grab',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: category.color }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={node.name}
                      secondary={node.description}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Tip: Drag nodes onto the canvas and connect them to create a workflow.
        </Typography>
      </Box>
    </Box>
  );
};

export default NodePalette;
