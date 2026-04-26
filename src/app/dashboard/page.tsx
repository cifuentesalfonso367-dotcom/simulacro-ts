"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSchedule } from '@/context/scheduleContext';
import { Button } from '@/components/ui/Button';

export default function DashboardPage({ activeTab = 'general' }: { activeTab?: string }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { schedules, fetchSchedules, isLoading: schedulesLoading, error, createSchedule } = useSchedule();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { router.push('/login'); }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) { fetchSchedules(); }
  }, [isAuthenticated, fetchSchedules]);

  useEffect(() => {
    if (!isCreating || users.length > 0) return;
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
          if (assignedUserIds.length === 0) setAssignedUserIds([result.data[0]?.id ?? user?.id ?? '']);
        } else { setMessage(result.message || 'No se pudo cargar usuarios'); }
      } catch { setMessage('No se pudo cargar el listado de usuarios'); }
    };
    loadUsers();
  }, [isCreating, users.length, assignedUserIds.length, user]);

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calendarDate]);

  const getSchedulesForDay = (day: number) => {
    return schedules.filter(s => {
      const d = new Date(s.startTime);
      return d.getDate() === day && d.getMonth() === calendarDate.getMonth() && d.getFullYear() === calendarDate.getFullYear();
    });
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear();

  const tagColors = ['bg-violet-500/20 text-violet-300 border-violet-500/30', 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', 'bg-amber-500/20 text-amber-300 border-amber-500/30', 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', 'bg-rose-500/20 text-rose-300 border-rose-500/30'];

  if (authLoading || !isAuthenticated) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!user?.id) { setMessage('No se encontró el usuario actual'); return; }
    const result = await createSchedule({ title, description, startTime, endTime, userIds: assignedUserIds.length > 0 ? assignedUserIds : [user.id] });
    if (result.success) { setMessage('Horario creado correctamente'); setTitle(''); setDescription(''); setStartTime(''); setEndTime(''); setAssignedUserIds([]); setIsCreating(false); }
    else { setMessage(result.message); }
  };

  // ─── STAT CARDS (shared) ───
  const statsSection = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
      <div className="glass-card p-6 stat-glow-violet relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Asignaciones</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{schedules.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--accent-violet)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
        </div>
      </div>
      <div className="glass-card p-6 stat-glow-emerald relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Estado</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent-emerald)' }}>Activo</p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.15)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>
      <div className="glass-card p-6 stat-glow-amber relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Rol</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent-amber)' }}>{user?.role}</p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.15)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── CREATE FORM ───
  const createForm = isCreating && (
    <div className="glass-card p-6 mb-8 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Nuevo Turno</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Asignar un turno a uno o más usuarios</p>
        </div>
        <button onClick={() => setIsCreating(false)} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Título</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="Ej. Reunión de equipo" required />
          </div>
          <div className="space-y-2 relative">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Usuarios</label>
            {/* Selected tags */}
            <button
              type="button"
              onClick={() => setShowUserDropdown(prev => !prev)}
              className="input-field text-left flex items-center justify-between cursor-pointer"
            >
              <span className="flex flex-wrap gap-1 flex-1">
                {assignedUserIds.length === 0 ? (
                  <span style={{ color: 'var(--text-muted)' }}>Seleccionar usuarios...</span>
                ) : (
                  assignedUserIds.map(uid => {
                    const u = users.find(x => x.id === uid);
                    return u ? (
                      <span key={uid} className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent-violet)', border: '1px solid rgba(139,92,246,0.25)' }}>
                        {u.name}
                        <span
                          onClick={(e) => { e.stopPropagation(); setAssignedUserIds(prev => prev.filter(id => id !== uid)); }}
                          className="cursor-pointer hover:text-white"
                        >×</span>
                      </span>
                    ) : null;
                  })
                )}
              </span>
              <svg className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {/* Dropdown */}
            {showUserDropdown && (
              <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden animate-slide-up" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <div className="max-h-48 overflow-y-auto p-1.5">
                  {users.map(u => {
                    const isSelected = assignedUserIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setAssignedUserIds(prev => isSelected ? prev.filter(id => id !== u.id) : [...prev, u.id]);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left cursor-pointer transition-colors"
                        style={{ background: isSelected ? 'rgba(139,92,246,0.1)' : 'transparent' }}
                      >
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ border: isSelected ? 'none' : '1.5px solid var(--text-muted)', background: isSelected ? 'var(--accent-violet)' : 'transparent' }}>
                          {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{u.email} · {u.role}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="p-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <button type="button" onClick={() => setShowUserDropdown(false)} className="btn-primary w-full text-xs py-2">
                    Listo ({assignedUserIds.length} seleccionados)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Descripción</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-field" placeholder="Detalles del turno" rows={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Inicio</label>
            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="input-field" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Fin</label>
            <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="input-field" required />
          </div>
        </div>
        {message && <p className="text-sm font-medium animate-slide-up" style={{ color: 'var(--accent-amber)' }}>{message}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="submit" size="md">Guardar</Button>
          <Button variant="secondary" type="button" size="md" onClick={() => setIsCreating(false)}>Cancelar</Button>
        </div>
      </form>
    </div>
  );

  // ─── CALENDAR VIEW ───
  const calendarView = (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors" style={{ border: '1px solid var(--border-subtle)' }}>
            <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onClick={() => setCalendarDate(new Date())} className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-white/5 transition-colors" style={{ border: '1px solid var(--border-subtle)', color: 'var(--accent-violet)' }}>Hoy</button>
          <button onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors" style={{ border: '1px solid var(--border-subtle)' }}>
            <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(d => <div key={d} className="text-center py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => (
            <div key={i} className={`calendar-day min-h-[90px] p-2 rounded-xl border ${day ? '' : 'opacity-0'}`} style={{ borderColor: isToday(day!) ? 'var(--accent-violet)' : 'var(--border-subtle)', background: isToday(day!) ? 'rgba(139,92,246,0.06)' : 'transparent' }}>
              {day && (
                <>
                  <span className={`text-xs font-bold ${isToday(day) ? '' : ''}`} style={{ color: isToday(day) ? 'var(--accent-violet)' : 'var(--text-secondary)' }}>{day}</span>
                  <div className="mt-1 space-y-1">
                    {getSchedulesForDay(day).slice(0, 2).map((s, j) => (
                      <div key={s.id} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border truncate ${tagColors[j % tagColors.length]}`}>{s.title}</div>
                    ))}
                    {getSchedulesForDay(day).length > 2 && <p className="text-[9px] font-bold" style={{ color: 'var(--text-muted)' }}>+{getSchedulesForDay(day).length - 2} más</p>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── LIST VIEW ───
  const listView = (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Registros Recientes</h2>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-violet)' }}>{schedules.length} turnos</span>
      </div>
      {schedulesLoading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--border-subtle)', borderTopColor: 'var(--accent-violet)' }}></div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Sincronizando</p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="p-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(139,92,246,0.08)' }}>
            <svg className="w-7 h-7" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No hay asignaciones</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Actividad</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Inicio</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Fin</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, i) => (
                <tr key={s.id} className="table-row" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${['bg-violet-400', 'bg-emerald-400', 'bg-amber-400', 'bg-cyan-400', 'bg-rose-400'][i % 5]}`}></div>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{new Date(s.startTime).toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{new Date(s.endTime).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', color: 'var(--accent-emerald)', border: '1px solid rgba(52,211,153,0.2)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>{s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold gradient-text tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            {activeTab === 'calendar' ? 'Calendario' : activeTab === 'list' ? 'Turnos' : 'Dashboard'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Gestión operativa en tiempo real</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <Button onClick={() => { setIsCreating(c => !c); setMessage(null); }} size="md">
            {isCreating ? '✕ Cerrar' : '+ Nuevo Turno'}
          </Button>
        )}
      </header>

      {error && <div className="p-4 rounded-xl text-sm font-medium animate-slide-up" style={{ background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.15)', color: 'var(--accent-rose)' }}>{error}</div>}

      {statsSection}
      {createForm}

      {activeTab === 'calendar' && calendarView}
      {activeTab === 'list' && listView}
      {activeTab === 'general' && (
        <>
          {calendarView}
          <div className="mt-6">{listView}</div>
        </>
      )}
    </div>
  );
}