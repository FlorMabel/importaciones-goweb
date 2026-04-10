import React, { useState, useEffect, useCallback } from 'react';
import DataTable from '../components/ui/DataTable.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import SearchBar from '../components/ui/SearchBar.jsx';
import Modal from '../components/ui/Modal.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import OrderDetail from '../components/forms/OrderDetail.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import * as adminApi from '../services/adminApi.js';
import { formatPrice, timeAgo } from '../utils/formatters.js';
import { formatOrderNumber } from '../../utils/order.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function OrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const debouncedSearch = useDebounce(search);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getOrders({
        page, perPage: 20, sortBy, sortDir,
        search: debouncedSearch,
        filters: statusFilter ? { status: statusFilter } : {},
      });
      setOrders(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (e) {
      showToast('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortDir, debouncedSearch, statusFilter, showToast]);

  useEffect(() => { loadOrders(); }, [loadOrders]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);

  const handleViewOrder = async (order) => {
    setLoadingDetail(true);
    setDetailOpen(true);
    try {
      const full = await adminApi.getOrder(order.id);
      setSelectedOrder(full);
    } catch (e) {
      showToast('Error al cargar pedido', 'error');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      await adminApi.updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      showToast('Estado actualizado', 'success');
      loadOrders();
    } catch (e) {
      showToast('Error al actualizar estado', 'error');
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Pedido',
      render: (_, row) => <span className="font-mono text-xs font-bold text-accent">{formatOrderNumber(row)}</span>,
    },
    {
      key: 'customer_name',
      label: 'Cliente',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="text-sm font-medium text-text-main">{val}</p>
          <p className="text-xs text-text-muted">{row.customer_phone}</p>
        </div>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      align: 'right',
      render: (val) => <span className="font-bold text-primary">{formatPrice(val)}</span>,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'created_at',
      label: 'Fecha',
      sortable: true,
      render: (val) => <span className="text-xs text-text-muted">{timeAgo(val)}</span>,
    },
  ];

  const actions = [
    { icon: 'visibility', label: 'Ver detalle', onClick: handleViewOrder },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-main">Pedidos</h1>
          <p className="text-xs text-text-muted">{total} pedidos en total</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por cliente o teléfono..." className="w-full sm:w-64" />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border-default px-3 py-2.5 text-sm bg-white focus:border-primary outline-none"
        >
          <option value="">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={(k, d) => { setSortBy(k); setSortDir(d); }}
        actions={actions}
        onRowClick={handleViewOrder}
        emptyIcon="receipt_long"
        emptyTitle="No hay pedidos"
        emptyDescription="Los pedidos de la tienda aparecerán aquí."
      />

      <Pagination page={page} totalPages={totalPages} total={total} perPage={20} onPageChange={setPage} />

      {/* Order detail modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Detalle del pedido" size="lg">
        {loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <OrderDetail order={selectedOrder} onStatusChange={handleStatusChange} />
        )}
      </Modal>
    </div>
  );
}
