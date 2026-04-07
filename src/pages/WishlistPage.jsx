import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { getProductsByIds } from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonProduct from '../components/skeletons/SkeletonProduct';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (wishlist.length > 0) {
      setLoading(true);
      getProductsByIds(wishlist)
        .then(setProducts)
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [wishlist]);

  return (
    <div className="bg-white min-h-screen">
      <Helmet><title>Favoritos | GO SHOPPING</title></Helmet>
      
      <div className="max-w-[1440px] mx-auto px-4 lg:px-20 py-12 md:py-24">
        <div className="mb-16">
          <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-1 block">Tus piezas</span>
          <h1 className="text-3xl md:text-6xl font-serif font-bold text-accent italic">Favoritos</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonProduct key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center bg-beige-soft/30 rounded-[3rem] border border-dashed border-border-light"
          >
            <span className="material-symbols-outlined text-6xl text-text-muted/20 mb-6 italic">favorite</span>
            <h3 className="text-2xl font-bold text-accent mb-3">No tienes favoritos aún</h3>
            <p className="text-sm text-text-muted font-light mb-10 max-w-md mx-auto italic">
              "Guarda las piezas que más te gusten para tenerlas siempre a la mano."
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-10 py-5 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary shadow-glow transition-all active:scale-95"
            >
              Explorar Colecciones
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            <AnimatePresence>
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProductCard product={p} index={i % 4} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
