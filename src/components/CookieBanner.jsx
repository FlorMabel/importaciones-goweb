import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from '../context/CookieConsentContext';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const { showBanner, acceptAll, acceptSelected, decline } = useCookieConsent();
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [tempPrefs, setTempPrefs] = useState({ functional: false, analytics: false });
  const [expanded, setExpanded] = useState(null); // 'necessary', 'functional', 'analytics'

  if (!showBanner) return null;

  const categories = [
    {
      id: 'necessary',
      name: 'Estratégicas (Necesarias)',
      desc: 'Esenciales para el funcionamiento de la tienda, autenticación y seguridad. No pueden desactivarse.',
      locked: true,
      enabled: true
    },
    {
      id: 'functional',
      name: 'Experiencia (Funcionales)',
      desc: 'Permiten recordar tus preferencias y mantener productos en el carrito por más tiempo (30 días) mediante cookies.',
      locked: false,
      enabled: tempPrefs.functional
    },
    {
      id: 'analytics',
      name: 'Rendimiento (Analíticas)',
      desc: 'Nos ayudan a entender cómo interactúas con la tienda para mejorar tu experiencia de navegación.',
      locked: false,
      enabled: tempPrefs.analytics
    }
  ];

  const handleToggle = (id) => {
    if (id === 'necessary') return;
    setTempPrefs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-6 right-6 z-[100] w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-strong border border-border-light overflow-hidden p-6 md:p-8"
      >
        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">cookie</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-accent italic">Tu Privacidad</h3>
            </div>
          </div>

          {!isCustomizing ? (
            <>
              <p className="text-sm text-text-secondary leading-relaxed mb-8 font-light italic">
                Utilizamos cookies para elevar tu experiencia. Algunas son fundamentales para la tienda, mientras que otras nos ayudan a mejorar.
              </p>

              <div className="space-y-3">
                <button
                  onClick={acceptAll}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-glow flex items-center justify-center gap-2 group"
                >
                  Aceptar Todas
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">done_all</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsCustomizing(true)}
                    className="bg-white border border-border-light hover:border-accent text-accent font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                  >
                    Personalizar
                  </button>
                  <button
                    onClick={decline}
                    className="bg-beige-soft/50 hover:bg-beige-soft text-text-muted font-bold py-3.5 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                  >
                    Solo Esenciales
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3 bg-background-soft/50 rounded-3xl p-4 border border-border-light">
                {categories.map(cat => (
                  <div key={cat.id} className="border-b last:border-none border-border-light/40 pb-3 last:pb-0 pt-3 first:pt-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 cursor-pointer" onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}>
                        <h4 className="text-xs font-bold text-accent flex items-center gap-2">
                          {cat.name}
                          <span className={`material-symbols-outlined text-[14px] transition-transform ${expanded === cat.id ? 'rotate-180' : ''}`}>expand_more</span>
                        </h4>
                      </div>
                      
                      <button
                        disabled={cat.locked}
                        onClick={() => handleToggle(cat.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${cat.enabled ? 'bg-primary' : 'bg-gray-200'} ${cat.locked ? 'opacity-50 grayscale' : ''}`}
                      >
                        <motion.div
                          animate={{ x: cat.enabled ? 20 : 0 }}
                          className="absolute top-1 left-1 size-3 bg-white rounded-full shadow-sm"
                        />
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {expanded === cat.id && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="text-[11px] text-text-muted mt-2 leading-relaxed italic overflow-hidden"
                        >
                          {cat.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-accent transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={() => acceptSelected(tempPrefs)}
                  className="bg-accent text-white font-bold py-3 px-8 rounded-xl text-[10px] uppercase tracking-widest shadow-strong hover:bg-accent-dark transition-all"
                >
                  Guardar Preferencias
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-border-light text-center">
            <Link 
              to="/terminos-y-condiciones#privacidad" 
              className="text-[9px] text-text-muted font-bold uppercase tracking-widest hover:text-primary transition-colors underline underline-offset-4"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
