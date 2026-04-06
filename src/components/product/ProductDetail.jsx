import { Link } from 'react-router-dom'
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
    if (product.variants?.length > 0) {
      const idx = product.variants.findIndex(v => v.name === variant.name)
      if (idx !== -1 && idx + 1 < product.images?.length) {
        selectVariant(idx + 1)
      }
    }
  }

  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    if (product.variants?.length > 0 && activeIndex > 0 && activeIndex <= product.variants.length) {
      setSelectedVariant(product.variants[activeIndex - 1])
    }
  }, [activeIndex, product.variants])

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 800)
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  const displayPrice = selectedVariant ? selectedVariant.price : product.price
  const displayOldPrice = selectedVariant ? selectedVariant.oldPrice : product.oldPrice

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 py-10">
      {/* 🧭 Dynamic Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-apple-gray mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Link to="/" className="hover:text-apple-black transition-colors">Inicio</Link>
        <span>/</span>
        <Link to={`/categoria/${product.category}`} className="hover:text-apple-black transition-colors">{product.category}</Link>
        <span>/</span>
        <span className="text-apple-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-24">
        
        {/* 🖼️ Left: High-Impact Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <ProductGallery
            images={product.images}
            activeIndex={activeIndex}
            onSelect={selectVariant}
            badge={product.badge}
            isNew={product.isNew}
          />
          
          {/* Detailed Specs Desktop Overlay */}
          <div className="hidden lg:block pt-12 border-t border-apple-silver/50">
             <SpecsTable specs={product.specs} />
          </div>
        </div>

        {/* 📝 Right: Minimalist Info */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-apple-blue uppercase tracking-[0.3em] mb-4">
                {product.isNew ? 'Novedad' : 'Selección Premium'}
              </p>
              <h1 className="text-fluid-2xl font-bold tracking-tighter text-apple-black leading-none mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                 {Array.from({ length: 5 }, (_, i) => (
                   <span key={i} className={`material-symbols-outlined text-sm ${i < Math.round(product.rating) ? 'text-[#FFD700]' : 'text-apple-silver'}`}>
                     star
                   </span>
                 ))}
                 <span className="text-[10px] font-medium text-apple-gray uppercase tracking-widest ml-1">
                   {product.reviews} Reseñas
                 </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-fluid-lg font-bold text-apple-black">
                S/ {Number(displayPrice || 0).toFixed(2)}
              </span>
              {displayOldPrice && (
                <span className="text-lg text-apple-gray line-through font-light decoration-red-500/30">
                  S/ {Number(displayOldPrice).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-apple-gray leading-relaxed font-normal py-4 border-y border-apple-silver/30">
              {product.description}
            </p>

            <WholesalePricing price={product.price} customTiers={product.wholesaleTiers} />

            <div className="space-y-8 pt-4">
              <VariantSelector 
                variants={product.variants} 
                selectedVariant={selectedVariant}
                onSelect={handleSelectVariant}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <p className="text-[10px] font-bold text-apple-gray uppercase tracking-widest px-1">Cantidad</p>
                   <QuantitySelector product={product} selectedVariant={selectedVariant} />
                 </div>
                 <div className="flex flex-col justify-end">
                    <StockBadge stock={product.stock} />
                 </div>
              </div>
            </div>

            {/* Mobile Specs (Moved down) */}
            <div className="lg:hidden pt-8 mt-8 border-t border-apple-silver/50">
               <SpecsTable specs={product.specs} />
            </div>
          </div>
        </div>
      </div>

      {/* 🛒 Sticky Action Bar (Apple Style) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[60] glass-apple border-t border-apple-silver/50 p-4 shadow-apple-hover flex items-center justify-center"
          >
            <div className="max-w-7xl w-full flex items-center justify-between gap-6 px-4 md:px-10">
              <div className="hidden sm:flex items-center gap-4">
                <div className="size-12 bg-white rounded-xl overflow-hidden p-1 border border-apple-silver/30 shrink-0">
                  <img src={product.images?.[0]} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-apple-black uppercase truncate max-w-[150px]">{product.name}</p>
                  <p className="text-sm font-bold text-apple-black leading-none mt-1">S/ {Number(displayPrice || 0).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex-1 max-w-sm">
                <button
                  onClick={() => {
                    const el = document.getElementById('quantity-selector-trigger');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="w-full btn-apple-primary text-xs uppercase tracking-[0.2em] py-3.5"
                >
                  Continuar Compra
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
