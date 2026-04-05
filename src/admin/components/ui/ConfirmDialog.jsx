import React from 'react';
import Modal from './Modal.jsx';

/**
 * Diálogo de confirmación para acciones destructivas (eliminar, etc.)
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  type = 'danger', // 'danger' | 'warning'
  loading = false,
}) {
  const btnColor = type === 'danger'
    ? 'bg-error hover:bg-red-700'
    : 'bg-warning hover:bg-amber-600';

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-background-soft transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-sm font-bold text-white ${btnColor} transition-colors flex items-center gap-2`}
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center py-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
          type === 'danger' ? 'bg-red-50 text-error' : 'bg-amber-50 text-warning'
        }`}>
          <span className="material-symbols-outlined text-3xl">
            {type === 'danger' ? 'delete_forever' : 'warning'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-text-main mb-2">{title}</h3>
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </Modal>
  );
}
