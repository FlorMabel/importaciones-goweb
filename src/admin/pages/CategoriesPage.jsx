import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import CategoryForm from '../components/forms/CategoryForm.jsx';
import * as adminApi from '../services/adminApi.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (e) {
      showToast('Error al cargar categorías', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleNew = () => { setEditing(null); setFormOpen(true); };
  
  const handleEdit = (cat) => { setEditing(cat); setFormOpen(true); };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await adminApi.saveCategory(data);
      await adminApi.logActivity(editing ? 'update' : 'create', 'category', data.id);
      showToast(editing ? 'Categoría actualizada' : 'Categoría creada', 'success');
      setFormOpen(false);
      load();
    } catch (e) {
      showToast(`Error: ${e.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteCategory(deleteTarget.id);
      await adminApi.logActivity('delete', 'category', deleteTarget.id);
      showToast('Categoría eliminada', 'success');
      setDeleteTarget(null);
      load();
    } catch (e) {
      showToast(`Error: ${e.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="skeleton-loader h-8 w-40 rounded-lg" />
          <div className="skeleton-loader h-10 w-44 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-loader h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-main">Categorías</h1>
          <p className="text-xs text-text-muted">{categories.length} categorías</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-soft"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva Categoría
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-2xl border border-border-light overflow-hidden hover:shadow-medium transition-shadow"
          >
            {/* Image */}
            <div className="relative h-32 overflow-hidden" style={{ backgroundColor: cat.color + '15' }}>
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl" style={{ color: cat.color }}>{cat.icon}</span>
                </div>
              )}
              {/* Order badge */}
              <span className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-black/50 text-white text-xs font-bold flex items-center justify-center">
                {cat.sort_order}
              </span>
            </div>
            
            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-lg" style={{ color: cat.color }}>{cat.icon}</span>
                <h3 className="text-sm font-bold text-text-main">{cat.name}</h3>
              </div>
              <p className="text-xs text-text-muted line-clamp-2 mb-3">{cat.description}</p>
              
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-border-default" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] text-text-muted font-mono">{cat.color}</span>
                <span className="text-[10px] text-text-muted ml-auto">/{cat.slug}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
                <button
                  onClick={() => handleEdit(cat)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Editar
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-error hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? `Editar: ${editing.name}` : 'Nueva Categoría'} size="lg">
        <CategoryForm category={editing} onSave={handleSave} onCancel={() => setFormOpen(false)} saving={saving} />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar "${deleteTarget?.name}"?`}
        message="Se eliminarán todos los productos relacionados a esta categoría."
        loading={deleting}
      />
    </div>
  );
}
