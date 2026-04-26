"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Schedule } from '@prisma/client';

type ScheduleWithUser = Schedule & {
  user?: { id: string; name: string; email: string };
};

interface ScheduleContextType {
  schedules: ScheduleWithUser[];
  isLoading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  createSchedule: (payload: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    userIds: string[];
  }) => Promise<{ success: boolean; message: string }>; 
  addScheduleLocally: (schedule: ScheduleWithUser) => void;
  removeScheduleLocally: (id: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [schedules, setSchedules] = useState<ScheduleWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/schedules', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setSchedules(result.data);
      } else {
        setError(result.message);
      }
    } catch (err: unknown) {
      setError('Error de conexión al cargar horarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSchedule = React.useCallback(async (payload: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    userIds: string[];
  }): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setSchedules((prev) => [...prev, ...result.data]);
        return { success: true, message: result.message };
      }

      setError(result.message);
      return { success: false, message: result.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error de conexión al crear horario';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addScheduleLocally = React.useCallback((schedule: ScheduleWithUser) => {
    setSchedules((prev) => [...prev, schedule]);
  }, []);

  const removeScheduleLocally = React.useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <ScheduleContext.Provider value={{ schedules, isLoading, error, fetchSchedules, createSchedule, addScheduleLocally, removeScheduleLocally }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = (): ScheduleContextType => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule debe ser usado dentro de un ScheduleProvider');
  }
  return context;
};