import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../components/ui/StatsCard.jsx';
import MiniChart, { BarChart } from '../components/ui/MiniChart.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import { getDashboardStats, getRecentActivity } from '../services/adminApi.js';
import { formatPrice, formatNumber, formatDate, timeAgo } from '../utils/formatters.js';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [s, a] = await Promise.all([
          getDashboardStats(),
          getRecentActivity(8),
        ]);
        setStats(s);
        setActivity(a);
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-32 skeleton-loader" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl h-64 skeleton-loader" />
          <div className="bg-white rounded-2xl h-64 skeleton-loader" />
        </div>
      </div>
    );
  }

  const s = stats || {};

  // Fake sparkline data for visual effect (since we don't have time-series data yet)
  const revenueData = [12, 19, 15, 25, 22, 30, s.totalRevenue / 100 || 28];
  const ordersData = [3, 5, 4, 7, 6, 8, s.totalOrders || 5];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-main">Bienvenido de vuelta 👋</h1>
          <p className="text-sm text-text-muted mt-1">Aquí tienes un resumen de tu tienda hoy.</p>
        </div>
        <p className="text-xs text-text-muted">{formatDate(new Date())}</p>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon="inventory_2"
          label="Total Productos"
          value={formatNumber(s.totalProducts)}
          color="primary"
          index={0}
        />
        <StatsCard
          icon="category"
          label="Categorías"
          value={formatNumber(s.totalCategories)}
          color="accent"
          index={1}
        />
        <StatsCard
          icon="shopping_bag"
          label="Pedidos"
          value={formatNumber(s.totalOrders)}
          color="success"
          index={2}
        />
        <StatsCard
          icon="payments"
          label="Ingresos"
          value={formatPrice(s.totalRevenue)}
          color="warning"
          index={3}
        />
      </div>

      {/* Charts + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-border-light p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-text-main">Resumen de ventas</h2>
            <span className="text-xs text-text-muted">Últimos 7 días</span>
          </div>
          <div className="flex items-end gap-8">
            <div>
              <p className="text-xs text-text-muted mb-1">Ingresos</p>
              <p className="text-xl font-bold text-text-main">{formatPrice(s.totalRevenue)}</p>
              <div className="mt-2">
                <MiniChart type="sparkline" data={revenueData} width={180} height={50} color="#c9a34f" />
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Pedidos</p>
              <p className="text-xl font-bold text-text-main">{s.totalOrders}</p>
              <div className="mt-2">
                <BarChart
                  data={ordersData}
                  width={160}
                  height={50}
                  color="#4B2E6F"
                  labels={['L','M','X','J','V','S','D']}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Low stock alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-border-light p-5"
        >
          <h2 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-warning text-lg">warning</span>
            Stock bajo
          </h2>
          <div className="space-y-2.5">
            {(s.lowStock || []).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <p className="text-xs text-text-main font-medium truncate flex-1 mr-2">{p.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  p.stock <= 3 ? 'bg-red-50 text-error' : 'bg-amber-50 text-amber-700'
                }`}>
                  {p.stock} uds
                </span>
              </div>
            ))}
            {(!s.lowStock || s.lowStock.length === 0) && (
              <p className="text-xs text-text-muted text-center py-3">Todo el stock está bien ✅</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-border-light overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-main">Pedidos recientes</h2>
          <a href="/admin/pedidos" className="text-xs text-primary font-bold hover:underline">Ver todos →</a>
        </div>
        {(s.recentOrders || []).length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-background-soft/40">
              <tr>
                <th className="px-5 py-2 text-left text-xs font-bold text-text-secondary">Pedido</th>
                <th className="px-5 py-2 text-left text-xs font-bold text-text-secondary hidden sm:table-cell">Cliente</th>
                <th className="px-5 py-2 text-right text-xs font-bold text-text-secondary">Total</th>
                <th className="px-5 py-2 text-center text-xs font-bold text-text-secondary">Estado</th>
                <th className="px-5 py-2 text-right text-xs font-bold text-text-secondary hidden sm:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {s.recentOrders.map(order => (
                <tr key={order.id} className="border-t border-border-light/50 hover:bg-primary/[0.02]">
                  <td className="px-5 py-3 font-mono text-xs text-text-main">#{order.id?.slice(0, 8)}</td>
                  <td className="px-5 py-3 text-text-secondary hidden sm:table-cell">{order.customer_name}</td>
                  <td className="px-5 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3 text-center"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-right text-text-muted hidden sm:table-cell">{timeAgo(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-5 py-8 text-center text-sm text-text-muted">
            <span className="material-symbols-outlined text-3xl text-text-muted/30 block mb-2">receipt_long</span>
            No hay pedidos recientes
          </div>
        )}
      </motion.div>

      {/* Activity log */}
      {activity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-border-light p-5"
        >
          <h2 className="text-sm font-bold text-text-main mb-3">Actividad reciente</h2>
          <div className="space-y-2">
            {activity.map(a => (
              <div key={a.id} className="flex items-center gap-3 text-xs">
                <span className={`material-symbols-outlined text-sm ${
                  a.action === 'create' ? 'text-success' : a.action === 'delete' ? 'text-error' : 'text-primary'
                }`}>
                  {a.action === 'create' ? 'add_circle' : a.action === 'delete' ? 'remove_circle' : 'edit'}
                </span>
                <span className="text-text-secondary flex-1">
                  {a.action === 'create' ? 'Creó' : a.action === 'delete' ? 'Eliminó' : 'Editó'}{' '}
                  <span className="font-medium text-text-main">{a.entity_type}</span>{' '}
                  {a.entity_id && <span className="text-text-muted">({a.entity_id})</span>}
                </span>
                <span className="text-text-muted">{timeAgo(a.created_at)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
