"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Schedule } from '@prisma/client';

interface ScheduleContextType {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  addScheduleLocally: (schedule: Schedule) => void;
  removeScheduleLocally: (id: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
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
  };

  const addScheduleLocally = (schedule: Schedule) => {
    setSchedules((prev) => [...prev, schedule]);
  };

  const removeScheduleLocally = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <ScheduleContext.Provider value={{ schedules, isLoading, error, fetchSchedules, addScheduleLocally, removeScheduleLocally }}>
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