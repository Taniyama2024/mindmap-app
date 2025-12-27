export interface MindMapNodeData {
  label: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  bold?: boolean;
  italic?: boolean;
}

export interface MindMapNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: MindMapNodeData;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export interface MindMapProject {
  id: string;
  name: string;
  updated_at: string;
}
