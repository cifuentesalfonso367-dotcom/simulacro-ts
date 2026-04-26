"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSchedule } from '@/context/scheduleContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { schedules, fetchSchedules, isLoading: schedulesLoading, error, createSchedule } = useSchedule();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSchedules();
    }
  }, [isAuthenticated, fetchSchedules]);

  useEffect(() => {
    if (!isCreating || users.length > 0) return;

    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (result.success) {
          setUsers(result.data);
          if (!assignedUserId) {
            setAssignedUserId(result.data[0]?.id ?? user?.id ?? '');
          }
        } else {
          setMessage(result.message || 'No se pudo cargar usuarios');
        }
      } catch {
        setMessage('No se pudo cargar el listado de usuarios');
      }
    };

    loadUsers();
  }, [isCreating, users.length, assignedUserId, user]);

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-serif text-slate-900 tracking-tight mb-3">
            Resumen de Turnos
          </h1>
          <p className="text-slate-600 text-lg">
            Gestión operativa y asignaciones en tiempo real
          </p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <Button
            className="!rounded-2xl !px-8 !py-4 text-sm tracking-widest uppercase bg-gradient-to-r from-slate-900 to-slate-800 border-none shadow-[0_8px_20px_rgb(15,23,42,0.3)] hover:shadow-[0_12px_25px_rgb(15,23,42,0.4)] hover:-translate-y-1"
            onClick={() => {
              setIsCreating((current) => !current);
              setMessage(null);
            }}
          >
            {isCreating ? 'Cerrar formulario' : '+ Nuevo Registro'}
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_0_rgba(15,23,42,0.05)] relative overflow-hidden group hover:bg-white/50 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#d4c3a3]/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Asignaciones</p>
          <p className="text-4xl font-serif text-slate-900">{schedules.length}</p>
        </div>
        <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_32px_0_rgba(15,23,42,0.05)] relative overflow-hidden group hover:bg-white/50 transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-800/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Estado</p>
          <p className="text-4xl font-serif text-slate-900">Activo</p>
        </div>
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] border border-slate-700 shadow-[0_12px_32px_0_rgba(15,23,42,0.3)] relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#d4c3a3]/20 rounded-full blur-3xl"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Privilegios</p>
          <p className="text-3xl font-serif text-[#fdfbf7]">{user?.role}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/10 backdrop-blur-md border border-red-900/20 rounded-[2rem] text-red-900 p-6 font-medium">
          {error}
        </div>
      )}

      {isCreating && (
        <Card className="p-6 bg-white/90 shadow-lg border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Crear nuevo horario</h2>
              <p className="text-slate-500 mt-1">Asignar un turno nuevo a un usuario activo.</p>
            </div>
          </div>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setMessage(null);

              if (!user?.id) {
                setMessage('No se encontró el usuario actual');
                return;
              }

              const result = await createSchedule({
                title,
                description,
                startTime,
                endTime,
                userId: assignedUserId || user.id,
              });

              if (result.success) {
                setMessage('Horario creado correctamente');
                setTitle('');
                setDescription('');
                setStartTime('');
                setEndTime('');
                setAssignedUserId('');
                setIsCreating(false);
              } else {
                setMessage(result.message);
              }
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block text-sm font-medium text-slate-700">
                Título
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="Ej. Reunión de equipo"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Usuario
                <select
                  value={assignedUserId}
                  onChange={(event) => setAssignedUserId(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map((targetUser) => (
                    <option key={targetUser.id} value={targetUser.id}>
                      {targetUser.name} ({targetUser.role})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Descripción
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                placeholder="Detalles del turno"
              />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="block text-sm font-medium text-slate-700">
                Inicio
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Fin
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-slate-900"
                  required
                />
              </label>
            </div>
            {message && <p className="text-sm font-medium text-slate-700">{message}</p>}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto">
                Guardar horario
              </Button>
              <Button variant="secondary" type="button" className="w-full sm:w-auto" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_0_rgba(15,23,42,0.05)] rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-[#e5d9c5]/40 flex justify-between items-center bg-white/20">
          <h2 className="text-2xl font-serif text-slate-900">Registros Recientes</h2>
        </div>
        
        {schedulesLoading ? (
          <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-[#e5d9c5] border-t-slate-900 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-slate-600 uppercase tracking-widest text-sm font-medium">Sincronizando</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-24 text-center">
            <div className="w-24 h-24 bg-[#e5d9c5]/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-slate-600 font-serif text-xl">No hay asignaciones en el sistema</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Actividad</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hora de Inicio</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hora de Cierre</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5d9c5]/30">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-white/50 transition-all duration-300 rounded-2xl group">
                    <td className="px-6 py-5 rounded-l-2xl">
                      <p className="font-serif text-xl text-slate-900">{schedule.title}</p>
                    </td>
                    <td className="px-6 py-5 text-slate-600 text-sm font-medium">
                      {new Date(schedule.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-slate-600 text-sm font-medium">
                      {new Date(schedule.endTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 rounded-r-2xl">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900/5 text-slate-900 uppercase tracking-widest border border-slate-900/10 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mr-2"></span>
                        {schedule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}