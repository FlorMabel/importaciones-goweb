import React from 'react';

/**
 * Controles de paginación
 */
export default function Pagination({ page, totalPages, total, perPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  // Generate page numbers to show
  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i);
  }
  if (pages[0] > 1) pages.unshift(-1); // ellipsis
  if (pages[0] > 1 && pages[0] !== -1) pages.unshift(1);
  if (pages[pages.length - 1] < totalPages) {
    pages.push(-2); // ellipsis
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mt-4 pt-4 border-t border-border-light">
      <span className="text-xs text-text-muted">
        Mostrando {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-background-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        {pages.map((p, i) =>
          p < 0 ? (
            <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-text-muted text-xs">•••</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                p === page
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-text-secondary hover:bg-background-soft'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-background-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
