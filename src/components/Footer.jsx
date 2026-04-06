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
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://res.cloudinary.com/dod8hhjoo/image/upload/v1774224725/goshopping/optimized/logo-320w.webp" 
                alt="GO SHOPPING" 
                className="h-10 w-auto object-contain brightness-0 invert"
              />
              <span className="font-serif text-xl font-bold text-white tracking-widest">SHOPPING</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-8 font-light italic">
              "Importando piezas que transforman lo cotidiano en algo extraordinario."
            </p>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'tiktok'].map(social => (
                <a 
                  key={social}
                  href={`https://www.${social}.com`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="size-10 rounded-full border border-white/10 hover:border-primary hover:text-primary flex items-center justify-center transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <div className="size-4 bg-white/20 rounded-full group-hover:bg-primary transition-colors"></div>
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
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Métodos de Pago</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2"><span className="text-primary">●</span> Yape</li>
              <li className="flex items-center gap-2"><span className="text-primary">●</span> Plin</li>
              <li className="flex items-center gap-2"><span className="text-primary">●</span> Transferencia Bancaria</li>
              <li className="flex items-center gap-2"><span className="text-primary">●</span> Depósito</li>
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
      <div className="border-t border-white/10 py-6">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} GO SHOPPING. Todos los derechos reservados. RUC: 20601880904</p>
          <div className="flex items-center gap-6">
            <Link to="/terminos-y-condiciones#terminos" className="hover:text-white/70 transition-colors">Términos</Link>
            <Link to="/terminos-y-condiciones#clausulas" className="hover:text-white/70 transition-colors">Cláusulas</Link>
            <Link to="/terminos-y-condiciones#privacidad" className="hover:text-white/70 transition-colors">Privacidad</Link>
            <Link to="/terminos-y-condiciones#devoluciones" className="hover:text-white/70 transition-colors">Devoluciones</Link>

          </div>
        </div>
      </div>
    </footer>
  );
}
