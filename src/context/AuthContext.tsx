"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restore session from localStorage on mount
    try {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('authUser');
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Invalid data, clear it
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    setUser(null);
    // Idealmente, también se debería llamar a un endpoint para invalidar la cookie HttpOnly
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};