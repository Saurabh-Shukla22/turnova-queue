'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('queueless_token');
    const savedUser = localStorage.getItem('queueless_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with server in background
        api
          .get<{ success: boolean; user: any }>('/auth/me')
          .then((res) => {
            if (res.success && res.user) {
              const enrichedUser: User = {
                id: res.user._id,
                name: res.user.name,
                email: res.user.email,
                phone: res.user.phone,
                role: res.user.role,
                avatar: res.user.avatar,
                notificationSettings: res.user.notificationSettings,
                businessId: res.user.business?._id,
                businessName: res.user.business?.name,
              };
              setUser(enrichedUser);
              localStorage.setItem('queueless_user', JSON.stringify(enrichedUser));
            }
          })
          .catch(() => {
            // Token expired or invalid
            logout();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post<{
        success: boolean;
        token: string;
        user: User;
        message: string;
      }>('/auth/login', { email, password });

      localStorage.setItem('queueless_token', res.token);
      localStorage.setItem('queueless_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);

      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await api.post<{
        success: boolean;
        token: string;
        user: User;
      }>('/auth/register', data);

      localStorage.setItem('queueless_token', res.token);
      localStorage.setItem('queueless_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('queueless_token');
    localStorage.removeItem('queueless_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('queueless_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
