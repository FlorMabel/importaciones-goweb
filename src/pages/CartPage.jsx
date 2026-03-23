import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsByIds } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cart.length === 0) { setLoading(false); return; }
    const uniqueIds = [...new Set(cart.map(i => i.id))];
    getProductsByIds(uniqueIds).then(prods => {
      setProducts(prods);
      setLoading(false);
    });
  }, [cart]);

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

  const total = cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  const shipping = total >= 150 ? 0 : 15;

  const handleUpdateQty = (id, variant, newQty) => {
    if (newQty < 1) return;
    updateCartQuantity(id, newQty, variant);
  };

  const handleRemove = (id, variant) => {
    removeFromCart(id, variant);
  };

  return (
    <>
      <Helmet><title>Carrito de Compras | GO SHOPPING</title></Helmet>
      <div className="bg-background-soft min-h-[70vh]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-8 lg:py-12">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-accent mb-2">Tu Carrito de Compras</h1>
            <nav className="flex items-center gap-2 text-text-muted text-xs">
              <span className="hover:text-accent cursor-pointer" onClick={() => navigate('/')}>Inicio</span>
              <span>/</span>
              <span className="text-text-main font-bold">Carrito</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-300 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <div className="col-span-6">PRODUCTO</div>
                <div className="col-span-2 text-center">PRECIO</div>
                <div className="col-span-2 text-center">CANTIDAD</div>
                <div className="col-span-2 text-right">TOTAL</div>
              </div>

              {cart.map(item => {
                const p = products.find(pr => pr.id === item.id);
                if (!p) return null;
                const itemTotal = p.price * item.qty;
                return (
                  <div key={`${item.id}__${item.variant || ''}`} className="py-5 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg bg-white border border-gray-200 overflow-hidden p-1 cursor-pointer" onClick={() => navigate(`/producto/${p.slug}`)}>
                          <img src={p.images?.[0] || ''} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-text-main truncate">{p.name}</h3>
                          {item.variant && <p className="text-xs text-accent font-medium">{item.variant}</p>}
                          <p className="text-xs text-text-muted">{p.category}</p>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 text-left md:text-center">
                        <span className="text-sm font-bold text-text-main">{formatPrice(p.price)}</span>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                        <div className="qty-selector px-1">
                          <button onClick={() => handleUpdateQty(item.id, item.variant, item.qty - 1)}>
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="qty-value">{item.qty}</span>
                          <button onClick={() => handleUpdateQty(item.id, item.variant, item.qty + 1)}>
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                        <span className="text-sm font-bold text-text-main">{formatPrice(itemTotal)}</span>
                        <button onClick={() => handleRemove(item.id, item.variant)} className="ml-3 text-text-muted hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
                <h3 className="font-serif text-xl font-bold text-accent mb-5">Resumen del Pedido</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between"><span className="text-text-muted">Subtotal</span><span className="font-bold">{formatPrice(total)}</span></div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Envío</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && <p className="text-[10px] text-green-600">¡Envío gratis en compras mayores a S/ 150.00!</p>}
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                    <span className="font-bold text-text-main">Total</span>
                    <span className="font-bold text-accent text-lg">{formatPrice(total + shipping)}</span>
                  </div>
                </div>
                <button onClick={() => navigate('/checkout')} className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2">
                  Proceder al Pago <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <button onClick={() => navigate('/')} className="w-full mt-3 text-text-muted text-sm hover:text-accent transition-colors text-center py-2">
                  ← Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
