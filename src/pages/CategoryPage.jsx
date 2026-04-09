import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsByCategory, getCategoryById, getCategories } from '../services/api';
import ProductGridCard from '../components/product/ProductGridCard';
import SkeletonProduct from '../components/skeletons/SkeletonProduct';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all', 'stock', 'preorder'

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

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Apply Availability Filter
    if (filterAvailability === 'stock') {
      result = result.filter(p => p.stock > 0);
    } else if (filterAvailability === 'preorder') {
      result = result.filter(p => p.stock <= 0);
    }

    // Apply Price Filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Apply Sorting
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }
    return result;
  }, [products, sortBy, filterAvailability, priceRange]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-20 py-24">
        <div className="flex flex-col gap-10">
          <div className="h-20 bg-gray-100 rounded-[2rem] animate-pulse"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProduct key={i} />
            ))}
          </div>
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

      {/* Product Grid and Filters */}
      <div className="mx-auto max-w-[1440px] px-4 lg:px-20 py-10">
        <nav className="flex items-center text-[10px] font-bold uppercase tracking-widest text-text-muted/60 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>Inicio</span>
          <span className="mx-3 opacity-30">/</span>
          <span className="text-accent italic tracking-tighter">{category.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters (Desktop) / Dropdown (Mobile) */}
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-32 space-y-10">
              {/* Header Title for Desktop */}
              <div className="hidden lg:block">
                <h2 className="font-serif text-2xl font-bold text-accent mb-2">Filtros</h2>
                <div className="w-12 h-1 bg-primary"></div>
              </div>

              {/* Mobile Filter Trigger */}
              <div className="lg:hidden flex justify-between gap-4">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 flex items-center justify-center gap-2 bg-beige-soft py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-accent"
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  {showFilters ? 'Cerrar Filtros' : 'Filtrar y Ordenar'}
                </button>
              </div>

              {/* Filter Content */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-10 animate-fade-in`}>
                {/* Availability */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Disponibilidad</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'stock', label: 'En Stock' },
                      { id: 'preorder', label: 'Pre-orden' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setFilterAvailability(opt.id)}
                        className={`text-left px-4 py-3 rounded-xl text-sm transition-all ${
                          filterAvailability === opt.id 
                            ? 'bg-primary text-white font-bold shadow-soft' 
                            : 'hover:bg-beige-soft/50 text-text-secondary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Rango de Precio</h4>
                  <div className="space-y-4 px-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="2000" 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between items-center text-xs font-bold text-accent">
                      <span>S/ 0</span>
                      <span className="bg-beige-soft px-3 py-1 rounded-full">S/ {priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sort (Moved here for mobile, but visible in desktop too) */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Ordenar por</h4>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full bg-white border border-border-light rounded-2xl py-3 px-4 text-sm font-medium text-accent focus:ring-1 focus:ring-primary outline-none appearance-none"
                  >
                    <option value="default">Recomendados</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="rating">Mejor Valorados</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-8">
              <p className="text-[11px] font-bold text-text-muted/40 uppercase tracking-widest">
                Mostrando <span className="text-accent">{filteredProducts.length}</span> resultados
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-background-soft rounded-[3rem] border border-dashed border-border-light">
                <span className="material-symbols-outlined text-5xl text-text-muted/20 mb-4 italic">sentiment_dissatisfied</span>
                <h3 className="text-xl font-bold text-accent mb-2">Sin resultados</h3>
                <p className="text-sm text-text-muted font-light mb-6">Prueba ajustando los filtros de precio o disponibilidad.</p>
                <button 
                  onClick={() => { setPriceRange([0, 2000]); setFilterAvailability('all'); }}
                  className="px-8 py-3 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p, i) => (
                    <motion.div
                      layout
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductGridCard product={p} index={i % 4} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
