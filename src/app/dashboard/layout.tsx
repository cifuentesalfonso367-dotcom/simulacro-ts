"use client";

import React, { ReactNode, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { id: 'general', label: 'General', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'calendar', label: 'Calendario', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'list', label: 'Lista de Turnos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col m-3 relative z-20">
        <div className="h-full flex flex-col rounded-2xl p-5" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-violet), #a78bfa)' }}>
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>ClockHub</h2>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-violet)' }}>Dashboard</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${activeTab === item.id ? 'active' : ''}`}
                style={{ color: activeTab === item.id ? 'var(--accent-violet)' : 'var(--text-secondary)', border: '1px solid transparent' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User card */}
          <div className="mt-auto p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--accent-violet), #a78bfa)' }}>
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent-emerald)' }}>{user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5" style={{ background: 'rgba(251,113,133,0.06)', color: 'var(--accent-rose)', border: '1px solid rgba(251,113,133,0.12)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<{ activeTab?: string }>, { activeTab })
            : children}
        </div>
      </main>
    </div>
  );
}
