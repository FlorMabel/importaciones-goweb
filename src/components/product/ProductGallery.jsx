import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductGallery({ images = [], activeIndex = 0, onSelect, badge, isNew }) {
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  if (!images || images.length === 0) return null;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image Viewport */}
      <div 
        className="relative aspect-square bg-beige-light rounded-2xl md:rounded-[3rem] overflow-hidden border border-border-light group cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className={`w-full h-full object-contain mix-blend-multiply p-2 md:p-4 transition-transform duration-200 ${isZooming ? 'scale-[2.5] md:scale-[3]' : 'scale-100'}`}
            style={isZooming ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            alt="Vista de producto"
          />
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2 pointer-events-none">
          {badge && (
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-accent text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-glow"
            >
              {badge}
            </motion.span>
          )}
          {isNew && (
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-primary text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-glow"
            >
              Nuevo Ingreso
            </motion.span>
          )}
        </div>
      </div>

      {/* Thumbnails Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 px-1 md:px-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`relative aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white p-1.5 md:p-2 ${activeIndex === idx ? 'border-primary ring-2 md:ring-4 ring-primary/10 shadow-medium' : 'border-border-light hover:border-border-strong opacity-70 hover:opacity-100'}`}
            >
              <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt={`Vista ${idx + 1}`} />
              <div className={`absolute inset-0 bg-primary/10 transition-opacity ${activeIndex === idx ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
