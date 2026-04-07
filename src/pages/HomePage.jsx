import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCategories, getDeals, getNewArrivals, getAllProducts } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SkeletonProduct from '../components/skeletons/SkeletonProduct';
import { motion, AnimatePresence } from 'framer-motion';

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
    const fetchData = async () => {
      try {
        const [cats, d, na, all] = await Promise.all([
          getCategories(), 
          getDeals(), 
          getNewArrivals(), 
          getAllProducts()
        ]);
        setCategories(cats);
        setDeals(d);
        setNewArrivals(na);
        setAllProducts(all || []);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const preOrderProducts = allProducts.filter(p => p.stock <= 0).slice(0, 8);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-20 py-12 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonProduct key={i} />
          ))}
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
      <section className="relative w-full overflow-hidden bg-black">
        <div className="relative w-full min-h-[420px] md:min-h-[700px] flex items-center">
          {/* VIDEO / IMAGE BACKGROUND */}
          <AnimatePresence mode="wait">
            <motion.video
              key={HERO_VIDEOS[currentVideo]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              src={HERO_VIDEOS[currentVideo]}
              autoPlay
              muted
              playsInline
              onEnded={() => setCurrentVideo((prev) => (prev + 1) % HERO_VIDEOS.length)}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </AnimatePresence>

          {/* LUXURY OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 z-10"></div>
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-[5]"></div>

          {/* CONTENIDO ELEVADO */}
          <div className="container mx-auto px-5 lg:px-20 z-20 relative pt-16 md:pt-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col items-start"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-[1px] w-8 bg-primary"></span>
                  <span className="text-white font-bold uppercase tracking-[0.2em] text-[9px] md:text-xs">
                    Colecciones de Prestigio
                  </span>
                </div>

                <h1 className="text-white font-serif text-4xl md:text-8xl leading-[1] mb-6 md:mb-8 font-extrabold tracking-tighter">
                  Donde la exclusividad <br />
                  <span className="text-primary italic font-light">encuentra su lugar</span>
                </h1>

                <p className="text-white/80 text-base md:text-2xl font-light mb-8 md:mb-12 max-w-2xl leading-relaxed tracking-tight">
                  Seleccionamos piezas únicas traídas de todo el mundo para aquellos que no se conforman con lo ordinario.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/categoria/anillos')}
                    className="bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-bold py-3.5 px-6 md:py-4 md:px-10 rounded-full transition-all duration-300 flex items-center gap-2 shadow-glow group"
                  >
                    <span>Explorar Catálogo</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <button
                    onClick={() => navigate('/novedades')}
                    className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs md:text-sm font-bold py-3.5 px-6 md:py-4 md:px-10 rounded-full transition-all duration-300"
                  >
                    Ver Novedades
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* SCROLL INDICATOR */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 opacity-50"
          >
            <span className="text-[10px] text-white uppercase tracking-[0.4em] font-medium">Desliza</span>
            <div className="w-[1px] h-14 bg-gradient-to-b from-white via-white/50 to-transparent"></div>
          </motion.div>
        </div>
      </section>

    {/* Trust Badges - Horizontal scroll mobile, grid desktop */}
    <section className="bg-white py-12 md:py-24 px-4 md:px-10 lg:px-20 relative z-30">
      <div className="max-w-6xl mx-auto">
        <div className="flex overflow-x-auto gap-3 md:grid md:grid-cols-3 md:gap-6 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {[
            { icon: 'local_shipping', title: 'Envío Seguro', desc: 'Envío asegurado a todo el Perú' },
            { icon: 'verified_user', title: 'Calidad Certificada', desc: 'Productos importados con calidad garantizada' },
            { icon: 'support_agent', title: 'Atención VIP', desc: 'Asesoría WhatsApp 24/7' },
          ].map((t, i) => (
            <motion.div 
              key={t.icon}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 p-8 md:p-10 bg-beige-soft/30 rounded-[2.5rem] border border-border-light/40 shrink-0 min-w-[280px] md:min-w-0 transition-all duration-500 hover:bg-white hover:shadow-strong active:scale-95"
            >
              <div className="size-14 md:size-16 rounded-2xl bg-white shadow-soft flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-2xl md:text-3xl">{t.icon}</span>
              </div>
              <div className="flex flex-col text-center md:text-left">
                <h3 className="text-sm md:text-base font-bold text-accent mb-2 tracking-tight uppercase tracking-widest">{t.title}</h3>
                <p className="text-[11px] md:text-sm text-text-muted/80 leading-relaxed font-light">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

      {/* Categories */}
      <section className="py-16 md:py-24 px-4 md:px-10 lg:px-20 bg-background-soft">
        <div className="max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-10"
          >
            <div>
              <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-2 block">Explora</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent italic">Categorías</h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { document.getElementById('categories-scroll').scrollBy({ left: -300, behavior: 'smooth' }); }}
                className="size-10 md:size-12 rounded-full bg-white border border-border-default text-text-main flex items-center justify-center hover:border-primary hover:text-primary transition-all shadow-soft"
                aria-label="Anterior"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">west</span>
              </button>
              <button 
                onClick={() => { document.getElementById('categories-scroll').scrollBy({ left: 300, behavior: 'smooth' }); }}
                className="size-10 md:size-12 rounded-full bg-white border border-border-default text-text-main flex items-center justify-center hover:border-primary hover:text-primary transition-all shadow-soft"
                aria-label="Siguiente"
              >
                <span className="material-symbols-outlined text-lg md:text-xl">east</span>
              </button>
            </div>
          </motion.div>

          <div 
            id="categories-scroll"
            className="flex overflow-x-auto gap-4 md:gap-8 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/categoria/${c.slug}`)}
                className="group flex flex-col items-center gap-4 cursor-pointer shrink-0 snap-start w-28 md:w-36 transition-all"
              >
                <div className="relative size-28 md:size-36 rounded-full overflow-hidden border border-border-light group-hover:border-primary transition-all duration-700 shadow-soft bg-white p-1.5">
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors z-10"></div>
                  <div 
                    className="w-full h-full rounded-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110" 
                    style={{ backgroundImage: `url('${c.image_url || c.image}')` }}
                  ></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xs md:text-sm font-bold text-accent uppercase tracking-widest group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <div className="w-0 group-hover:w-full h-[1px] bg-primary mx-auto transition-all duration-500 mt-1"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Rows Section */}
      <section className="py-12 md:py-20 px-4 md:px-10 lg:px-20 bg-background-soft">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6 md:gap-12">
          {productsByCategory.map((cat, idx) => {
            const colors = [
              "bg-accent text-white",           // 20% Morado
              "bg-beige-soft text-accent",      // 60% Beige
              "bg-primary text-white",          // 20% Dorado
              "bg-beige-soft text-accent",      // 60% Beige
              "bg-beige-strong text-accent"     // 60% Beige
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 md:p-6 lg:p-8 bg-white rounded-2xl md:rounded-[2.5rem] shadow-soft border border-border-light hover:shadow-medium transition-all duration-700"
              >
                {/* Left Category Hero Block */}
                <div className={`w-full lg:w-[360px] shrink-0 rounded-xl md:rounded-[2rem] p-5 md:p-10 flex flex-col justify-between relative overflow-hidden ${colorClass} group/hero`}>
                  {/* Decorative element */}
                  <div className="absolute -top-20 -right-20 size-64 bg-white/5 rounded-full blur-3xl group-hover/hero:bg-white/10 transition-colors"></div>
                  
                  <div className="z-10 relative">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block ${colorClass.includes('text-white') ? 'text-white/60' : 'text-accent/40'}`}>
                      Colecciones Seleccionadas 
                    </span>
                    <h3 className="font-serif text-2xl md:text-5xl font-bold leading-none tracking-tight mb-2 md:mb-4 italic">{cat.name}</h3>
                    <p className={`text-xs font-light max-w-[200px] leading-relaxed ${colorClass.includes('text-white') ? 'text-white/70' : 'text-text-muted'}`}>
                      Piezas seleccionadas que definen un estándar de elegancia superior.
                    </p>
                  </div>
                  
                  {cat.image_url && (
                    <div className="my-4 md:my-10 flex justify-center items-center z-10 relative">
                       <div className="relative">
                         <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110"></div>
                         <img 
                           src={cat.image} 
                           alt={cat.name} 
                           className="size-28 md:size-48 object-cover rounded-full shadow-strong border-4 border-white/30 hover:scale-105 transition-transform duration-700 z-10 relative" 
                           loading="lazy" 
                         />
                       </div>
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(`/categoria/${cat.slug}`)}
                    className={`z-10 relative mt-auto w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                      colorClass.includes('text-white') 
                        ? 'bg-white/10 hover:bg-white text-white hover:text-accent' 
                        : 'bg-accent/5 hover:bg-accent text-accent hover:text-white'
                    }`}
                  >
                    Explorar Todo <span className="material-symbols-outlined text-sm">trending_flat</span>
                  </button>
                </div>

                {/* Horizontal Product Scroll */}
                <div className="flex-1 w-full overflow-hidden relative">
                  <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory pt-4 custom-scrollbar">
                    {cat.products.slice(0, 3).map((p) => (
                      <div key={p.id} className="w-[160px] md:w-[280px] shrink-0 snap-start">
                        <ProductCard product={p} index={0} />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Products / Deals */}
      <section className="py-24 px-6 md:px-10 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase mb-3 block">LO MÁS DESEADO</span>
            <h2 className="font-serif text-3xl md:text-6xl font-bold text-accent tracking-tighter">Ofertas Exclusivas</h2>
          </div>
          <div className="relative w-full overflow-hidden group py-4">
            <div className="flex w-max animate-scroll group-hover:[animation-play-state:paused] gap-4 md:gap-8">
              {[...featuredProducts, ...featuredProducts].map((p, i) => (
                <div key={`${p.id}-${i}`} className="w-[180px] md:w-[320px] shrink-0">
                  <ProductCard product={p} index={0} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pre-orders / Coming Soon Section */}
      {preOrderProducts.length > 0 && (
        <section className="py-24 px-6 md:px-10 lg:px-20 bg-accent-dark text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <span className="text-primary font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase mb-4 block">Importaciones en Camino</span>
                <h2 className="font-serif text-3xl md:text-6xl font-bold leading-none tracking-tighter mb-6 italic">Próximos Ingresos</h2>
                <p className="text-white/50 font-light text-base md:text-lg leading-relaxed">
                  Asegura tus piezas favoritas antes de que lleguen al país. Los productos en pre-orden tienen un precio especial de lanzamiento.
                </p>
              </div>
              <button 
                onClick={() => navigate('/categoria')}
                className="bg-white/10 hover:bg-white text-white hover:text-accent font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest transition-all backdrop-blur-md border border-white/20"
              >
                Ver Todo el Tránsito
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {preOrderProducts.map((p) => (
                <div key={p.id} className="relative group">
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-glow">Importación</span>
                  </div>
                  <ProductCard product={p} darkTheme={true} />
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
