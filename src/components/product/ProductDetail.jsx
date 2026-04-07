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
          <div className="relative">
            <ProductGallery
              images={product.images}
              activeIndex={activeIndex}
              onSelect={selectVariant}
              badge={product.badge}
              isNew={product.isNew}
            />
            <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-border-light shadow-soft pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Desliza para zoom</span>
            </div>
          </div>
          
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
                 {product.sku && (
                   <span className="text-[9px] font-bold text-apple-gray/40 uppercase tracking-[0.2em] ml-auto">
                     SKU: {product.sku}
                   </span>
                 )}
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

            {/* Import & Guarantee Info */}
            <div className="mt-12 p-8 bg-beige-soft/30 rounded-[2.5rem] border border-border-light/40 space-y-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                <div>
                  <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Logística de Importación</h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">
                    Producto importado directamente. Tiempo estimado de entrega: <span className="font-bold text-accent">7 a 15 días hábiles</span> a todo el Perú.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                <div>
                  <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Garantía Go Shopping</h4>
                  <p className="text-sm text-text-muted font-light leading-relaxed">
                    Todos nuestros productos cuentan con <span className="font-bold text-accent">6 meses de garantía</span> de fábrica y soporte técnico especializado.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Contextual CTA */}
            <div className="mt-8">
              <a 
                href={`https://wa.me/51962810439?text=${encodeURIComponent(`¡Hola! Quisiera más información sobre: ${product.name} (S/ ${Number(displayPrice).toFixed(2)})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-glow hover:scale-[1.02] active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Asesoría WhatsApp Premium
              </a>
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
