import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../context/StoreContext'
import { useToast } from '../../context/ToastContext'

export default function QuantitySelector({ product, selectedVariant }) {
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
      showToast('¡Selecciones de lujo añadidas al carrito!')
      setFragQtys({}) // Reset after adding
    } else {
      showToast('Por favor, selecciona un aroma para continuar', 'warning')
    }
  }

  if (hasFragrances) {
    const totalSelected = Object.values(fragQtys).reduce((a, b) => a + b, 0)
    
    return (
      <div id="quantity-selector" className="flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent text-xl material-symbols-outlined">local_florist</span>
          <h3 className="font-bold text-text-main text-sm">Elige tus Esencias</h3>
        </div>
        
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {fragrancesList.map((frag, idx) => {
            const qty = fragQtys[frag.name] || 0
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${qty > 0 ? 'border-primary bg-white shadow-medium' : 'border-border-light bg-beige-light hover:border-border-strong'}`}
              >
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold text-sm ${qty > 0 ? 'text-primary' : 'text-text-main'}`}>{frag.name}</h4>
                    {qty > 0 && <span className="size-1.5 bg-primary rounded-full animate-pulse"></span>}
                  </div>
                  {frag.description && (
                    <p className="text-text-muted text-[11px] leading-relaxed italic">{frag.description}</p>
                  )}
                </div>
                <div className="flex items-center border border-border-default rounded-xl overflow-hidden shrink-0 bg-white shadow-soft">
                  <button
                    onClick={() => updateFragQty(frag.name, -1)}
                    className="size-9 flex items-center justify-center text-text-main hover:bg-beige-soft transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className={`w-8 text-center font-bold text-xs ${qty > 0 ? 'text-primary' : 'text-text-main'}`}>{qty}</span>
                  <button
                    onClick={() => updateFragQty(frag.name, 1)}
                    className="size-9 flex items-center justify-center text-text-main hover:bg-beige-soft transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </motion.div>
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
    <>
      <div id="quantity-selector" className="flex items-center gap-4 py-4 px-5 bg-beige-light rounded-2xl border border-border-light">
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">Cantidad</span>
        <div className="flex items-center border border-border-default rounded-xl overflow-hidden bg-white shadow-soft">
          <button
            onClick={dec}
            className="size-11 flex items-center justify-center text-text-main hover:bg-beige-soft transition-colors"
          >
            <span className="material-symbols-outlined text-sm">remove</span>
          </button>
          <span className="w-10 text-center text-text-main font-bold text-sm">{quantity}</span>
          <button
            onClick={inc}
            disabled={quantity >= product.stock}
            className="size-11 flex items-center justify-center text-text-main hover:bg-beige-soft transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={() => addToCart(product, quantity, selectedVariant?.name)}
          disabled={product.stock === 0}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 px-8 rounded-2xl transition-all shadow-glow flex items-center justify-center gap-3 group"
        >
          <span className="material-symbols-outlined text-xl italic">add_shopping_cart</span>
          <span>Añadir al Carrito</span>
          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <button className="w-full py-5 px-8 rounded-2xl border-2 border-accent text-accent hover:bg-accent hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-3">
          Comprar Ahora
        </button>
      </div>
    </>
  )
}
