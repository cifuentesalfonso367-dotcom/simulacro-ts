"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';

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
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#d4c3a3]/40 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-800/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

      <Card className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-slate-900 tracking-tight mb-2">
            ClockHub
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fdfbf7]/60 backdrop-blur-md border border-[#e5d9c5]/80 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 p-4 rounded-xl outline-none text-slate-900 transition-all shadow-inner"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800 uppercase tracking-widest ml-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fdfbf7]/60 backdrop-blur-md border border-[#e5d9c5]/80 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 p-4 rounded-xl outline-none text-slate-900 transition-all shadow-inner"
              required
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-900/10 backdrop-blur-md border border-red-900/20 text-red-900 text-sm text-center rounded-xl font-medium">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full mt-6 py-4" isLoading={isLoading}>
            Ingresar
          </Button>
        </form>
      </Card>
    </div>
  );
}