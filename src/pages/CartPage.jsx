import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsByIds } from '../services/api';
import { formatPrice, getItemPrice } from '../utils';
import { useStore } from '../context/StoreContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial small delay for premium feel loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Helmet><title>Carrito de Compras | GO SHOPPING</title></Helmet>
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-text-muted/30 mb-4">shopping_cart</span>
          <h2 className="text-2xl font-serif font-bold text-accent mb-2">Tu carrito está vacío</h2>
          <p className="text-text-muted text-sm mb-6">Descubre nuestros productos premium y agrega tus favoritos.</p>
          <button onClick={() => navigate('/')} className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 px-8 rounded-full transition-colors">
            Explorar Productos
          </button>
        </div>
      </>
    );
  }

  const total = getCartTotal();
  const shipping = total >= 400 ? 0 : 5;

  const handleUpdateQty = (id, variant, newQty) => {
    updateCartQuantity(id, newQty, variant);
  };

  return (
    <>
      <Helmet><title>Carrito de Compras | GO SHOPPING</title></Helmet>
      <div className="bg-beige-soft min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12 lg:py-20">
          <div className="mb-12">
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-3 block">Resumen de</span>
            <h1 className="text-3xl md:text-6xl font-serif font-bold text-accent italic">Tu Carrito</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-8">
              {cart.map(item => (
                <div key={`${item.id}__${item.variant || ''}`} className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-6 shadow-soft border border-border-light hover:shadow-medium transition-all duration-500 overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="size-24 md:size-40 shrink-0 rounded-xl md:rounded-[1.5rem] bg-beige-light border border-border-light overflow-hidden p-3 md:p-4 cursor-pointer" onClick={() => navigate(`/producto/${item.slug}`)}>
                      <img src={item.images?.[0] || ''} className="w-full h-full object-contain mix-blend-multiply hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    
                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">Premium Import</p>
                      <h3 className="text-xl font-bold text-accent mb-1 truncate">{item.name}</h3>
                      {item.variant && <p className="text-xs text-primary font-bold uppercase tracking-widest mb-4 italic">{item.variant}</p>}
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 mt-4">
                         <div className="space-y-1">
                           <p className="text-[9px] uppercase tracking-widest text-text-muted">Precio Unitario</p>
                           <p className="text-sm font-bold text-text-main">{formatPrice(item.price)}</p>
                         </div>
                         
                         <div className="space-y-1">
                           <p className="text-[9px] uppercase tracking-widest text-text-muted">Cantidad</p>
                           <div className="flex items-center border border-border-default rounded-xl bg-beige-light overflow-hidden">
                             <button onClick={() => handleUpdateQty(item.id, item.variant, item.qty - 1)} className="size-8 flex items-center justify-center text-text-muted hover:bg-white transition-colors">
                               <span className="material-symbols-outlined text-xs">remove</span>
                             </button>
                             <span className="w-8 text-center text-xs font-bold text-text-main">{item.qty}</span>
                             <button onClick={() => handleUpdateQty(item.id, item.variant, item.qty + 1)} className="size-8 flex items-center justify-center text-text-muted hover:bg-white transition-colors">
                               <span className="material-symbols-outlined text-xs">add</span>
                             </button>
                           </div>
                         </div>

                         <div className="space-y-1">
                           <p className="text-[9px] uppercase tracking-widest text-text-muted">Subtotal</p>
                           <p className="text-sm font-bold text-accent">{formatPrice(item.price * item.qty)}</p>
                         </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.variant)} 
                      className="size-12 rounded-full bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center group shadow-soft"
                      title="Eliminar del carrito"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-strong border border-border-light relative overflow-hidden">
                <div className="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                
                <h3 className="font-serif text-2xl font-bold text-accent mb-8 italic">Tu Inversión</h3>
                
                <div className="space-y-4 text-sm mb-10">
                  <div className="flex justify-between border-b border-border-light pb-4">
                    <span className="text-text-muted">Valor de productos</span>
                    <span className="font-bold text-text-main">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border-light pb-4">
                    <span className="text-text-muted">Servicio de Envío</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-text-main'}`}>
                      {shipping === 0 ? 'CORTESÍA' : formatPrice(shipping)}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                      <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest leading-relaxed">
                        ¡Logra Envío Gratis superando los S/ 400.00 en tu pedido!
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-baseline">
                    <span className="font-serif text-xl font-bold text-accent">Total Final</span>
                    <span className="text-3xl font-bold text-primary">{formatPrice(total + shipping)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => navigate('/checkout')} 
                    className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-glow flex items-center justify-center gap-3 group"
                  >
                    <span>Seguir al Checkout</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">trending_flat</span>
                  </button>
                  <button 
                    onClick={() => navigate('/')} 
                    className="w-full text-text-muted text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-colors text-center py-2 underline underline-offset-8"
                  >
                    Regresar a la Colección
                  </button>
                </div>

                {/* Trust Badges in Cart */}
                <div className="mt-8 pt-8 border-t border-border-light flex justify-between gap-4 grayscale opacity-60">
                   <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-xl">shield</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest">Pago Seguro</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-xl">package_2</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest">Garantía FlorMabel</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-xl">verified</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest">Original</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
