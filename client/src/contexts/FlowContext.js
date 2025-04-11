import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const FlowContext = createContext();

export function useFlow() {
  return useContext(FlowContext);
}

export function FlowProvider({ children }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowName, setFlowName] = useState('Untitled Flow');
  const [flowDescription, setFlowDescription] = useState('');
  const [flowId, setFlowId] = useState(null);
  const [isModified, setIsModified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a new node to the canvas
  const addNode = useCallback((type, subtype, position) => {
    const newNode = {
      id: `node-${uuidv4()}`,
      type,
      subtype,
      position,
      data: { label: `${subtype.charAt(0).toUpperCase() + subtype.slice(1)}` },
    };
    
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setSelectedNode(newNode);
    setIsModified(true);
    
    return newNode;
  }, []);

  // Update a node's configuration
  const updateNodeConfig = useCallback((nodeId, config) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...config } } : node
      )
    );
    setIsModified(true);
  }, []);

  // Remove a node from the canvas
  const removeNode = useCallback((nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
    
    setIsModified(true);
  }, [selectedNode]);

  // Add a connection between nodes
  const addEdge = useCallback((params) => {
    const newEdge = {
      id: `edge-${uuidv4()}`,
      ...params,
    };
    
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    setIsModified(true);
    
    return newEdge;
  }, []);

  // Remove a connection
  const removeEdge = useCallback((edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    setIsModified(true);
  }, []);

  // Update node positions after drag
  const updateNodePositions = useCallback((updatedNodes) => {
    setNodes(updatedNodes);
    setIsModified(true);
  }, []);

  // Load a flow from the server
  const loadFlow = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/flows/${id}`);
      const flow = response.data;
      
      setFlowId(flow.id);
      setFlowName(flow.name);
      setFlowDescription(flow.description);
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setIsModified(false);
      
      return flow;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load flow');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save the current flow to the server
  const saveFlow = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const flowData = {
      name: flowName,
      description: flowDescription,
      nodes,
      edges,
    };
    
    try {
      let response;
      
      if (flowId) {
        // Update existing flow
        response = await axios.put(`/api/flows/${flowId}`, flowData);
      } else {
        // Create new flow
        response = await axios.post('/api/flows', flowData);
        setFlowId(response.data.id);
      }
      
      setIsModified(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save flow');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [flowId, flowName, flowDescription, nodes, edges]);

  // Create a new empty flow
  const createNewFlow = useCallback(() => {
    setFlowId(null);
    setFlowName('Untitled Flow');
    setFlowDescription('');
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setIsModified(false);
  }, []);

  // Validate the flow
  const validateFlow = useCallback(() => {
    const errors = [];
    
    // Check if there's at least one trigger node
    const hasTrigger = nodes.some((node) => node.type === 'trigger');
    if (!hasTrigger) {
      errors.push('Flow must have at least one trigger node');
    }
    
    // Check if there's at least one action node
    const hasAction = nodes.some((node) => node.type === 'action');
    if (!hasAction) {
      errors.push('Flow must have at least one action node');
    }
    
    // Check if all nodes are connected
    const connectedNodeIds = new Set();
    
    // Add all nodes that are connected by edges
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    // Find nodes that aren't connected
    const disconnectedNodes = nodes.filter((node) => !connectedNodeIds.has(node.id));
    if (disconnectedNodes.length > 0) {
      errors.push(`There are ${disconnectedNodes.length} disconnected nodes`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [nodes, edges]);

  const value = {
    nodes,
    edges,
    selectedNode,
    flowName,
    flowDescription,
    flowId,
    isModified,
    loading,
    error,
    setSelectedNode,
    setFlowName,
    setFlowDescription,
    addNode,
    updateNodeConfig,
    removeNode,
    addEdge,
    removeEdge,
    updateNodePositions,
    loadFlow,
    saveFlow,
    createNewFlow,
    validateFlow,
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}
