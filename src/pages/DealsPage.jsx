import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getDeals } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { getProductById } from '../services/api';
import ProductGridCard from '../components/product/ProductGridCard';

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDeals().then(prods => { setProducts(prods); setLoading(false); });
  }, []);

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
              <ProductGridCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
