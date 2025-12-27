import { useState, useCallback, useRef, useEffect } from 'react';
import type { Node, Edge } from 'reactflow';
import PasswordScreen from './components/PasswordScreen';
import MindmapCanvas from './components/MindmapCanvas';
import NodeEditorPanel from './components/NodeEditorPanel';
import Toolbar from './components/Toolbar';
import ProjectSidebar from './components/ProjectSidebar';
import { 
  loadMindmap, 
  saveMindmap, 
  fetchProjects, 
  createProject, 
  deleteProject 
} from './services/mindmapService';
import type { MindMapNodeData, MindMapProject } from './types/mindmap';
import './App.css';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Project State
  const [projects, setProjects] = useState<MindMapProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mindmap Data State
  const [nodes, setNodes] = useState<Node<MindMapNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<MindMapNodeData> | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [, setIsLoading] = useState(false);

  const passwordRef = useRef<string>('');

  // Check for saved password on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('mindmap_auth');
    if (savedAuth) {
      try {
        const { password, timestamp } = JSON.parse(savedAuth);
        const now = Date.now();
        const hoursSinceLogin = (now - timestamp) / (1000 * 60 * 60);
        
        // Keep password for 24 hours
        if (hoursSinceLogin < 24) {
          handlePasswordSubmit(password);
        } else {
          localStorage.removeItem('mindmap_auth');
        }
      } catch (error) {
        console.error('Failed to parse saved auth:', error);
        localStorage.removeItem('mindmap_auth');
      }
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    const fetchedProjects = await fetchProjects();
    setProjects(fetchedProjects);
    
    // Select first project if none selected or current validation
    if (fetchedProjects.length > 0 && !currentProjectId) {
      // Find 'default' or take the first one
      const defaultProject = fetchedProjects.find(p => p.id === 'default') || fetchedProjects[0];
      setCurrentProjectId(defaultProject.id);
    }
  }, [currentProjectId]);

  // Load project data when ID changes
  useEffect(() => {
    if (isAuthenticated && currentProjectId && passwordRef.current) {
      loadProjectData(currentProjectId, passwordRef.current);
    }
  }, [currentProjectId, isAuthenticated]);

  const loadProjectData = async (id: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await loadMindmap(id, pass);
      if (data) {
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      }
    } catch (error) {
      console.error(error);
      setAuthError('データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (pass: string) => {
    setIsLoading(true);
    setAuthError('');

    try {
      // First, just try to list projects to verify connection/existence
      // Note: We use the 'default' record to verify password first
      const data = await loadMindmap('default', pass);
      
      if (data === null) {
        // If default doesn't exist, maybe we can assume password is correct if we can fetch projects?
        // But for security, we rely on the specific encrypted implementation.
        // If 'default' is missing due to migration, we might need a workaround for first login.
        // Assuming 'default' always exists from setup.
        setAuthError('認証失敗またはデータ読み込みエラー');
        setIsLoading(false);
        return;
      }

      passwordRef.current = pass;
      setIsAuthenticated(true);
      
      // Save password
      localStorage.setItem('mindmap_auth', JSON.stringify({
        password: pass,
        timestamp: Date.now()
      }));

      // Load projects list
      await refreshProjects();

    } catch (error) {
      setAuthError('認証エラー: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (id: string) => {
    if (saveStatus === 'saving') return;
    setCurrentProjectId(id);
    setIsSidebarOpen(false); // Mobile UX optimization
  };

  const handleCreateProject = async (name: string) => {
    const newProject = await createProject(name);
    if (newProject) {
      await refreshProjects();
      setCurrentProjectId(newProject.id);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const success = await deleteProject(id);
    if (success) {
      const remainingProjects = projects.filter(p => p.id !== id);
      setProjects(remainingProjects);
      if (currentProjectId === id && remainingProjects.length > 0) {
        setCurrentProjectId(remainingProjects[0].id);
      }
    }
  };

  // Manual save function
  const manualSave = useCallback(async () => {
    if (!passwordRef.current || !currentProjectId) {
      return;
    }

    setSaveStatus('saving');
    const success = await saveMindmap(currentProjectId, { nodes, edges }, passwordRef.current);
    setSaveStatus(success ? 'saved' : 'error');

    if (success) {
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [nodes, edges, currentProjectId]);



  const handleAddNode = useCallback(() => {
    const newNode: Node<MindMapNodeData> = {
      id: `node-${Date.now()}`,
      type: 'mindmapNode',
      position: { 
        x: Math.random() * 500 + 100, 
        y: Math.random() * 500 + 100 
      },
      data: {
        label: '新しいノード',
        fontSize: 16,
        textColor: '#000000',
        backgroundColor: '#ffffff',
      },
    };

    setNodes((nds) => [...nds, newNode]);
    return newNode.id;
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, newData: Partial<MindMapNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );

    // Update selected node if it's the one being edited
    setSelectedNode((current) => {
      if (current && current.id === nodeId) {
        return { ...current, data: { ...current.data, ...newData } };
      }
      return current;
    });
  }, []);

  const [isEditorOpen, setIsEditorOpen] = useState(true);

  // Auto-open editor when node is selected on mobile
  useEffect(() => {
    if (selectedNode) {
      setIsEditorOpen(true);
    }
  }, [selectedNode]);

  const handleManualSave = useCallback(() => {
    manualSave();
  }, [manualSave]);

  if (!isAuthenticated) {
    return (
      <PasswordScreen 
        onPasswordSubmit={handlePasswordSubmit} 
        error={authError}
      />
    );
  }

  return (
    <div className="app">
      <ProjectSidebar 
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Toolbar 
        onAddNode={handleAddNode}
        onSave={handleManualSave}
        saveStatus={saveStatus}
      />
      
      <div className="app-content">
        <div className="canvas-container">
          <MindmapCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            onNodeSelect={setSelectedNode}
            onAddNode={handleAddNode}
          />
          
          {/* Mobile Editor Toggle */}
          {selectedNode && (
            <button
              className={`mobile-editor-toggle ${isEditorOpen ? 'open' : ''}`}
              onClick={() => setIsEditorOpen(!isEditorOpen)}
            >
              {isEditorOpen ? '▼ 閉じる' : '▲ 編集'}
            </button>
          )}
        </div>

        {selectedNode && (
          <div className={`editor-container ${isEditorOpen ? 'open' : 'closed'}`}>
            <NodeEditorPanel
              selectedNode={selectedNode}
              onUpdateNode={handleUpdateNode}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
