import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useStore();
  const navigate = useNavigate();
  const total = getCartTotal();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-strong flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-light flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-accent italic">Tu Selección</h2>
                <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">
                  {cart.length} {cart.length === 1 ? 'Artículo' : 'Artículos'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="size-10 rounded-full hover:bg-beige-soft flex items-center justify-center text-text-muted transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <div className="size-20 rounded-full bg-beige-soft flex items-center justify-center text-text-muted/30 mb-6">
                    <span className="material-symbols-outlined text-4xl italic">shopping_bag</span>
                  </div>
                  <h3 className="font-bold text-accent mb-2">Tu carrito está vacío</h3>
                  <p className="text-sm text-text-muted mb-8 italic">"La elegancia comienza con una elección. Descubre nuestras colecciones."</p>
                  <button 
                    onClick={() => { onClose(); navigate('/'); }}
                    className="w-full py-4 rounded-xl bg-accent text-white text-xs font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors"
                  >
                    Explorar Tienda
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`${item.id}-${item.variant}`} 
                      className="flex gap-4 group"
                    >
                      <div className="size-24 rounded-2xl bg-beige-light border border-border-light overflow-hidden p-2 flex-shrink-0 cursor-pointer" onClick={() => { onClose(); navigate(`/producto/${item.id}`); }}>
                        <img src={item.images?.[0] || ''} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-text-main leading-tight truncate group-hover:text-primary transition-colors cursor-pointer" onClick={() => { onClose(); navigate(`/producto/${item.id}`); }}>
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="text-text-muted/40 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                        {item.variant && <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-1">{item.variant}</p>}
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border-default rounded-lg bg-white overflow-hidden">
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.qty - 1, item.variant)}
                              className="size-7 flex items-center justify-center text-text-muted hover:bg-beige-soft transition-colors"
                            >
                              <span className="material-symbols-outlined text-xs">remove</span>
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-text-main">{item.qty}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.qty + 1, item.variant)}
                              className="size-7 flex items-center justify-center text-text-muted hover:bg-beige-soft transition-colors"
                            >
                              <span className="material-symbols-outlined text-xs">add</span>
                            </button>
                          </div>
                          <span className="text-sm font-bold text-accent">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-border-light bg-beige-soft/30 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-bold text-text-main">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Envío</span>
                    <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Calculado al checkout</span>
                  </div>
                  <div className="pt-4 border-t border-border-light flex justify-between items-baseline">
                    <span className="font-serif text-xl font-bold text-accent italic">Total Estimado</span>
                    <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-5 rounded-2xl bg-primary text-white text-xs font-bold uppercase tracking-[0.2em] shadow-glow hover:bg-primary-dark transition-all flex items-center justify-center gap-3 group"
                  >
                    <span>Finalizar Compra</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">trending_flat</span>
                  </button>
                  <button 
                    onClick={() => { onClose(); navigate('/carrito'); }}
                    className="w-full py-4 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-accent transition-colors underline underline-offset-4 decoration-border-default"
                  >
                    Ver Carrito Completo
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
