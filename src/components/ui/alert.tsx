'use client';

import { ReactNode } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  title: string;
  children?: ReactNode;
}

export default function Alert({ type, title, children }: AlertProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <FiInfo className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FiInfo className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`rounded-md border p-4 ${getTypeStyles()}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          {children && <div className="mt-2 text-sm">{children}</div>}
        </div>
      </div>
    </div>
  );
}
