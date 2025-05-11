'use client';

import { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function Badge({
  text,
  variant = 'default',
  className = '',
  dismissible = false,
  onDismiss
}: BadgeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-muted text-muted-foreground';
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getVariantClasses()} ${className}`}>
      {text}
      {dismissible && (
        <button
          type="button"
          className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full inline-flex items-center justify-center hover:bg-muted-foreground/10"
          onClick={handleDismiss}
        >
          <FiX className="h-3 w-3" />
          <span className="sr-only">Rimuovi</span>
        </button>
      )}
    </span>
  );
}
