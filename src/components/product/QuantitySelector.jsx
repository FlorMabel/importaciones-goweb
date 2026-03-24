import { useState } from 'react'
import { useStore } from '../../context/StoreContext'

export default function QuantitySelector({ product }) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useStore()

  const dec = () => setQuantity(q => Math.max(1, q - 1))
  const inc = () => setQuantity(q => Math.min(product.stock, q + 1))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-muted font-medium">Cantidad</span>
        <div className="flex items-center border border-border-color rounded-lg overflow-hidden">
          <button
            onClick={dec}
            className="w-10 h-10 flex items-center justify-center
                       text-text-main hover:bg-background-soft
                       transition-colors text-lg font-light"
          >−</button>
          <span className="w-12 text-center text-text-main font-medium text-sm">
            {quantity}
          </span>
          <button
            onClick={inc}
            disabled={quantity >= product.stock}
            className="w-10 h-10 flex items-center justify-center
                       text-text-main hover:bg-background-soft
                       transition-colors text-lg font-light
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >+</button>
        </div>
      </div>

      <button
        onClick={() => addToCart(product, quantity)}
        disabled={product.stock === 0}
        className="w-full bg-primary hover:bg-primary-dark text-white
                   font-semibold py-3 px-6 rounded-xl transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   animate-fade-in"
      >
        AGREGAR AL CARRITO
      </button>

      <button
        className="w-full border-2 border-accent text-accent
                   hover:bg-accent hover:text-white font-semibold
                   py-3 px-6 rounded-xl transition-colors"
      >
        COMPRAR AHORA
      </button>
    </div>
  )
}
