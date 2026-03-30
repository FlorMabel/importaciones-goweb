import { getColorName } from '../../config/productSchema'

export default function ColorSwatches({ colors = [], activeIndex, onSelectColor }) {
  if (!colors || colors.length === 0) return null

  // activeIndex 0 means reference image is selected (no color)
  const selectedColorIndex = activeIndex - 1;
  const activeHex = selectedColorIndex >= 0 ? colors[selectedColorIndex] : null;

  return (
    <div>
      <p className="text-sm text-text-muted mb-3 flex items-center gap-2">
        <span className="font-medium text-text-main">MODELO:</span>
        <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
          {activeHex ? (getColorName(activeHex).includes('#') ? 'Personalizar' : getColorName(activeHex)) : 'Variante'}
        </span>
      </p>
      <div className="flex gap-2.5 flex-wrap">
        {colors.map((hex, i) => {
          const colorName = getColorName(hex.trim());
          const isHex = colorName.startsWith('#');
          
          return (
            <button
              key={`${hex}-${i}`}
              onClick={() => onSelectColor(i)}
              title={isHex ? 'Opción disponible' : colorName}
              style={{ backgroundColor: hex.trim() }}
            className={`w-7 h-7 rounded-full border-2 transition-all
              ${i === selectedColorIndex
                ? 'ring-2 ring-primary ring-offset-2 border-primary'
                : 'border-border-color hover:border-primary/60'}`}
            />
          )
        })}
      </div>
    </div>
  )
}
