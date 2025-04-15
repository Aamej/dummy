import React, { useCallback, useEffect, useRef } from 'react';
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
  ReactFlowInstance,
} from 'react-flow-renderer';
import { Box } from '@mui/material';

import { useFlow } from '../../contexts/FlowContext';
import { useUI } from '../../contexts/UIContext';
import { FlowNode, FlowEdge, NodeType } from '../../types';

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
    addNode,
  } = useFlow();

  // Store the ReactFlow instance
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

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
    // Ensure source and target are not null before adding edge
    if (params.source && params.target) {
      const edgeParams = {
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined
      };
      const newEdge = addFlowEdge(edgeParams);
      setReactFlowEdges((eds) => addEdge(params, eds));
      return newEdge;
    }
    return null;
  }, [addFlowEdge, setReactFlowEdges]);

  // Handle panning and zooming
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMoveEnd = useCallback((event: any, viewport: Viewport) => {
    setZoomLevel(viewport.zoom);
    setPanPosition({ x: viewport.x, y: viewport.y });
  }, [setZoomLevel, setPanPosition]);

  // Handle drop event
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance.current || !reactFlowWrapper.current) return;

      // Get the data from the drag event
      const dataStr = event.dataTransfer.getData('application/reactflow');
      if (!dataStr) return;

      try {
        const { type, subtype } = JSON.parse(dataStr);

        // Get the position where the node was dropped
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.current.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Add the node to the flow
        console.log('Adding node:', type, subtype, position);
        addNode(type as NodeType, subtype, position);
      } catch (error) {
        console.error('Error adding node:', error);
      }
    },
    [addNode]
  );

  // Handle drag over event
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <Box
      sx={{ height: '100%', width: '100%' }}
      ref={reactFlowWrapper}
    >
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
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        defaultZoom={zoomLevel}
        defaultPosition={[panPosition.x, panPosition.y]}
        onInit={(instance) => (reactFlowInstance.current = instance)}
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
