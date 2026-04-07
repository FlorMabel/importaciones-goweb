import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getOptimizedImage } from '../utils';
import { getProductById } from '../services/api';

export default function ProductCard({ product, index, darkTheme = false }) {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const { showToast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayOldPrice = selectedVariant ? selectedVariant.oldPrice : product.oldPrice;

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1, selectedVariant?.name);
    showToast(`${product.name} añadido al carrito`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`group relative rounded-[2rem] md:rounded-[2.5rem] border overflow-hidden hover:shadow-strong transition-all duration-700 h-full flex flex-col active:scale-[0.98] ${
        darkTheme 
          ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
          : 'bg-white border-border-light/60 text-text-main hover:shadow-strong'
      }`}
    >
      {/* Image Section */}
      <div 
        className={`relative aspect-[4/5] overflow-hidden cursor-pointer p-3 md:p-6 transition-colors duration-700 ${
          darkTheme ? 'bg-white/[0.03]' : 'bg-beige-light'
        }`}
        onClick={() => navigate(`/producto/${product.slug}`)}
      >
        <img
          src={getOptimizedImage(product.images?.[0], 300) || 'https://placehold.co/400x500'}
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-1000 ease-out ${
            darkTheme ? 'brightness-110' : ''
          }`}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.badge && (
            <span className="bg-accent text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-soft">
              {product.badge}
            </span>
          )}
          {product.isOnSale && (
             <span className="bg-red-600 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-soft">
               {product.salePercent}% OFF
             </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 size-12 md:size-14 rounded-full bg-white/90 backdrop-blur-md shadow-strong flex items-center justify-center text-accent opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white active:scale-90 z-10"
          aria-label="Añadir rápido"
        >
          <span className="material-symbols-outlined text-xl md:text-2xl italic">add_shopping_cart</span>
        </button>
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-6 flex flex-col flex-1">
        <div className="flex-1">
          <p className={`text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold italic ${
            darkTheme ? 'text-white/40' : 'text-text-muted/60'
          }`}>
            {product.category}
          </p>
          <h3 
            className={`text-sm md:text-lg font-bold group-hover:text-primary transition-colors cursor-pointer mb-3 line-clamp-1 md:line-clamp-2 leading-tight tracking-tight ${
              darkTheme ? 'text-white' : 'text-text-main'
            }`}
            onClick={() => navigate(`/producto/${product.slug}`)}
          >
            {product.name}
          </h3>
          
          {/* Variant Dots (Peek) */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-1.5 mb-4 items-center">
              {product.variants.slice(0, 4).map((v) => (
                <button
                  key={v.name}
                  onClick={(e) => { e.stopPropagation(); handleSelectVariant(v); }}
                  className={`size-2.5 rounded-full border transition-all ${
                    selectedVariant?.name === v.name 
                      ? 'border-primary ring-1 ring-primary ring-offset-1 scale-110' 
                      : darkTheme 
                        ? 'border-white/20 bg-white/5' 
                        : 'border-border-default bg-beige-soft hov:bg-border-light'
                  }`}
                  title={v.name}
                />
              ))}
              {product.variants.length > 4 && <span className="text-[9px] text-text-muted font-bold ml-1">+{product.variants.length - 4}</span>}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className={`flex items-center justify-between mt-auto pt-4 border-t ${
          darkTheme ? 'border-white/10' : 'border-border-light/50'
        }`}>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg md:text-2xl font-bold tracking-tighter ${
              darkTheme ? 'text-primary' : 'text-accent'
            }`}>
              {formatPrice(displayPrice)}
            </span>
            {displayOldPrice && (
              <span className={`text-xs md:text-sm line-through font-light ${
                darkTheme ? 'text-white/20' : 'text-text-muted/40'
              }`}>
                {formatPrice(displayOldPrice)}
              </span>
            )}
          </div>
          
          <button 
            onClick={() => navigate(`/producto/${product.slug}`)}
            className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline underline-offset-4"
          >
            Detalles
          </button>
        </div>
      </div>
    </motion.div>
  );
}
