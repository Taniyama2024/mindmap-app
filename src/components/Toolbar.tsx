import React from 'react';

interface ToolbarProps {
  onAddNode: () => void;
  onSave: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddNode, onSave, saveStatus }) => {
  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return '保存中...';
      case 'saved':
        return '保存済み';
      case 'error':
        return '保存エラー';
      default:
        return '保存';
    }
  };

  const getSaveStatusClass = () => {
    switch (saveStatus) {
      case 'saving':
        return 'status-saving';
      case 'saved':
        return 'status-saved';
      case 'error':
        return 'status-error';
      default:
        return '';
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h2 className="toolbar-title">🧠 マインドマップ</h2>
      </div>

      <div className="toolbar-right">
        <button onClick={onAddNode} className="toolbar-button add-button">
          ➕ ノードを追加
        </button>
        <button 
          onClick={onSave} 
          className={`toolbar-button save-button ${getSaveStatusClass()}`}
          disabled={saveStatus === 'saving'}
        >
          {getSaveStatusText()}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
