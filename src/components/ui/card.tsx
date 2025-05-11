'use client';

import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-card rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-medium text-card-foreground">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
