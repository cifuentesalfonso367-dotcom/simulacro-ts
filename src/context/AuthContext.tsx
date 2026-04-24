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
    const checkSession = async () => {
      // Aquí iría la lógica para validar el refreshToken al cargar la app
      // Por simplicidad en este paso, simularemos que no hay sesión activa de inicio
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = (token: string, userData: AuthUser) => {
    localStorage.setItem('accessToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
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