import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-[#f5f0e6]/60 to-[#e5d9c5]/30 backdrop-blur-xl p-8 border border-white/50 shadow-[0_8px_32px_0_rgba(15,23,42,0.05)] rounded-3xl ${className}`}>
      {children}
    </div>
  );
};