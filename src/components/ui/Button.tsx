"use client";

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-2xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border backdrop-blur-md shadow-lg';
  
  const variants = {
    primary: 'bg-slate-900/80 text-[#fdfbf7] border-slate-700/50 hover:bg-slate-800/90 hover:shadow-slate-900/20',
    secondary: 'bg-[#e5d9c5]/50 text-slate-900 border-[#e5d9c5]/30 hover:bg-[#d4c3a3]/60',
    danger: 'bg-red-900/80 text-[#fdfbf7] border-red-800/50 hover:bg-red-800/90',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
};