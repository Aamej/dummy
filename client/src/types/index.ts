// User Types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Node Types
export type NodeType = 'trigger' | 'action' | 'condition' | 'transformer';

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  [key: string]: any;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  subtype: string;
  position: NodePosition;
  data: NodeData;
}

// Edge Types
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

// Flow Types
export interface Flow {
  id?: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Context Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Form Error Types
export interface FormErrors {
  [key: string]: string;
}
