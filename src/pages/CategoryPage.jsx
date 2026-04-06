import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsByCategory, getCategoryById, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setLoading(true);
    if (!slug) {
      getCategories().then(cats => {
        setAllCategories(cats);
        setLoading(false);
      });
    } else {
      Promise.all([getCategoryById(slug), getProductsByCategory(slug)])
        .then(([cat, prods]) => {
          setCategory(cat);
          setProducts(prods);
          setLoading(false);
        });
    }
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'rating': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }
    return sorted;
  }, [products, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-muted text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show all categories overview
  if (!slug) {
    return (
      <>
        <Helmet>
          <title>Tienda | GO SHOPPING</title>
          <meta name="description" content="Explora todas nuestras categorías de productos premium importados." />
        </Helmet>
        <section className="py-12 px-6 md:px-10 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-4xl font-bold text-accent mb-2">Tienda</h1>
            <p className="text-text-muted text-sm mb-8">Explora todas nuestras categorías de productos premium importados.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {allCategories.map(c => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/categoria/${c.slug}`)}
                  className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-sm"
                >
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${c.image}')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5 w-full">
                    <span className="material-symbols-outlined text-white text-xl mb-1">{c.icon}</span>
                    <h3 className="text-white font-serif text-lg font-medium">{c.name}</h3>
                    <p className="text-white/60 text-xs mt-1">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif text-accent">Categoría no encontrada</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold text-sm">Volver al inicio</button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} | GO SHOPPING</title>
        <meta name="description" content={category.description} />
      </Helmet>

      {/* Hero Banner */}
      <section
        className="relative h-[160px] md:h-[280px] w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${category.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-black/45"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3">COLECCIÓN EXCLUSIVA</p>
          <h1 className="font-serif text-3xl md:text-5xl font-medium mb-2">{category.name}</h1>
          <p className="max-w-md mx-auto text-white/80 font-light text-sm">{category.description}</p>
        </div>
      </section>

      {/* Product Grid */}
      <div className="mx-auto max-w-[1440px] px-3 md:px-4 lg:px-12 py-6 md:py-8">
        <nav className="flex items-center text-xs text-text-muted mb-8">
          <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Inicio</span>
          <span className="mx-2">/</span>
          <span className="text-accent font-medium">{category.name}</span>
        </nav>

        <div className="flex items-center justify-between mb-6 text-sm">
          <span className="text-text-muted">{products.length} productos</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-transparent border border-gray-200 rounded-lg font-medium text-text-main text-sm py-2 px-3 focus:ring-1 focus:ring-accent cursor-pointer"
          >
            <option value="default">Más vendidos</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {sortedProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
