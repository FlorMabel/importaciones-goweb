export default function SpecsTable({ specs = [] }) {
  if (!specs.length) return null

  return (
    <div className="bg-background-soft border border-border-color rounded-xl overflow-hidden">
      <p className="text-text-main font-semibold text-sm px-4 py-3 border-b border-border-color">
        Especificaciones
      </p>
      <div className="divide-y divide-border-color/50">
        {specs.map((spec, i) => (
          <div key={i} className="flex justify-between px-4 py-2.5">
            <span className="text-text-muted text-sm">{spec.label}</span>
            <span className="text-text-main text-sm font-medium">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
