import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { 
  login, 
  logout, 
  getTokens, 
  getUserData, 
  isAuthenticated as checkIsAuthenticated, 
  isStaff as checkIsStaff, 
  checkAuthStatus, 
  refreshToken 
} from '../services/auth';

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isStaff: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const isAuth = await checkAuthStatus();
        if (isAuth) {
          setUser(getUserData());
          setTokens(getTokens());
        }
      } catch (error) {
        console.error('Auth init failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleLogin = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await login(username, password);
      setUser(result.user);
      setTokens(result.tokens);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const newTokens = await refreshToken();
      if (newTokens) {
        setTokens(newTokens);
        const userData = getUserData();
        if (userData) setUser(userData);
      } else {
        await handleLogout();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
      await handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  const handleUpdateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && checkIsAuthenticated(),
    isStaff: checkIsStaff(),
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshAuth: handleRefreshAuth,
    updateUser: handleUpdateUser,
  };

  // Use React.createElement to avoid JSX issues
  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
};

// Custom hook for protected routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/staff/login';
    }
  }, [isAuthenticated, isLoading]);
  return { isAuthenticated, isLoading };
};

// Custom hook for staff-only routes
export const useRequireStaff = () => {
  const { isAuthenticated, isStaff, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) window.location.href = '/staff/login';
      else if (!isStaff) window.location.href = '/';
    }
  }, [isAuthenticated, isStaff, isLoading]);
  return { isAuthenticated, isStaff, isLoading };
};

// Check if user can edit
export const useCanEdit = (authorId?: number) => {
  const { user, isStaff } = useAuth();
  if (!user) return false;
  if (isStaff) return true;
  if (authorId && user.id === authorId) return true;
  return false;
};