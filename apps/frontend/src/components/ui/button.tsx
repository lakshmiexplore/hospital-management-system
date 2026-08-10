import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  const variantClasses = {
    default: 'bg-sky-600 text-white hover:bg-sky-700',
    outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'text-slate-700 hover:bg-slate-100',
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 px-3',
    lg: 'h-11 px-6',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
