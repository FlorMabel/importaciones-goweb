import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getNewArrivals } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewArrivals().then(prods => { setProducts(prods); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <>
      <Helmet>
        <title>Novedades | GO SHOPPING</title>
        <meta name="description" content="Descubre los últimos productos importados en GO SHOPPING." />
      </Helmet>
      <section className="py-12 px-4 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">LO MÁS RECIENTE</span>
            <h1 className="font-serif text-4xl font-bold text-accent mb-2">Novedades</h1>
            <p className="text-text-muted text-sm max-w-md mx-auto">Los últimos productos que hemos agregado a nuestra colección exclusiva.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}
