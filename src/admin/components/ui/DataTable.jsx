import React, { useState, useCallback } from 'react';
import EmptyState from './EmptyState.jsx';

/**
 * Tabla de datos reutilizable con sorting, selección y acciones
 * 
 * @param {Array} columns - [{key, label, sortable, render, width, align}]
 * @param {Array} data - Datos a mostrar
 * @param {boolean} loading - Estado de carga
 * @param {Function} onSort - Callback de sorting (key, dir)
 * @param {string} sortBy - Columna actual de sort
 * @param {string} sortDir - Dirección actual ('asc'|'desc')
 * @param {Function} onRowClick - Click en fila
 * @param {Array} actions - Acciones por fila [{icon, label, onClick, color}]
 * @param {boolean} selectable - Habilitar selección multi
 * @param {Array} selected - IDs seleccionados
 * @param {Function} onSelect - Callback de selección
 * @param {string} idKey - Key para identificar filas (default: 'id')
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  onSort,
  sortBy,
  sortDir,
  onRowClick,
  actions = [],
  selectable = false,
  selected = [],
  onSelect,
  idKey = 'id',
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  emptyActionLabel,
}) {
  const [hoveredRow, setHoveredRow] = useState(null);

  const toggleSelect = useCallback((id) => {
    if (!onSelect) return;
    if (selected.includes(id)) {
      onSelect(selected.filter(s => s !== id));
    } else {
      onSelect([...selected, id]);
    }
  }, [selected, onSelect]);

  const toggleAll = useCallback(() => {
    if (!onSelect) return;
    if (selected.length === data.length) {
      onSelect([]);
    } else {
      onSelect(data.map(d => d[idKey]));
    }
  }, [selected, data, onSelect, idKey]);

  const handleSort = (key) => {
    if (!onSort) return;
    const newDir = sortBy === key && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(key, newDir);
  };

  // Loading skeleton
  if (loading && data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-soft/50">
                {columns.map((col, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
                    <div className="skeleton-loader h-4 w-20 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-t border-border-light/50">
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="skeleton-loader h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border-light">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
          actionLabel={emptyActionLabel}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-soft">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-background-soft/60">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === data.length && data.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-border-strong text-primary focus:ring-primary/20 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3 text-${col.align || 'left'} text-xs font-bold text-text-secondary uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:text-text-main select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortBy === col.key && (
                      <span className="material-symbols-outlined text-sm text-primary">
                        {sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-right text-xs font-bold text-text-secondary uppercase tracking-wider w-28">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row[idKey] || idx}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onRowClick?.(row)}
                className={`border-t border-border-light/50 transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${hoveredRow === idx ? 'bg-primary/[0.03]' : ''} ${
                  selected.includes(row[idKey]) ? 'bg-primary/[0.06]' : ''
                }`}
              >
                {selectable && (
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.includes(row[idKey])}
                      onChange={() => toggleSelect(row[idKey])}
                      className="w-4 h-4 rounded border-border-strong text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-${col.align || 'left'} ${
                      col.key === columns[0]?.key ? 'font-medium text-text-main' : 'text-text-secondary'
                    }`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => act.onClick(row)}
                          title={act.label}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            act.color === 'danger'
                              ? 'text-text-muted hover:text-error hover:bg-red-50'
                              : 'text-text-muted hover:text-primary hover:bg-primary/10'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">{act.icon}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="flex items-center justify-center py-3 border-t border-border-light">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
