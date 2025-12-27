import React from 'react';
import type { MindMapNodeData } from '../types/mindmap';

interface NodeEditorPanelProps {
  selectedNode: {
    id: string;
    data: MindMapNodeData;
  } | null;
  onUpdateNode: (nodeId: string, data: Partial<MindMapNodeData>) => void;
}

const NodeEditorPanel: React.FC<NodeEditorPanelProps> = ({ selectedNode, onUpdateNode }) => {
  if (!selectedNode) {
    return (
      <div className="editor-panel">
        <div className="editor-empty">
          <p>ノードを選択して編集</p>
        </div>
      </div>
    );
  }

  const { id, data } = selectedNode;

  return (
    <div className="editor-panel">
      <h3 className="editor-title">ノード編集</h3>

      <div className="editor-section">
        <label className="editor-label">テキスト</label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => onUpdateNode(id, { label: e.target.value })}
          className="editor-input"
          placeholder="ノードのテキスト"
        />
      </div>

      <div className="editor-section">
        <label className="editor-label">
          フォントサイズ: {data.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={data.fontSize}
          onChange={(e) => onUpdateNode(id, { fontSize: parseInt(e.target.value) })}
          className="editor-slider"
        />
      </div>

      <div className="editor-section">
        <label className="editor-label">文字色</label>
        <div className="color-picker-container">
          <input
            type="color"
            value={data.textColor}
            onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
            className="editor-color"
          />
          <input
            type="text"
            value={data.textColor}
            onChange={(e) => onUpdateNode(id, { textColor: e.target.value })}
            className="editor-input-small"
          />
        </div>
      </div>

      <div className="editor-section">
        <label className="editor-label">背景色</label>
        <div className="color-picker-container">
          <input
            type="color"
            value={data.backgroundColor === 'transparent' ? '#ffffff' : data.backgroundColor}
            onChange={(e) => onUpdateNode(id, { backgroundColor: e.target.value })}
            className="editor-color"
            disabled={data.backgroundColor === 'transparent'}
          />
          <input
            type="text"
            value={data.backgroundColor}
            onChange={(e) => onUpdateNode(id, { backgroundColor: e.target.value })}
            className="editor-input-small"
          />
        </div>
        <label className="editor-checkbox">
          <input
            type="checkbox"
            checked={data.backgroundColor === 'transparent'}
            onChange={(e) => 
              onUpdateNode(id, { 
                backgroundColor: e.target.checked ? 'transparent' : '#ffffff' 
              })
            }
          />
          <span>透明</span>
        </label>
      </div>
    </div>
  );
};

export default NodeEditorPanel;
