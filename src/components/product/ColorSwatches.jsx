import { getColorName } from '../../config/productSchema'

export default function ColorSwatches({ colors = [], activeIndex, onSelect }) {
  if (!colors.length) return null

  return (
    <div>
      <p className="text-sm text-text-muted mb-2">
        <span className="font-medium text-text-main">COLORES: </span>
        <span className="text-primary font-semibold">
          {getColorName(colors[activeIndex])}
        </span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {colors.map((hex, i) => (
          <button
            key={`${hex}-${i}`}
            onClick={() => onSelect(i)}
            title={getColorName(hex)}
            style={{ backgroundColor: hex }}
            className={`w-7 h-7 rounded-full border-2 transition-all
              ${i === activeIndex
                ? 'ring-2 ring-primary ring-offset-2 border-primary'
                : 'border-border-color hover:border-primary/60'}`}
          />
        ))}
      </div>
    </div>
  )
}
