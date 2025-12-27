import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { MindMapNodeData } from '../types/mindmap';

const CustomNode: React.FC<NodeProps<MindMapNodeData>> = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} className="node-handle" />
      
      <div
        className="node-content"
        style={{
          fontSize: `${data.fontSize}px`,
          color: data.textColor,
          backgroundColor: data.backgroundColor === 'transparent' 
            ? 'transparent' 
            : data.backgroundColor,
          fontWeight: data.bold ? 'bold' : 'normal',
          fontStyle: data.italic ? 'italic' : 'normal',
        }}
      >
        <div className="node-label">{data.label || 'ノード編集パネルから編集'}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
};

export default CustomNode;
