import React from 'react';

/**
 * Estado vacío con icono y CTA
 */
export default function EmptyState({
  icon = 'inbox',
  title = 'No hay datos',
  description = 'No se encontraron resultados.',
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-background-soft flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-text-muted">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-text-main mb-1">{title}</h3>
      <p className="text-sm text-text-muted text-center max-w-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
        >
          {actionLabel || 'Crear nuevo'}
        </button>
      )}
    </div>
  );
}
