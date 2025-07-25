import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; data?: unknown; message?: string }>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to normalize backend user to frontend User type
function normalizeUser(raw: any): import('@/types/api').User {
  const [firstName, ...rest] = (raw.name || '').split(' ');
  return {
    id: raw._id || raw.id || '',
    email: raw.email,
    firstName: firstName || '',
    lastName: rest.join(' ') || '',
    phone: raw.phone,
    avatar: raw.avatar,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Memoize logout to avoid dependency issues
  const logoutMemo = React.useCallback(logout, []);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      
      if (savedToken) {
        try {
          setToken(savedToken);
          
          // Verify token is still valid by fetching current user
          const response = await authService.getCurrentUser();
          if (response.success) {
            const normalized = normalizeUser(response.data);
            setUser(normalized);
            localStorage.setItem('user', JSON.stringify(normalized));
          } else {
            // Token is invalid, clear auth state
            logoutMemo();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          logoutMemo();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [logoutMemo]);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data.token) {
      const { token: authToken, ...userData } = response.data;
      const normalized = normalizeUser(userData);
      setToken(authToken);
      setUser(normalized);
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(normalized));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password });
    if (response.success) {
      // Don't automatically log in after registration
      // User needs to verify email first
      return response;
    }
    return response;
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const response = await authService.getCurrentUser();
        if (response.success) {
          const normalized = normalizeUser(response.data);
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        logoutMemo();
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout: logoutMemo,
    register,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 