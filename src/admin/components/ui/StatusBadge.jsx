import React from 'react';

const STATUS_CONFIG = {
  active:    { label: 'Activo',     bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  inactive:  { label: 'Inactivo',   bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400' },
  draft:     { label: 'Borrador',   bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  pending:   { label: 'Pendiente',  bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  confirmed: { label: 'Confirmado', bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500' },
  shipped:   { label: 'Enviado',    bg: 'bg-indigo-50',   text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  delivered: { label: 'Entregado',  bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelado',  bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
