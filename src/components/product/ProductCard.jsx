import { useProductGallery } from '../../hooks/useProductGallery'
import ProductGallery from './ProductGallery'
import WholesalePricing from './WholesalePricing'
import ColorSwatches from './ColorSwatches'
import SpecsTable from './SpecsTable'
import StockBadge from './StockBadge'
import QuantitySelector from './QuantitySelector'
import VariantSelector from './VariantSelector'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProductCard({ product }) {
  const { activeIndex, selectVariant, selectColor } =
    useProductGallery(product.images, product.colors)

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.length > 0 ? product.variants[0] : null
  )

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant)
    // Synchronize gallery if variants match images in sequence
    // (Excluding index 0 which is usually the main cover)
    if (product.variants?.length > 0) {
      const idx = product.variants.findIndex(v => v.name === variant.name)
      if (idx !== -1 && idx + 1 < product.images?.length) {
        selectVariant(idx + 1)
      }
    }
  }

  const [showStickyBar, setShowStickyBar] = useState(false)

  // Update selected variant if activeIndex changes from external (color/thumb)
  useEffect(() => {
    if (product.variants?.length > 0 && activeIndex > 0 && activeIndex <= product.variants.length) {
      setSelectedVariant(product.variants[activeIndex - 1])
    }
  }, [activeIndex, product.variants])

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past the main buy button (approx 600-800px)
      setShowStickyBar(window.scrollY > 700)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const displayOldPrice = selectedVariant ? selectedVariant.oldPrice : product.oldPrice

  return (
    <>
      <nav className="text-sm text-text-muted mb-6 flex items-center gap-1.5">
        <span className="hover:text-primary cursor-pointer transition-colors">Inicio</span>
        <span>›</span>
        <span className="hover:text-primary cursor-pointer transition-colors capitalize">
          {product.category}
        </span>
        <span>›</span>
        <span className="text-text-main">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20">

        <ProductGallery
          images={product.images}
          activeIndex={activeIndex}
          onSelect={selectVariant}
          badge={product.badge}
          isNew={product.isNew}
        />

        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <p className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-3">
              <span className="w-10 h-[1px] bg-primary"></span>
              {product.category}
            </p>

            <h1 className="font-serif text-2xl md:text-5xl font-bold text-accent leading-none italic">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 border-b border-border-light pb-6">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={`material-symbols-outlined text-sm ${i < Math.round(product.rating) ? 'fill-1' : ''}`}>
                    star
                  </span>
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                {product.reviews} Reseñas Verificadas
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl md:text-4xl font-bold text-accent">
                S/ {Number(displayPrice || 0).toFixed(2)}
              </span>
              {displayOldPrice && (
                <span className="text-lg text-text-muted line-through opacity-50 font-light">
                  S/ {Number(displayOldPrice).toFixed(2)}
                </span>
              )}
            </div>
            {product.isOnSale && displayOldPrice && (
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                Ahorra S/ {Number(displayOldPrice - displayPrice).toFixed(2)} hoy
              </p>
            )}
          </div>

          <div className="bg-beige-soft/50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-border-light border-dashed">
            <p className="text-sm text-text-secondary leading-relaxed font-light italic">
              "{product.description}"
            </p>
          </div>

          <WholesalePricing price={product.price} customTiers={product.wholesaleTiers} />
          
          <div className="space-y-6">
            {product.images?.length > 1 && (
              <ColorSwatches
                colors={product.colors}
                activeIndex={activeIndex}
                onSelectColor={selectColor}
              />
            )}
            
            <VariantSelector 
              variants={product.variants} 
              selectedVariant={selectedVariant}
              onSelect={handleSelectVariant}
            />

            <div className="pt-4 border-t border-border-light">
              <StockBadge stock={product.stock} />
              <QuantitySelector product={product} selectedVariant={selectedVariant} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Buy Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-border-light p-4 shadow-strong lg:hidden flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-12 rounded-xl bg-beige-light border border-border-light overflow-hidden p-1 shrink-0">
                <img src={product.images?.[0]} className="w-full h-full object-contain mix-blend-multiply" alt="" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold truncate">{product.name}</p>
                <p className="text-sm font-bold text-accent">S/ {Number(displayPrice || 0).toFixed(2)}</p>
              </div>
            </div>
            <button
               onClick={() => {
                 document.getElementById('quantity-selector')?.scrollIntoView({ behavior: 'smooth' });
               }}
               className="flex-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl shadow-glow"
            >
              Comprar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
