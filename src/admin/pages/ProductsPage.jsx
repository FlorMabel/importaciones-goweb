import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../components/ui/DataTable.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import ProductForm from '../components/forms/ProductForm.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import * as adminApi from '../services/adminApi.js';
import { formatPrice, truncate } from '../utils/formatters.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProductsPage() {
  const { showToast } = useToast();

  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const debouncedSearch = useDebounce(search);

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load categories once
  useEffect(() => {
    adminApi.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getProducts({
        page,
        perPage: 20,
        sortBy,
        sortDir,
        search: debouncedSearch,
        filters: categoryFilter ? { category_id: categoryFilter } : {},
      });
      setProducts(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (e) {
      showToast('Error al cargar productos', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDir, debouncedSearch, categoryFilter, showToast]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, categoryFilter]);

  // CRUD handlers
  const handleNew = () => { setEditingProduct(null); setFormOpen(true); };
  
  const handleEdit = async (product) => {
    try {
      const full = await adminApi.getProduct(product.id);
      setEditingProduct(full);
      setFormOpen(true);
    } catch (e) {
      showToast('Error al cargar producto', 'error');
    }
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await adminApi.saveProduct(data);
      await adminApi.logActivity(editingProduct ? 'update' : 'create', 'product', data.id);
      showToast(editingProduct ? 'Producto actualizado' : 'Producto creado', 'success');
      setFormOpen(false);
      loadProducts();
    } catch (e) {
      showToast(`Error: ${e.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (product) => {
    try {
      await adminApi.duplicateProduct(product.id);
      showToast('Producto duplicado', 'success');
      loadProducts();
    } catch (e) {
      showToast(`Error al duplicar: ${e.message}`, 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteProduct(deleteTarget.id);
      await adminApi.logActivity('delete', 'product', deleteTarget.id);
      showToast('Producto eliminado', 'success');
      setDeleteTarget(null);
      loadProducts();
    } catch (e) {
      showToast(`Error: ${e.message}`, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleSort = (key, dir) => { setSortBy(key); setSortDir(dir); };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Producto',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-background-soft flex-shrink-0 overflow-hidden">
            {row.product_images?.[0]?.image_url ? (
              <img src={row.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-text-muted/30 text-lg">image</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-main truncate">{row.name}</p>
            <p className="text-xs text-text-muted truncate">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category_id',
      label: 'Categoría',
      sortable: true,
      render: (val) => {
        const cat = categories.find(c => c.id === val);
        return (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
            {cat?.name || val}
          </span>
        );
      },
    },
    {
      key: 'price',
      label: 'Precio',
      sortable: true,
      align: 'right',
      render: (val, row) => (
        <div>
          <p className="text-sm font-bold text-primary">{formatPrice(val)}</p>
          {row.old_price && <p className="text-xs text-text-muted line-through">{formatPrice(row.old_price)}</p>}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className={`text-xs font-bold ${val <= 5 ? 'text-error' : val <= 15 ? 'text-warning' : 'text-success'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (val) => <StatusBadge status={val || 'active'} />,
    },
  ];

  const actions = [
    { icon: 'edit', label: 'Editar', onClick: handleEdit },
    { icon: 'content_copy', label: 'Duplicar', onClick: handleDuplicate },
    { icon: 'delete', label: 'Eliminar', onClick: (row) => setDeleteTarget(row), color: 'danger' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-main">Productos</h1>
          <p className="text-xs text-text-muted">{total} productos en total</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-soft"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar productos..."
          className="w-full sm:w-64"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-border-default px-3 py-2.5 text-sm bg-white focus:border-primary outline-none"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        actions={actions}
        emptyIcon="inventory_2"
        emptyTitle="No hay productos"
        emptyDescription="Crea tu primer producto para empezar."
        emptyAction={handleNew}
        emptyActionLabel="Crear producto"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={20}
        onPageChange={setPage}
      />

      {/* Product Form Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProduct ? `Editar: ${editingProduct.name}` : 'Nuevo Producto'}
        size="full"
      >
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setFormOpen(false)}
          saving={saving}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`¿Eliminar "${deleteTarget?.name}"?`}
        message="El producto y todas sus imágenes, especificaciones y datos relacionados se eliminarán permanentemente."
        loading={deleting}
      />
    </div>
  );
}
