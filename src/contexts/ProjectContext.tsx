import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Project, ProjectFile } from '../types';

interface ProjectContextType {
  projects: Project[];
  addProject: (title: string, description: string, files: ProjectFile[], authorId: string, authorName: string) => void;
  updateProject: (projectId: string, title: string, description: string, files: ProjectFile[]) => void;
  deleteProject: (projectId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('smteam_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('smteam_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (title: string, description: string, files: ProjectFile[], authorId: string, authorName: string) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title,
      description,
      files,
      createdAt: new Date().toISOString(),
      authorId,
      authorName,
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (projectId: string, title: string, description: string, files: ProjectFile[]) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, title, description, files };
      }
      return p;
    }));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}
