import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
  OnNodesDelete,
  OnEdgesDelete,
  Connection,
  OnConnect,
  Viewport,
  NodeTypes,
} from 'react-flow-renderer';
import { Box } from '@mui/material';

import { useFlow } from '../../contexts/FlowContext';
import { useUI } from '../../contexts/UIContext';
import { FlowNode, FlowEdge } from '../../types';

// Custom node types
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import TransformerNode from './nodes/TransformerNode';

// Define custom node types
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  transformer: TransformerNode,
};

const FlowCanvas: React.FC = () => {
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
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(nodes as Node[]);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(edges as Edge[]);

  // Update Flow context when nodes change
  useEffect(() => {
    updateNodePositions(reactFlowNodes as FlowNode[]);
  }, [reactFlowNodes, updateNodePositions]);

  // Handle node selection
  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node as FlowNode);
  }, [setSelectedNode]);

  // Handle node deletion
  const onNodeDelete: OnNodesDelete = useCallback((nodesToDelete) => {
    nodesToDelete.forEach((node) => removeNode(node.id));
  }, [removeNode]);

  // Handle edge deletion
  const onEdgeDelete: OnEdgesDelete = useCallback((edgesToDelete) => {
    edgesToDelete.forEach((edge) => removeEdge(edge.id));
  }, [removeEdge]);

  // Handle connection between nodes
  const onConnect: OnConnect = useCallback((params: Connection) => {
    const newEdge = addFlowEdge(params);
    setReactFlowEdges((eds) => addEdge(params, eds));
    return newEdge;
  }, [addFlowEdge, setReactFlowEdges]);

  // Handle panning and zooming
  const onMoveEnd = useCallback((_: React.MouseEvent, viewport: Viewport) => {
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
