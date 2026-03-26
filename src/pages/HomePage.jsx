import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCategories, getDeals, getNewArrivals } from '../services/api';
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
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getCategories(), getDeals(), getNewArrivals()])
      .then(([cats, d, na]) => {
        setCategories(cats);
        setDeals(d);
        setNewArrivals(na);
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

      {/* Trust Badges */}
      <section className="py-10 px-6 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { icon: 'local_shipping', title: 'Envío Asegurado', desc: 'Entrega rápida, segura y rastreable a todo el Perú.' },
            { icon: 'verified_user', title: 'Garantía Premium', desc: 'Cobertura total de autenticidad y calidad.' },
            { icon: 'support_agent', title: 'Soporte 24/7', desc: 'Atención personalizada vía WhatsApp.' },
          ].map(t => (
            <div key={t.icon} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
                <span className="material-symbols-outlined">{t.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-accent mb-1">{t.title}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{t.desc}</p>
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

      {/* Featured Products / Deals */}
      <section className="py-12 px-6 md:px-10 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">NUESTRA SELECCIÓN</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-accent">Productos Destacados</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
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

      {/* New Arrivals Preview */}
      {latestProducts.length > 0 && (
        <section className="py-12 px-6 md:px-10 lg:px-20 bg-background-soft">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
              <div>
                <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">LO ÚLTIMO</span>
                <h2 className="font-serif text-3xl font-bold text-accent">Novedades</h2>
              </div>
              <button
                onClick={() => navigate('/novedades')}
                className="text-primary text-xs font-bold uppercase tracking-wider hover:text-primary-dark flex items-center gap-1"
              >
                Ver todo <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {latestProducts.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/producto/${p.slug}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow stagger-card"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                    <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    {p.badge && <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{p.badge}</span>}
                    <h3 className="text-base font-serif font-bold text-text-main mt-1">{p.name}</h3>
                    <p className="text-sm font-bold text-primary mt-1">{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
