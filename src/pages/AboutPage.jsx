import React from 'react';
import { Helmet } from 'react-helmet-async';

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
        </div>
      </section>
    </>
  );
}
