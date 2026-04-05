import React from 'react';
import StatusBadge from '../ui/StatusBadge.jsx';
import { formatPrice, formatDate } from '../../utils/formatters.js';

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'shipped',   label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export default function OrderDetail({ order, onStatusChange, loading }) {
  if (!order) return null;

  const items = order.order_items || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-text-main">Pedido #{order.id?.slice(0, 8)}</h2>
          <p className="text-xs text-text-muted">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} size="md" />
          <select
            value={order.status}
            onChange={e => onStatusChange?.(e.target.value)}
            disabled={loading}
            className="text-xs border border-border-default rounded-lg px-2 py-1.5 bg-white"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-background-soft rounded-xl p-4 space-y-2">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Cliente</h3>
          <p className="text-sm font-medium text-text-main">{order.customer_name}</p>
          <p className="text-sm text-text-secondary">{order.customer_phone}</p>
        </div>
        <div className="bg-background-soft rounded-xl p-4 space-y-2">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Envío</h3>
          <p className="text-sm text-text-main">{order.department}, {order.city}</p>
          <p className="text-sm text-text-secondary">{order.address}</p>
          <p className="text-xs text-text-muted">Pago: {order.payment_method}</p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-text-main">Productos ({items.length})</h3>
        <div className="border border-border-light rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background-soft/50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-bold text-text-secondary">Producto</th>
                <th className="px-4 py-2 text-center text-xs font-bold text-text-secondary">Cant.</th>
                <th className="px-4 py-2 text-right text-xs font-bold text-text-secondary">Precio Unit.</th>
                <th className="px-4 py-2 text-right text-xs font-bold text-text-secondary">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t border-border-light/50">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-text-main">{item.products?.name || item.product_id}</p>
                    {item.variant && <p className="text-xs text-text-muted">Variante: {item.variant}</p>}
                  </td>
                  <td className="px-4 py-2.5 text-center">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-right">{formatPrice(item.unit_price)}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{formatPrice(item.unit_price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Envío</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-text-main text-base pt-2 border-t border-border-light">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
