  import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-accent-dark text-white pt-16">
      {/* Luxury Trust Bar */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: 'verified', title: 'AUTENTICIDAD', desc: '100% Importados' },
            { icon: 'local_shipping', title: 'TRANSPORTE', desc: 'Envío Asegurado' },
            { icon: 'support_agent', title: 'ATENCIÓN', desc: 'Soporte 24/7' },
            { icon: 'history_edu', title: 'GARANTÍA', desc: 'Total' },
          ].map((t, i) => (
            <div key={t.icon} className="flex flex-col items-center md:items-start gap-4 text-center md:text-left group cursor-default">
              <div className="size-12 rounded-full border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary transition-all duration-500">
                <span className="material-symbols-outlined text-2xl">{t.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1">{t.title}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="https://res.cloudinary.com/dod8hhjoo/image/upload/v1774224726/goshopping/optimized/logo-768w.webp" 
                alt="GO" 
                className="h-10 w-auto object-contain transition-all duration-500 group-hover:scale-105"
              />
              <span className="font-serif text-2xl font-medium tracking-widest text-white leading-none">SHOPPING</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-10 font-light italic max-w-xs">
              "Importando piezas exclusivas que transforman lo cotidiano en una experiencia extraordinaria."
            </p>
            <div className="flex gap-4">
              {[
                { id: 'facebook', icon: <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>, url: 'https://www.facebook.com/share/1EM7tnVp3v/' },
                { id: 'instagram', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.01 4.01 0 110-8.019 4.01 4.01 0 010 8.019zm7.846-10.405a1.441 1.441 0 11-2.881 0 1.441 1.441 0 012.881 0z"/>, url: 'https://www.instagram.com/goshopping.oficial' },
                { id: 'tiktok', icon: <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1 .05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/>, url: 'https://www.tiktok.com/@goshoppin?_r=1&_t=ZS-95KFcvYMToq' }
              ].map(social => (
                <a 
                  key={social.id}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="size-10 rounded-full border border-white/10 hover:border-primary hover:text-white flex items-center justify-center transition-all duration-300 group"
                >
                  <span className="sr-only">{social.id}</span>
                  <svg className="size-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/novedades" className="hover:text-primary transition-colors">Novedades</Link></li>
              <li><Link to="/ofertas" className="hover:text-primary transition-colors">Ofertas</Link></li>
              <li>
                <Link to="/nosotros" className="hover:text-primary transition-colors">Nosotros</Link>
                {/* Sub-enlaces eliminados según solicitud */}
              </li>
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/seguimiento" className="hover:text-primary transition-colors">Seguimiento de Pedido</Link></li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Métodos de Pago</h4>
            <ul className="space-y-4 text-xs font-medium text-white/50 uppercase tracking-[0.2em]">
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(201,163,79,0.5)]"></span>
                Yape
              </li>
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(201,163,79,0.5)]"></span>
                Plin
              </li>
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(201,163,79,0.5)]"></span>
                Transferencia Bancaria
              </li>
              <li className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(201,163,79,0.5)]"></span>
                Depósito
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">phone</span> +51 962 810 439
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">mail</span> imporpuno@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">location_on</span> Puno, Perú
              </li>
            </ul>
            <a href="https://wa.me/51962810439" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Escríbenos
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-[11px] text-white/30 uppercase tracking-[0.3em] font-medium">&copy; {new Date().getFullYear()} GO SHOPPING Store. Todos los derechos reservados.</p>
            <p className="text-[10px] text-white/20 mt-1 uppercase tracking-widest">Importaciones Puno S.R.L. | RUC 20601880904</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            <Link to="/terminos-y-condiciones#terminos" className="text-[11px] text-white/40 hover:text-primary transition-all uppercase tracking-widest font-semibold">Términos</Link>
            <Link to="/terminos-y-condiciones#clausulas" className="text-[11px] text-white/40 hover:text-primary transition-all uppercase tracking-widest font-semibold">Cláusulas</Link>
            <Link to="/terminos-y-condiciones#privacidad" className="text-[11px] text-white/40 hover:text-primary transition-all uppercase tracking-widest font-semibold">Privacidad</Link>
            <Link to="/terminos-y-condiciones#devoluciones" className="text-[11px] text-white/40 hover:text-primary transition-all uppercase tracking-widest font-semibold">Devoluciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
