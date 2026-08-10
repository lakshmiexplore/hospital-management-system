import * as React from 'react';

export function Card({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
  );
}

export function CardHeader({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={`text-lg font-semibold text-slate-900 ${className}`}>{children}</h3>;
}

export function CardContent({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
