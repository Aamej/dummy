import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { 
  Flow, 
  FlowNode, 
  FlowEdge, 
  NodeType, 
  NodePosition, 
  NodeData,
  ValidationResult 
} from '../types';

interface FlowContextType {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNode: FlowNode | null;
  flowName: string;
  flowDescription: string;
  flowId: string | null;
  isModified: boolean;
  loading: boolean;
  error: string | null;
  setSelectedNode: (node: FlowNode | null) => void;
  setFlowName: (name: string) => void;
  setFlowDescription: (description: string) => void;
  addNode: (type: NodeType, subtype: string, position: NodePosition) => FlowNode;
  updateNodeConfig: (nodeId: string, config: Partial<NodeData>) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (params: Omit<FlowEdge, 'id'>) => FlowEdge;
  removeEdge: (edgeId: string) => void;
  updateNodePositions: (updatedNodes: FlowNode[]) => void;
  loadFlow: (id: string) => Promise<Flow>;
  saveFlow: () => Promise<Flow>;
  createNewFlow: () => void;
  validateFlow: () => ValidationResult;
}

interface FlowProviderProps {
  children: ReactNode;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function useFlow(): FlowContextType {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
}

export function FlowProvider({ children }: FlowProviderProps): JSX.Element {
  const [nodes, setNodes] = useState<FlowNode[]>([{
    id: "1",
    type: "trigger",
    position: { x: 100, y: 100 },
    data: { label: "Hello world" },
  },]);
  const [edges, setEdges] = useState<FlowEdge[]>([{
    id: "e1-2",
    source: "1",
    target: "2",
  },]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [flowName, setFlowName] = useState<string>('Untitled Flow');
  const [flowDescription, setFlowDescription] = useState<string>('');
  const [flowId, setFlowId] = useState<string | null>(null);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add a new node to the canvas
  const addNode = useCallback((type: NodeType, subtype: string, position: NodePosition): FlowNode => {
    const newNode: FlowNode = {
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
  const updateNodeConfig = useCallback((nodeId: string, config: Partial<NodeData>): void => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...config } } : node
      )
    );
    setIsModified(true);
  }, []);

  // Remove a node from the canvas
  const removeNode = useCallback((nodeId: string): void => {
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
  const addEdge = useCallback((params: Omit<FlowEdge, 'id'>): FlowEdge => {
    const newEdge: FlowEdge = {
      id: `edge-${uuidv4()}`,
      ...params,
    };
    
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    setIsModified(true);
    
    return newEdge;
  }, []);

  // Remove a connection
  const removeEdge = useCallback((edgeId: string): void => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    setIsModified(true);
  }, []);

  // Update node positions after drag
  const updateNodePositions = useCallback((updatedNodes: FlowNode[]): void => {
    setNodes(updatedNodes);
    setIsModified(true);
  }, []);

  // Load a flow from the server
  const loadFlow = useCallback(async (id: string): Promise<Flow> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<Flow>(`/api/flows/${id}`);
      const flow = response.data;
      
      setFlowId(flow.id || null);
      setFlowName(flow.name);
      setFlowDescription(flow.description || '');
      setNodes(flow.nodes);
      setEdges(flow.edges);
      setIsModified(false);
      
      return flow;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to load flow';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save the current flow to the server
  const saveFlow = useCallback(async (): Promise<Flow> => {
    setLoading(true);
    setError(null);
    
    const flowData: Omit<Flow, 'id'> = {
      name: flowName,
      description: flowDescription,
      nodes,
      edges,
    };
    
    try {
      let response;
      
      if (flowId) {
        // Update existing flow
        response = await axios.put<Flow>(`/api/flows/${flowId}`, flowData);
      } else {
        // Create new flow
        response = await axios.post<Flow>('/api/flows', flowData);
        setFlowId(response.data.id || null);
      }
      
      setIsModified(false);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to save flow';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [flowId, flowName, flowDescription, nodes, edges]);

  // Create a new empty flow
  const createNewFlow = useCallback((): void => {
    setFlowId(null);
    setFlowName('Untitled Flow');
    setFlowDescription('');
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setIsModified(false);
  }, []);

  // Validate the flow
  const validateFlow = useCallback((): ValidationResult => {
    const errors: string[] = [];
    
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
    const connectedNodeIds = new Set<string>();
    
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

  const value: FlowContextType = {
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
