import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contacto | GO SHOPPING</title>
        <meta name="description" content="Contáctanos por WhatsApp. Atención personalizada y rápida." />
      </Helmet>
      <section className="py-20 px-4 md:px-10 lg:px-20 min-h-[70vh] flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-3 block">¿NECESITAS AYUDA?</span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-accent mb-6">Contáctanos</h1>
            <p className="text-text-muted text-lg max-w-xl mx-auto font-light">
              Estamos listos para atenderte. La forma más rápida de obtener respuesta es a través de nuestro canal de WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Contact Info Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-soft flex flex-col justify-center">
              <h3 className="font-bold text-xl text-accent mb-8">Información Real</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 transition-transform group-hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Escríbenos</p>
                    <a href="https://wa.me/51962810439" target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-accent hover:text-primary transition-colors">+51 962 810 439</a>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-2xl">mail</span>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Email</p>
                    <p className="text-lg font-bold text-accent">imporpuno@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-2xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-1">Horario VIP</p>
                    <p className="text-lg font-bold text-accent">Lun - Sáb: 9:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col gap-6">
              <div className="bg-accent rounded-[2.5rem] p-8 md:p-12 text-white flex-1 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">¿Preguntas sobre un pedido?</h3>
                  <p className="text-white/70 font-light mb-8">Nuestro equipo de atención al cliente está listo para ayudarte con el seguimiento de tu compra o cualquier duda técnica.</p>
                </div>

                <a
                  href={`https://wa.me/51962810439?text=${encodeURIComponent('Hola! Tengo una consulta sobre GO SHOPPING')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 flex items-center justify-center gap-3 bg-white text-accent hover:bg-primary hover:text-white text-base font-bold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chatear por WhatsApp
                </a>
              </div>

              <div className="bg-beige-soft/30 rounded-[2rem] p-6 border border-border-light/40 flex items-center justify-between">
                <span className="text-xs font-bold text-accent uppercase tracking-widest">¿Ya tienes un pedido?</span>
                <button 
                   onClick={() => window.location.href = '/seguimiento'}
                   className="text-xs font-bold text-primary hover:underline"
                >
                  Rastrear mi pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
