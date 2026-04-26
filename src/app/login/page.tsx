"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        login(data.data.accessToken, data.data.user);
        router.push('/dashboard');
      } else {
        setError(data.message);
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: 'linear-gradient(135deg, var(--accent-violet), #a78bfa)' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>ClockHub</h1>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>Gestión inteligente de turnos</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm text-center font-medium animate-slide-up" style={{ background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.2)', color: 'var(--accent-rose)' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="font-semibold hover:underline" style={{ color: 'var(--accent-violet)' }}>Regístrate</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}