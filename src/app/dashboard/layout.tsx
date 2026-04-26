"use client";

import React, { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#d4c3a3]/50 rounded-full mix-blend-multiply filter blur-[150px] animate-pulse pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[900px] h-[900px] bg-slate-800/30 rounded-full mix-blend-multiply filter blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-[#e5d9c5]/60 rounded-full mix-blend-multiply filter blur-[130px] pointer-events-none"></div>

      <aside className="w-72 hidden md:flex flex-col m-6 relative z-20">
        <div className="h-full bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(15,23,42,0.08)] rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
              <span className="text-[#fdfbf7] font-serif text-2xl font-bold">C</span>
            </div>
            <h2 className="text-2xl font-serif text-slate-900 tracking-tight">ClockHub</h2>
          </div>

          <nav className="flex-1 space-y-4">
            <div className="flex items-center gap-4 px-6 py-4 bg-slate-900/5 border border-slate-900/10 rounded-2xl text-slate-900 font-medium transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              General
            </div>
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-white/50 rounded-2xl text-slate-600 font-medium transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Calendario
            </div>
          </nav>

          <div className="mt-auto bg-gradient-to-br from-[#e5d9c5]/40 to-transparent p-6 rounded-3xl border border-white/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#fdfbf7] font-serif text-lg">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-600 uppercase tracking-widest mt-1">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-white/60 hover:bg-white border border-white shadow-sm rounded-xl text-slate-900 text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-hide">
          {children}
        </div>
      </main>
    </div>
  );
}
