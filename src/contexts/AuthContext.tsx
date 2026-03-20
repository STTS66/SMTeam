import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, displayName: string) => boolean;
  updateProfile: (data: { displayName?: string; newPassword?: string; oldPassword?: string; avatar?: string }) => { success: boolean; error?: string };
  logout: () => void;
}

const ADMIN_ACCOUNTS = [
  {
    id: 'admin-001',
    username: 'SMAdmin_Alpha',
    password: 'SM$T3am_@dM1n#2026!xK9',
    displayName: 'SM Admin Alpha',
    isAdmin: true,
  },
  {
    id: 'admin-002',
    username: 'SMAdmin_Omega',
    password: 'Pr0j3ct$_M@st3r#SM!7qZ',
    displayName: 'SM Admin Omega',
    isAdmin: true,
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('smteam_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { user: null, isAuthenticated: false };
      }
    }
    return { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('smteam_auth', JSON.stringify(authState));
  }, [authState]);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('smteam_users') || '[]');
    const user = users.find(
      (u: { username: string; password: string }) => u.username === username && u.password === password
    );
    if (user) {
      setAuthState({
        user: { id: user.id, username: user.username, displayName: user.displayName, isAdmin: user.isAdmin, avatar: user.avatar },
        isAuthenticated: true,
      });
      return true;
    }

    const admin = ADMIN_ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    );
    if (admin) {
      setAuthState({
        user: { id: admin.id, username: admin.username, displayName: admin.displayName, isAdmin: true },
        isAuthenticated: true,
      });
      return true;
    }

    return false;
  };

  const register = (username: string, password: string, displayName: string): boolean => {
    if (ADMIN_ACCOUNTS.some((a) => a.username === username)) return false;

    const users = JSON.parse(localStorage.getItem('smteam_users') || '[]');
    if (users.some((u: { username: string }) => u.username === username)) return false;

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      password,
      displayName,
      isAdmin: false,
    };
    users.push(newUser);
    localStorage.setItem('smteam_users', JSON.stringify(users));

    setAuthState({
      user: { id: newUser.id, username: newUser.username, displayName: newUser.displayName, isAdmin: false },
      isAuthenticated: true,
    });
    return true;
  };

  const updateProfile = (data: { displayName?: string; newPassword?: string; oldPassword?: string; avatar?: string }) => {
    if (!authState.user) return { success: false, error: 'Пользователь не авторизован' };
    
    const users = JSON.parse(localStorage.getItem('smteam_users') || '[]');
    let userIndex = users.findIndex((u: any) => u.username === authState.user!.username);

    let actualOldPassword = '';
    if (userIndex >= 0) {
      actualOldPassword = users[userIndex].password;
    } else {
      const adminAcc = ADMIN_ACCOUNTS.find(a => a.username === authState.user!.username);
      if (adminAcc) actualOldPassword = adminAcc.password;
    }

    if (data.newPassword) {
      if (!data.oldPassword) return { success: false, error: 'Введите старый пароль для смены пароля' };
      if (actualOldPassword !== data.oldPassword) return { success: false, error: 'Неверный старый пароль' };
    }

    let updatedUser;
    if (userIndex >= 0) {
      updatedUser = { ...users[userIndex], ...data };
      if (data.newPassword) updatedUser.password = data.newPassword;
      delete updatedUser.newPassword;
      delete updatedUser.oldPassword;
      users[userIndex] = updatedUser;
    } else {
      const adminAcc = ADMIN_ACCOUNTS.find(a => a.username === authState.user!.username);
      if (adminAcc) {
        updatedUser = { ...adminAcc, ...data };
        if (data.newPassword) updatedUser.password = data.newPassword;
        delete updatedUser.newPassword;
        delete updatedUser.oldPassword;
        users.push(updatedUser);
      }
    }

    if (updatedUser) {
      localStorage.setItem('smteam_users', JSON.stringify(users));
      setAuthState({
        user: { 
          id: updatedUser.id, 
          username: updatedUser.username, 
          displayName: updatedUser.displayName, 
          isAdmin: updatedUser.isAdmin,
          avatar: updatedUser.avatar
        },
        isAuthenticated: true,
      });
      return { success: true };
    }
    
    return { success: false, error: 'Произошла ошибка при сохранении' };
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
