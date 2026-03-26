import { getColorName } from '../../config/productSchema'

export default function ColorSwatches({ colors = [], activeIndex, onSelectColor }) {
  if (!colors || colors.length === 0) return null

  // activeIndex 0 means reference image is selected (no color)
  const selectedColorIndex = activeIndex - 1;
  const activeHex = selectedColorIndex >= 0 ? colors[selectedColorIndex] : null;

  return (
    <div>
      <p className="text-sm text-text-muted mb-2">
        <span className="font-medium text-text-main">COLORES: </span>
        <span className="text-primary font-semibold">
          {activeHex ? getColorName(activeHex) : 'Variantes Disponibles'}
        </span>
      </p>
      <div className="flex gap-2 flex-wrap">
        {colors.map((hex, i) => (
          <button
            key={`${hex}-${i}`}
            onClick={() => onSelectColor(i)}
            title={getColorName(hex)}
            style={{ backgroundColor: hex }}
            className={`w-7 h-7 rounded-full border-2 transition-all
              ${i === selectedColorIndex
                ? 'ring-2 ring-primary ring-offset-2 border-primary'
                : 'border-border-color hover:border-primary/60'}`}
          />
        ))}
      </div>
    </div>
  )
}
