import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories, searchProducts } from '../services/api';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const { getCartCount, setCartDrawerOpen } = useStore();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) { setSearchResults([]); return; }
      const results = await searchProducts(query);
      setSearchResults(results);
    }, 250),
    []
  );

  const onSearchInput = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    handleSearch(q);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const navTo = (path) => {
    navigate(path);
    closeDrawer();
    closeSearch();
  };

  return (
    <>
      {/* Top Bar with Ticker */}
      <div className="bg-accent text-white overflow-hidden py-1.5">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap flex items-center gap-16 text-[10px] font-light tracking-[0.2em] uppercase opacity-90"
        >
          <span>Envíos gratis a todo el Perú en compras mayores a S/400</span>
          <span className="text-white/40">•</span>
          <span>Lima • Arequipa • Cusco • Chiclayo • Chimbote • Huanuco • Huancayo • Ica • Piura • Pucallpa • Puno • Tarapoto</span>
          <span className="text-white/40">•</span>
          <span>Pago 100% Seguro: Yape, Plin o Transferencia Bancaria</span>
          <span className="text-white/40">•</span>
          <span>Asesoría personalizada WhatsApp +51 962 810 439</span>
        </motion.div>
      </div>

      <header className={`glass-header sticky top-0 z-50 w-full border-b transition-all duration-500 ${isScrolled ? 'h-14 lg:h-16 scrolled border-gray-200/50' : 'h-16 lg:h-24 border-transparent'}`}>
        <div className="mx-auto max-w-[1440px] px-4 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://res.cloudinary.com/dod8hhjoo/image/upload/v1774224726/goshopping/optimized/logo-768w.webp" 
              alt="GO SHOPPING" 
              className="h-10 lg:h-12 w-auto object-contain"
            />
            <span className="text-text-main font-serif text-lg lg:text-xl font-bold tracking-tight">SHOPPING</span>
          </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-text-main hover:text-accent transition-colors text-sm font-medium">Inicio</Link>
          <div className="relative group" id="mega-menu-trigger">
            <span className="text-text-main hover:text-accent transition-colors text-sm font-medium cursor-pointer flex items-center gap-1">
              Tienda <span className="material-symbols-outlined text-sm">expand_more</span>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-[380px] grid grid-cols-1 gap-1">
                {categories.map(c => (
                  <Link
                    key={c.id}
                    to={`/categoria/${c.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-soft transition-colors group/item"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ color: c.color }}>{c.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-text-main group-hover/item:text-accent transition-colors">{c.name}</p>
                      <p className="text-[11px] text-text-muted line-clamp-1">{c.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/novedades" className="text-text-main hover:text-accent transition-colors text-sm font-medium">Novedades</Link>
          <Link to="/nosotros" className="text-text-main hover:text-accent transition-colors text-sm font-medium">Nosotros</Link>
          <Link to="/contacto" className="text-text-main hover:text-accent transition-colors text-sm font-medium">Contacto</Link>
        </nav>

        <div className="flex items-center gap-3 lg:gap-5">
          <button onClick={() => setIsSearchOpen(true)} className="text-text-main hover:text-accent transition-colors">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <button 
            onClick={() => setCartDrawerOpen(true)}
            className="text-text-main hover:text-accent transition-colors relative"
          >
            <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 size-4.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsDrawerOpen(true)} className="lg:hidden text-text-main">
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-20 px-4 md:pt-32" 
          onClick={closeSearch}
        >
          <motion.div 
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-strong overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 bg-background-soft rounded-2xl px-5 py-4 border border-border-default focus-within:border-primary transition-all">
                <span className="material-symbols-outlined text-text-muted">search</span>
                <input
                  type="text"
                  placeholder="Busca elegancia, busca estilo..."
                  className="flex-1 bg-transparent border-none text-base focus:ring-0 placeholder:text-text-muted/60 outline-none font-medium"
                  autoFocus
                  value={searchQuery}
                  onChange={onSearchInput}
                />
                <button onClick={closeSearch} className="size-8 rounded-full hover:bg-white flex items-center justify-center text-text-muted transition-colors">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
              
              <div className="mt-6 max-h-[60vh] overflow-y-auto custom-scrollbar -mx-2 px-2">
                {searchResults.length === 0 && searchQuery.length >= 2 && (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-text-muted/20 mb-2">search_off</span>
                    <p className="text-text-muted text-sm italic">No encontramos lo que buscas hoy...</p>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-2 pb-4">
                  {searchResults.map(r => (
                    <div
                      key={r.slug}
                      onClick={() => navTo(`/producto/${r.slug}`)}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-beige-soft cursor-pointer group transition-all"
                    >
                      <div className="size-16 rounded-xl bg-white border border-border-light overflow-hidden p-2 flex-shrink-0">
                        {r.image && <img src={r.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt="" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors truncate">{r.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-text-muted mt-0.5">{r.category || ''}</p>
                      </div>
                      <div className="text-right">
                        {r.price && <span className="text-sm font-bold text-accent"> S/ {Number(r.price).toFixed(2)}</span>}
                        <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-all ml-2 text-sm translate-x-[-4px] group-hover:translate-x-0">arrow_forward</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeDrawer}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-serif text-lg font-bold text-accent">Menú</h3>
              <button onClick={closeDrawer}><span className="material-symbols-outlined">close</span></button>
            </div>
            <nav className="space-y-1">
              <a onClick={() => navTo('/')} className="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Inicio</a>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 pt-4 pb-2">Categorías</p>
              {categories.map(c => (
                <a
                  key={c.id}
                  onClick={() => navTo(`/categoria/${c.slug}`)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm hover:bg-background-soft cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base" style={{ color: c.color }}>{c.icon}</span> {c.name}
                </a>
              ))}
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-1">
                <a onClick={() => navTo('/novedades')} className="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Novedades</a>
                <a onClick={() => navTo('/ofertas')} className="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Ofertas</a>
                <a onClick={() => navTo('/nosotros')} className="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Nosotros</a>
                <a onClick={() => navTo('/contacto')} className="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Contacto</a>
              </div>
              <div className="mt-6">
                <a href="https://wa.me/51962810439" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 rounded-full transition-colors w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
    </>
  );
}
