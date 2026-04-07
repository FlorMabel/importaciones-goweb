import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Nosotros | GO SHOPPING</title>
        <meta name="description" content="Conoce la historia y valores de GO SHOPPING, tu tienda premium de productos importados." />
      </Helmet>
      <section className="py-24 md:py-32 px-4 md:px-10 lg:px-20 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          {/* Main Info */}
          <div className="text-center mb-20 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[120px] font-serif font-black text-accent/5 select-none pointer-events-none">
              GO SHOPPING
            </div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block relative z-10"
            >
              Información de la Empresa
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl font-bold text-accent italic mb-8 relative z-10"
            >
              ¡Bienvenido!
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto p-10 bg-beige-soft/30 rounded-[3rem] border border-border-light relative z-10"
            >
              <h2 className="font-serif text-2xl font-bold text-accent mb-6">Acerca de Go Shopping</h2>
              <p className="text-text-secondary text-base leading-relaxed font-light italic">
                En Go Shopping, nos dedicamos a brindarle lo nuevo y más pedido por un mercado comercial cada vez más actualizado. Les ofrecemos productos de buena calidad; su satisfacción es lo primordial. Nuestra tienda se especializa en proporcionarle una gama diversa de artículos, desde productos básicos hasta opciones únicas y personalizadas.
              </p>
              <p className="text-text-secondary text-base leading-relaxed font-light italic mt-4">
                Disponible tanto para compras individuales como al por mayor, les garantizamos calidad y buen precio. En Go Shopping creemos en el crecimiento conjunto y el desarrollo sostenible de nuestros socios comerciales.
              </p>
            </motion.div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-10 bg-white rounded-[2.5rem] shadow-soft border border-border-light hover:border-primary/30 transition-all duration-500"
            >
              <div className="size-16 rounded-2xl bg-accent text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-3xl italic">rocket_launch</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-accent mb-4 italic">Nuestra Misión</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                Proporcionar productos de alta calidad a precios accesibles, mejorando la experiencia de compra en línea mediante un servicio al cliente excepcional y una plataforma intuitiva. Nos comprometemos a satisfacer las necesidades y deseos de nuestros clientes, ofreciendo una amplia gama de artículos cuidadosamente seleccionados del mercado internacional.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-10 bg-white rounded-[2.5rem] shadow-soft border border-border-light hover:border-primary/30 transition-all duration-500"
            >
              <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-3xl italic">visibility</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-accent mb-4 italic">Nuestra Visión</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                Convertirnos en la tienda en línea preferida a nivel nacional, reconocida por nuestra innovación constante, fiabilidad y compromiso con la satisfacción del cliente. Aspiramos a crecer y expandirnos con nuevas propuestas, sin perder nuestros valores de calidad, cercanía y excelencia en el servicio.
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: 'inventory_2', title: '300+ Productos', desc: 'Catálogo con más de 300 productos importados organizados en 9+ categorías exclusivas.' },
              { icon: 'public', title: 'Importación Directa', desc: 'Seleccionamos y traemos productos premium directamente de los mejores proveedores internacionales.' },
              { icon: 'favorite', title: 'Atención Personalizada', desc: 'Cada cliente es único. Nuestro equipo te asesora y acompaña en cada compra vía WhatsApp.' },
            ].map((item, idx) => (
              <motion.div 
                key={item.icon}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-8 bg-beige-soft/10 rounded-[2rem] border border-border-light hover:bg-white hover:shadow-strong transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-full bg-accent/5 flex items-center justify-center text-accent mx-auto mb-6">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-sm text-accent uppercase tracking-widest mb-3">{item.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-accent text-white rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 italic relative z-10">¿Por qué GO SHOPPING?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left max-w-4xl mx-auto relative z-10">
              {[
                { icon: 'verified', text: 'Productos 100% originales e importados' },
                { icon: 'local_shipping', text: 'Envío seguro a todo el Perú' },
                { icon: 'payments', text: 'Pago fácil con Yape, Plin o transferencia' },
                { icon: 'support_agent', text: 'Soporte directo por WhatsApp' },
                { icon: 'replay', text: 'Política de devolución flexible' },
                { icon: 'star', text: 'Miles de clientes satisfechos' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                  <span className="text-xs font-light text-white/90">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-32 pt-24 border-t border-border-light text-center">
            <span className="text-[12px] font-bold text-primary tracking-[0.5em] uppercase mb-6 block">Marco Legal</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-accent mb-10 italic tracking-tighter">Términos, Condiciones y Políticas</h2>
            <p className="text-base md:text-lg text-text-muted max-w-3xl mx-auto mb-16 leading-relaxed font-light">
              Cumplimos con toda la normativa legal vigente de la República del Perú. Importaciones Puno S.R.L. (RUC 20601880904) garantiza la transparencia y seguridad en cada una de sus transacciones.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link 
                to="/terminos-y-condiciones#terminos"
                className="inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-white text-[10px] font-bold py-5 px-12 rounded-full transition-all duration-500 shadow-soft uppercase tracking-[0.2em]"
              >
                Términos y Condiciones
                <span className="material-symbols-outlined text-sm italic">gavel</span>
              </Link>
              <Link 
                to="/terminos-y-condiciones#clausulas"
                className="inline-flex items-center gap-3 bg-white hover:bg-beige-soft text-accent border border-accent/20 text-[10px] font-bold py-5 px-12 rounded-full transition-all duration-500 shadow-soft uppercase tracking-[0.2em]"
              >
                Cláusulas Especiales
                <span className="material-symbols-outlined text-sm italic">shield</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
