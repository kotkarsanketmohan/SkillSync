import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-primary-dark",
    success: "bg-green-100 text-success",
    warning: "bg-yellow-100 text-warning",
    danger: "bg-red-100 text-danger",
    navy: "bg-navy/10 text-navy",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
