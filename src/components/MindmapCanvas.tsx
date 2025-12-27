import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import type { MindMapNodeData } from '../types/mindmap';

const nodeTypes = {
  mindmapNode: CustomNode,
};

interface MindmapCanvasProps {
  initialNodes: Node<MindMapNodeData>[];
  initialEdges: Edge[];
  onNodesChange: (nodes: Node<MindMapNodeData>[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
  onNodeSelect: (node: Node<MindMapNodeData> | null) => void;
  onAddNode: () => string; // Returns new node ID
}

const MindmapCanvas: React.FC<MindmapCanvasProps> = ({
  initialNodes,
  initialEdges,
  onNodesChange,
  onEdgesChange,
  onNodeSelect,
}) => {
  const [nodes, setNodes] = useState<Node<MindMapNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [showMiniMap, setShowMiniMap] = useState(false);

  // Sync with parent
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      setNodes(newNodes);
      onNodesChange(newNodes);
    },
    [nodes, onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, edges);
      setEdges(newEdges);
      onEdgesChange(newEdges);
    },
    [edges, onEdgesChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge(connection, edges);
      setEdges(newEdges);
      onEdgesChange(newEdges);
    },
    [edges, onEdgesChange]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node<MindMapNodeData>[] }) => {
      if (selectedNodes.length > 0) {
        const node = selectedNodes[0];
        onNodeSelect(node);
      } else {
        onNodeSelect(null);
      }
    },
    [onNodeSelect]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<MindMapNodeData>) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="mindmap-canvas">
      <button
        onClick={() => setShowMiniMap(!showMiniMap)}
        className="minimap-toggle "
        title={showMiniMap ? 'ミニマップを非表示' : 'ミニマップを表示'}
      >
        {showMiniMap ? '🗺️' : '🗺️'}
      </button>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        {showMiniMap && <MiniMap />}
      </ReactFlow>
    </div>
  );
};

export default MindmapCanvas;
