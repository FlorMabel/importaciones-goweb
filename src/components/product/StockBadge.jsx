export default function StockBadge({ stock }) {
  if (stock > 10) return (
    <div className="flex items-center gap-2 group">
      <div className="relative">
        <span className="flex size-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="absolute inset-0 size-2 bg-green-500 rounded-full blur-[2px] opacity-50"></span>
      </div>
      <p className="text-green-600 text-[11px] font-bold uppercase tracking-widest">En Stock — Envío Inmediato</p>
    </div>
  )
  if (stock > 0) return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="flex size-2 bg-amber-500 rounded-full"></span>
        <span className="absolute inset-0 size-2 bg-amber-500 rounded-full blur-[2px] opacity-50"></span>
      </div>
      <p className="text-amber-600 text-[11px] font-bold uppercase tracking-widest">
        ¡Urgente! — Solo {stock} disponibles
      </p>
    </div>
  )
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="flex size-2 bg-primary rounded-full animate-bounce"></span>
        <span className="absolute inset-0 size-2 bg-primary rounded-full blur-[2px] opacity-50"></span>
      </div>
      <p className="text-primary text-[11px] font-black uppercase tracking-[0.2em]">
        Pre-orden — Importación en camino
      </p>
    </div>
  )
}
