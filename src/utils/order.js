/**
 * Formats an order object into the human-friendly ID: GS-YYMMDD-XXXXX
 * @param {Object} order - The order object from database
 * @returns {string} - Formatted ID (e.g. GS-260409-00100)
 */
export function formatOrderNumber(order) {
  if (!order || !order.order_serial) {
    // Fallback for old orders or if serial is missing
    return order?.id ? `ORDER-${order.id.split('-')[0]}` : 'PENDIENTE';
  }
  
  const date = new Date(order.created_at);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const serial = String(order.order_serial).padStart(4, '0');
  
  return `Orden GS-${yy}${mm}${dd}-${serial}`;
}
