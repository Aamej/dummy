import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { Box } from '@mui/material';

import { useFlow } from '../../contexts/FlowContext';
import { useUI } from '../../contexts/UIContext';

// Custom node types
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import TransformerNode from './nodes/TransformerNode';

// Define custom node types
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  transformer: TransformerNode,
};

const FlowCanvas = () => {
  const {
    nodes,
    edges,
    setSelectedNode,
    addEdge: addFlowEdge,
    updateNodePositions,
    removeNode,
    removeEdge,
  } = useFlow();
  
  const { zoomLevel, panPosition, setZoomLevel, setPanPosition } = useUI();

  // Use ReactFlow's state management hooks
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(edges);

  // Update Flow context when nodes change
  React.useEffect(() => {
    updateNodePositions(reactFlowNodes);
  }, [reactFlowNodes, updateNodePositions]);

  // Handle node selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  // Handle node deletion
  const onNodeDelete = useCallback((nodesToDelete) => {
    nodesToDelete.forEach((node) => removeNode(node.id));
  }, [removeNode]);

  // Handle edge deletion
  const onEdgeDelete = useCallback((edgesToDelete) => {
    edgesToDelete.forEach((edge) => removeEdge(edge.id));
  }, [removeEdge]);

  // Handle connection between nodes
  const onConnect = useCallback((params) => {
    const newEdge = addFlowEdge(params);
    setReactFlowEdges((eds) => addEdge(params, eds));
    return newEdge;
  }, [addFlowEdge, setReactFlowEdges]);

  // Handle panning and zooming
  const onMoveEnd = useCallback((_, viewport) => {
    setZoomLevel(viewport.zoom);
    setPanPosition({ x: viewport.x, y: viewport.y });
  }, [setZoomLevel, setPanPosition]);

  return (
    <Box sx={{ height: '100%' }}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodesDelete={onNodeDelete}
        onEdgesDelete={onEdgeDelete}
        onConnect={onConnect}
        onMoveEnd={onMoveEnd}
        nodeTypes={nodeTypes}
        defaultZoom={zoomLevel}
        defaultPosition={[panPosition.x, panPosition.y]}
        fitView
        attributionPosition="bottom-right"
        deleteKeyCode="Delete"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'trigger') return '#0041d0';
            if (n.type === 'action') return '#ff0072';
            if (n.type === 'condition') return '#1a192b';
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.type === 'trigger') return '#0041d0';
            if (n.type === 'action') return '#ff0072';
            if (n.type === 'condition') return '#1a192b';
            return '#eee';
          }}
          nodeBorderRadius={2}
        />
      </ReactFlow>
    </Box>
  );
};

export default FlowCanvas;
