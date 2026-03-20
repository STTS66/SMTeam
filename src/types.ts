export interface User {
  id: string;
  username: string;
  displayName: string;
  isAdmin?: boolean;
  avatar?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'file';
  url: string;
  size: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  files: ProjectFile[];
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
