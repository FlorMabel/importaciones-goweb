import { useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../context/ToastContext'

export default function QuantitySelector({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [fragQtys, setFragQtys] = useState({})
  const { addToCart } = useStore()
  const { showToast } = useToast()

  const fragrancesList = product.fragrances || product.fragance || []
  const hasFragrances = fragrancesList.length > 0

  const dec = () => setQuantity(q => Math.max(1, q - 1))
  const inc = () => setQuantity(q => Math.min(product.stock, q + 1))

  const updateFragQty = (fragName, delta) => {
    setFragQtys(prev => ({
      ...prev,
      [fragName]: Math.max(0, (prev[fragName] || 0) + delta),
    }))
  }

  const handleAddFragrances = () => {
    let added = false
    Object.entries(fragQtys).forEach(([fragName, qty]) => {
      if (qty > 0) {
        addToCart(product, qty, fragName)
        added = true
      }
    })
    
    if (added) {
      showToast('¡Selecciones agregadas al carrito!')
      setFragQtys({}) // Reset after adding
    } else {
      showToast('Selecciona al menos un aroma', 'warning')
    }
  }

  if (hasFragrances) {
    const totalSelected = Object.values(fragQtys).reduce((a, b) => a + b, 0)
    
    return (
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent text-xl material-symbols-outlined">local_florist</span>
          <h3 className="font-bold text-text-main text-sm">Elige tus Esencias</h3>
        </div>
        
        <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-color scrollbar-track-transparent">
          {fragrancesList.map((frag, idx) => {
            const qty = fragQtys[frag.name] || 0
            return (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-primary/30 transition-colors">
                <div className="flex-1 pr-4">
                  <h4 className="font-bold text-text-main text-sm">{frag.name}</h4>
                  {frag.description && (
                    <p className="text-text-muted text-xs mt-1 leading-snug">{frag.description}</p>
                  )}
                </div>
                <div className="flex items-center border border-border-color rounded-full overflow-hidden shrink-0 bg-white">
                  <button
                    onClick={() => updateFragQty(frag.name, -1)}
                    className="w-8 h-8 flex items-center justify-center text-text-main hover:bg-background-soft transition-colors font-light"
                  >−</button>
                  <span className="w-8 text-center text-text-main font-bold text-xs">{qty}</span>
                  <button
                    onClick={() => updateFragQty(frag.name, 1)}
                    className="w-8 h-8 flex items-center justify-center text-text-main hover:bg-background-soft transition-colors font-light"
                  >+</button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAddFragrances}
            disabled={totalSelected === 0}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
            Agregar seleccionados {totalSelected > 0 && `(${totalSelected})`}
          </button>
          <button className="w-14 h-14 shrink-0 flex items-center justify-center border border-border-color rounded-xl hover:border-accent hover:text-accent transition-colors bg-white shadow-sm">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-muted font-medium">Cantidad</span>
        <div className="flex items-center border border-border-color rounded-lg overflow-hidden">
          <button
            onClick={dec}
            className="w-10 h-10 flex items-center justify-center text-text-main hover:bg-background-soft transition-colors text-lg font-light"
          >−</button>
          <span className="w-12 text-center text-text-main font-medium text-sm">{quantity}</span>
          <button
            onClick={inc}
            disabled={quantity >= product.stock}
            className="w-10 h-10 flex items-center justify-center text-text-main hover:bg-background-soft transition-colors text-lg font-light disabled:opacity-40 disabled:cursor-not-allowed"
          >+</button>
        </div>
      </div>

      <button
        onClick={() => addToCart(product, quantity)}
        disabled={product.stock === 0}
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
      >
        AGREGAR AL CARRITO
      </button>

      <button className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold py-3 px-6 rounded-xl transition-colors">
        COMPRAR AHORA
      </button>
    </div>
  )
}
