/**
 * Formatea un precio en soles peruanos
 * formatPrice(29.9) → "S/ 29.90"
 */
export function formatPrice(amount) {
  if (amount == null || isNaN(amount)) return 'S/ 0.00';
  return `S/ ${Number(amount).toFixed(2)}`;
}

/**
 * Formatea una fecha a formato legible en español
 * formatDate('2026-04-04') → "04 Abr 2026"
 */
const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Formatea una fecha a formato relativo
 * timeAgo(new Date(Date.now() - 3600000)) → "hace 1 hora"
 */
export function timeAgo(date) {
  if (!date) return '';
  const now = Date.now();
  const d = new Date(date).getTime();
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return 'hace unos segundos';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return `hace ${h} hora${h > 1 ? 's' : ''}`;
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `hace ${days} día${days > 1 ? 's' : ''}`;
  }
  return formatDate(date);
}

/**
 * Formatea un número grande con separadores
 * formatNumber(12500) → "12,500"
 */
export function formatNumber(n) {
  if (n == null) return '0';
  return Number(n).toLocaleString('es-PE');
}

/**
 * Trunca texto a cierta longitud con ellipsis
 */
export function truncate(text, max = 50) {
  if (!text || text.length <= max) return text || '';
  return text.slice(0, max) + '…';
}

/**
 * Capitaliza la primera letra
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Formatea un status para display
 */
const STATUS_LABELS = {
  active: 'Activo',
  inactive: 'Inactivo',
  draft: 'Borrador',
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export function formatStatus(status) {
  return STATUS_LABELS[status] || capitalize(status);
}
