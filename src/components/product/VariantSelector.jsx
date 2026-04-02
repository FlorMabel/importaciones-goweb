import React from 'react'

export default function VariantSelector({ 
  variants, 
  selectedVariant, 
  onSelect 
}) {
  if (!variants || variants.length === 0) return null

  return (
    <div className="flex flex-col gap-3 my-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-text-main uppercase tracking-wider">
          Seleccionar Talla
        </span>
        {selectedVariant && (
          <span className="text-xs text-text-muted font-medium">
            Seleccionado: {selectedVariant.name}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, idx) => {
          const isSelected = selectedVariant?.name === variant.name
          
          return (
            <button
              key={idx}
              onClick={() => onSelect(variant)}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                border-2 flex flex-col items-center min-w-[80px]
                ${isSelected 
                  ? 'border-accent bg-accent/5 text-accent shadow-md scale-105' 
                  : 'border-border-color bg-white text-text-main hover:border-accent/40 hover:bg-background-soft'
                }
              `}
            >
              <span>{variant.name}</span>
              <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-accent' : 'text-text-muted'}`}>
                S/ {variant.price}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
