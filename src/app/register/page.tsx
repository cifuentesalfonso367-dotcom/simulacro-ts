"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('¡Registro exitoso! Redirigiendo...');
        setTimeout(() => router.push('/login'), 1200);
      } else {
        setError(data.message || 'Error de registro');
      }
    } catch (err: unknown) {
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: 'linear-gradient(135deg, var(--accent-emerald), #6ee7b7)' }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>Crear Cuenta</h1>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>Únete a ClockHub en segundos</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>Nombre completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Tu nombre" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="tu@email.com" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest ml-1" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm text-center font-medium animate-slide-up" style={{ background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.2)', color: 'var(--accent-rose)' }}>{error}</div>
            )}
            {success && (
              <div className="p-3 rounded-xl text-sm text-center font-medium animate-slide-up" style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', color: 'var(--accent-emerald)' }}>{success}</div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Crear mi cuenta'}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent-violet)' }}>Inicia sesión</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
