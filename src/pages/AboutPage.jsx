import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Nosotros | GO SHOPPING</title>
        <meta name="description" content="Conoce la historia y valores de GO SHOPPING, tu tienda premium de productos importados." />
      </Helmet>
      <section className="py-16 px-4 md:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">NUESTRA HISTORIA</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-accent mb-4">Nosotros</h1>
            <p className="text-text-muted text-base max-w-2xl mx-auto leading-relaxed">
              GO SHOPPING nació de la pasión por traer productos únicos e importados directamente a tu puerta. 
              Somos una boutique digital peruana que selecciona cuidadosamente cada artículo para ofrecer calidad, estilo y exclusividad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: 'inventory_2', title: '300+ Productos', desc: 'Catálogo con más de 300 productos importados organizados en 9+ categorías exclusivas.' },
              { icon: 'public', title: 'Importación Directa', desc: 'Seleccionamos y traemos productos premium directamente de los mejores proveedores internacionales.' },
              { icon: 'favorite', title: 'Atención Personalizada', desc: 'Cada cliente es único. Nuestro equipo te asesora y acompaña en cada compra vía WhatsApp.' },
            ].map(item => (
              <div key={item.icon} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-base text-accent mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-background-soft rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl font-bold text-accent mb-4">¿Por qué GO SHOPPING?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
              {[
                { icon: 'verified', text: 'Productos 100% originales e importados' },
                { icon: 'local_shipping', text: 'Envío seguro a todo el Perú' },
                { icon: 'payments', text: 'Pago fácil con Yape, Plin o transferencia' },
                { icon: 'support_agent', text: 'Soporte directo por WhatsApp' },
                { icon: 'replay', text: 'Política de devolución flexible' },
                { icon: 'star', text: 'Miles de clientes satisfechos' },
              ].map(item => (
                <div key={item.icon} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">{item.icon}</span>
                  <span className="text-sm text-text-main">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-20 pt-16 border-t border-border-light text-center">
            <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase mb-4 block">Marco Legal</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-accent mb-6 italic">Términos, Condiciones y Políticas</h2>
            <p className="text-sm text-text-muted max-w-2xl mx-auto mb-8 leading-relaxed">
              Cumplimos con toda la normativa legal vigente de la República del Perú. Importaciones Puno S.R.L. (RUC 20601880904) garantiza la transparencia y seguridad en cada una de sus transacciones.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                to="/terminos-y-condiciones#terminos"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-xs font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-soft uppercase tracking-widest"
              >
                Términos y Condiciones
                <span className="material-symbols-outlined text-sm">gavel</span>
              </Link>
              <Link 
                to="/terminos-y-condiciones#clausulas"
                className="inline-flex items-center gap-2 bg-white hover:bg-beige-soft text-accent border border-accent/20 text-xs font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-soft uppercase tracking-widest"
              >
                Cláusulas Especiales
                <span className="material-symbols-outlined text-sm">shield</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
