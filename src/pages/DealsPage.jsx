import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getDeals } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { getProductById } from '../services/api';
import StarRating from '../components/StarRating';

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const { showToast } = useToast();

  useEffect(() => {
    getDeals().then(prods => { setProducts(prods); setLoading(false); });
  }, []);

  const handleQuickAdd = async (e, id) => {
    e.stopPropagation();
    const product = await getProductById(id);
    if (product) {
      addToCart(product.id, 1);
      showToast(`${product.name} agregado al carrito`);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <>
      <Helmet>
        <title>Ofertas | GO SHOPPING</title>
        <meta name="description" content="Las mejores ofertas y descuentos en productos importados premium." />
      </Helmet>
      <section className="py-12 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">OFERTAS ESPECIALES</span>
            <h1 className="font-serif text-4xl font-bold text-accent mb-2">Ofertas</h1>
            <p className="text-text-muted text-sm max-w-md mx-auto">Aprovecha los mejores precios en productos premium importados.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <div key={p.id} className="product-card bg-white border border-gray-100 flex flex-col stagger-card" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="image-container relative bg-gray-50 cursor-pointer" onClick={() => navigate(`/producto/${p.slug}`)}>
                  {p.badge && <span className={`variant-badge ${p.badgeColor || ''}`}>{p.badge}</span>}
                  {p.salePercent && <span className="absolute top-3 right-3 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">-{p.salePercent}%</span>}
                  <img src={p.images?.[0] || ''} alt={p.name} loading="lazy" />
                  <button onClick={(e) => handleQuickAdd(e, p.id)} className="add-btn"><span className="material-symbols-outlined text-base">add_shopping_cart</span></button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{p.category || ''}</p>
                  <h3 className="text-sm font-bold text-text-main mb-1 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center gap-1 mb-2"><StarRating rating={p.rating} /><span className="text-[10px] text-text-muted">({p.reviews || 0})</span></div>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="text-sm font-bold text-accent">{formatPrice(p.price)}</span>
                    {p.oldPrice && <span className="text-xs text-text-muted line-through">{formatPrice(p.oldPrice)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
