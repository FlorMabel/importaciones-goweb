import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCategories, getDeals, getNewArrivals, getAllProducts } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';

const HERO_VIDEOS = [
  "/videos/video_vista%20de%20anillos.mp4",
  "/videos/video_esencias%20en%20muestra.mp4",
  "/videos/video_casco%20de%20perro.mp4"
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getCategories(), getDeals(), getNewArrivals(), getAllProducts()])
      .then(([cats, d, na, all]) => {
        setCategories(cats);
        setDeals(d);
        setNewArrivals(na);
        setAllProducts(all || []);
        setLoading(false);
      });
  }, []);

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

  const featuredCategories = categories.slice(0, 8);
  const featuredProducts = deals.slice(0, 8);
  const latestProducts = newArrivals.slice(0, 3);
  
  const productsByCategory = categories.map(c => ({
    ...c,
    products: allProducts.filter(p => p.category === c.id || p.category_id === c.id)
  })).filter(c => c.products.length > 0);

  return (
    <>
      <Helmet>
        <title>GO SHOPPING | Premium Store — Productos Importados</title>
        <meta name="description" content="Tienda online premium de productos importados: anillos, humidificadores, esencias, quemadores, tecnología y más." />
        <meta property="og:title" content="GO SHOPPING | Premium Store" />
        <meta property="og:description" content="Descubre nuestra colección exclusiva de artículos de lujo seleccionados." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative w-full">
        <div className="relative w-full overflow-hidden min-h-[420px] md:min-h-[500px] bg-black">

          {/* VIDEO */}
          <video
          key={HERO_VIDEOS[currentVideo]}
          src={HERO_VIDEOS[currentVideo]}
          autoPlay
          muted
          playsInline
          onEnded={() =>
            setCurrentVideo((prev) => (prev + 1) % HERO_VIDEOS.length)
          }
          className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* OVERLAY PRO */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>

          {/* CONTENIDO */}
          <div className="absolute z-20 left-6 md:left-20 top-1/2 -translate-y-1/2 max-w-xl">
          <div className="flex flex-col items-start text-left">
            <span className="text-white font-bold uppercase tracking-[0.15em] text-xs bg-white/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/30">
            COLECCIONES EXCLUSIVAS
            </span>

            <h1 className="text-white font-serif text-3xl md:text-5xl mt-4 leading-tight">
              Productos importados que elevan tu estilo de vida
            </h1>

            <p className="text-white/80 text-lg font-light mt-3">
              Descubre nuestra selección exclusiva de artículos premium para los gustos más exigentes.
            </p>

            <button
            onClick={() => navigate('/categoria/anillos')}
            className="mt-6 bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center gap-2 shadow-medium"
            >
              <span>Explorar Colección</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Trust Badges - Flush with Hero but OUTSIDE */}
    <section className="bg-background-soft pt-0 pb-8 px-6 md:px-10 lg:px-20">
      <div className="flex flex-col md:flex-row gap-3 max-w-4xl mx-auto justify-center relative">
        {[
          { icon: 'local_shipping', title: 'Envío Asegurado', desc: 'A todo el Perú' },
          { icon: 'verified_user', title: 'Garantía Premium', desc: 'Calidad total' },
          { icon: 'support_agent', title: 'Soporte 24/7', desc: 'Por WhatsApp' },
        ].map(t => (
          <div key={t.icon} className="flex-1 flex items-center justify-center md:justify-start gap-3 p-3 bg-white rounded-2xl shadow-soft border border-border-default hover:border-primary/50 transition-all duration-300">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            </div>
            <div className="flex flex-col text-left">
              <h3 className="text-[11px] md:text-xs font-bold text-accent leading-none mb-1">{t.title}</h3>
              <p className="text-[9px] md:text-[10px] text-text-muted leading-none">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

      {/* Categories */}
      <section className="py-12 px-6 md:px-10 lg:px-20 bg-background-soft">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent">Categorías</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => { document.getElementById('categories-scroll').scrollBy({ left: -300, behavior: 'smooth' }); }}
                className="size-10 rounded-full bg-white border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
                aria-label="Anterior"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button 
                onClick={() => { document.getElementById('categories-scroll').scrollBy({ left: 300, behavior: 'smooth' }); }}
                className="size-10 rounded-full bg-white border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
                aria-label="Siguiente"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div 
            id="categories-scroll"
            className="flex overflow-x-auto gap-4 md:gap-8 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((c, i) => (
              <div
                key={c.id}
                onClick={() => navigate(`/categoria/${c.slug}`)}
                className="group flex flex-col items-center gap-3 cursor-pointer shrink-0 snap-start w-24 sm:w-28 md:w-32 lg:w-36 stagger-card hover:-translate-y-1 transition-transform"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative size-24 sm:size-28 md:size-32 lg:size-36 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-md bg-white p-1">
                  <div 
                    className="w-full h-full rounded-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                    style={{ backgroundImage: `url('${c.image_url || c.image}')` }}
                  ></div>
                </div>
                <h3 className="text-center text-sm lg:text-base font-bold text-accent leading-tight group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Rows Section (Color Palette: 60% Beige, 20% Gold, 20% Purple) */}
      <section className="py-12 px-6 md:px-10 lg:px-20 bg-background-soft">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-8 md:gap-12">
          {productsByCategory.map((cat, idx) => {
            const colors = [
              "bg-accent text-white",           // 20% Morado
              "bg-[#F5F3EF] text-accent",       // 60% Beige
              "bg-primary text-white",          // 20% Dorado
              "bg-[#F5F3EF] text-accent",       // 60% Beige
              "bg-[#EFE9DF] text-accent"        // 60% Beige (ligeramente más oscuro)
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <div key={cat.id} className="flex flex-col lg:flex-row gap-4 p-4 lg:p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                {/* Left Category Hero Block */}
                <div className={`w-full lg:w-[320px] shrink-0 rounded-[1.5rem] p-8 flex flex-col justify-between relative overflow-hidden ${colorClass}`}>
                  <div className="z-10 relative text-center lg:text-left">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block ${colorClass.includes('text-white') ? 'text-white/80' : 'text-accent/60'}`}>
                      Colección
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight">{cat.name}</h3>
                  </div>
                  
                  {cat.image_url && (
                    <div className="my-8 flex justify-center items-center z-10 relative">
                       <img 
                         src={cat.image_url} 
                         alt={cat.name} 
                         className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg border-4 border-white/20 hover:scale-105 transition-transform duration-500" 
                         loading="lazy" 
                       />
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(`/categoria/${cat.slug}`)}
                    className={`z-10 relative mt-auto mx-auto lg:mx-0 w-max px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                      colorClass.includes('text-white') 
                        ? 'bg-white/20 hover:bg-white/30 text-white' 
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                  >
                    Ver Todo <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                {/* Horizontal Product Scroll */}
                <div className="flex-1 w-full overflow-hidden relative">
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory pt-2 custom-scrollbar">
                    {cat.products.slice(0, 8).map((p) => (
                      <div key={p.id} className="w-[200px] md:w-[240px] shrink-0 snap-start">
                        <ProductCard product={p} index={0} />
                      </div>
                    ))}
                    <div className="w-[180px] md:w-[200px] shrink-0 snap-start flex items-center justify-center p-4">
                      <button 
                        onClick={() => navigate(`/categoria/${cat.slug}`)}
                        className="flex flex-col items-center justify-center gap-3 w-full h-full min-h-[250px] bg-background-soft rounded-2xl hover:bg-[#EFE9DF] transition-colors text-accent border border-transparent hover:border-primary"
                      >
                        <span className="material-symbols-outlined text-3xl">arrow_circle_right</span>
                        <span className="font-bold text-sm">Ver más info</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Products / Deals */}
      <section className="py-12 px-6 md:px-10 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">NUESTRA SELECCIÓN</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent">Productos Destacados</h2>
          </div>
          <div className="relative w-full overflow-hidden group py-4">
            <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] gap-4 md:gap-6">
              {[...featuredProducts, ...featuredProducts].map((p, i) => (
                <div key={`${p.id}-${i}`} className="w-[260px] md:w-[280px] shrink-0">
                  <ProductCard product={p} index={0} />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/ofertas')}
              className="text-primary text-xs font-bold uppercase tracking-wider hover:text-primary-dark flex items-center gap-1 mx-auto"
            >
              Ver todas las ofertas <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>



      {/* Newsletter */}
      <section className="py-16 px-6 bg-[#f8f6f2] flex flex-col items-center text-center">
        <div className="size-12 bg-white rounded-full flex items-center justify-center text-accent mb-5 shadow-sm border border-gray-100">
          <span className="material-symbols-outlined text-xl">mail</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent mb-4">Únete a nuestro Club Exclusivo</h2>
        <p className="text-text-muted max-w-md mx-auto mb-6 text-sm">
          Recibe acceso anticipado a nuevas colecciones, ofertas especiales y contenido curado solo para miembros.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md" onSubmit={e => { e.preventDefault(); showToast('¡Gracias por suscribirte!'); }}>
          <input type="email" className="flex-1 bg-white border border-gray-200 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Tu correo electrónico" required />
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3.5 px-8 rounded-full transition-colors">Suscribirse</button>
        </form>
      </section>
    </>
  );
}
