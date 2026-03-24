export default function StockBadge({ stock }) {
  if (stock > 5) return (
    <p className="text-green-600 text-sm font-medium flex items-center gap-1.5">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      En stock — Envío inmediato
    </p>
  )
  if (stock > 0) return (
    <p className="text-amber-600 text-sm font-medium flex items-center gap-1.5">
      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
      Últimas {stock} unidades
    </p>
  )
  return (
    <p className="text-red-600 text-sm font-medium flex items-center gap-1.5">
      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      Agotado
    </p>
  )
}
