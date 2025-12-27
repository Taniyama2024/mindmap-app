import React, { useState } from 'react';
import type { MindMapProject } from '../types/mindmap';

interface ProjectSidebarProps {
  projects: MindMapProject[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  isOpen,
  onToggle
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <button 
        className={`project-sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        title={isOpen ? 'サイドバーを閉じる' : 'プロジェクト一覧'}
      >
        {isOpen ? '◀' : '📂'}
      </button>

      <div className={`project-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>プロジェクト</h2>
          <button 
            className="new-project-btn"
            onClick={() => setIsCreating(true)}
            title="新規プロジェクト作成"
          >
            +
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="new-project-form">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="プロジェクト名..."
              autoFocus
            />
            <div className="form-actions">
              <button type="submit" className="confirm-btn">作成</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setIsCreating(false)}
              >
                キャンセル
              </button>
            </div>
          </form>
        )}

        <div className="project-list">
          {projects.map((project) => (
            <div 
              key={project.id}
              className={`project-item ${currentProjectId === project.id ? 'active' : ''}`}
              onClick={() => onSelectProject(project.id)}
            >
              <div className="project-info">
                <span className="project-name">{project.name}</span>
                <span className="project-date">{formatDate(project.updated_at)}</span>
              </div>
              {projects.length > 1 && (
                <button
                  className="delete-project-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`「${project.name}」を削除してもよろしいですか？この操作は取り消せません。`)) {
                      onDeleteProject(project.id);
                    }
                  }}
                  title="削除"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
};

export default ProjectSidebar;
