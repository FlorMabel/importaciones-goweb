export function renderAbout() {
  return `
  <section class="py-16 px-4 md:px-10 lg:px-20">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">NUESTRA HISTORIA</span>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-accent mb-4">Nosotros</h1>
        <p class="text-text-muted text-base max-w-2xl mx-auto leading-relaxed">
          GO SHOPPING nació de la pasión por traer productos únicos e importados directamente a tu puerta. 
          Somos una boutique digital peruana que selecciona cuidadosamente cada artículo para ofrecer calidad, estilo y exclusividad.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        ${[
          { icon: 'diamond', title: '300+ Productos', desc: 'Catálogo con más de 200 productos importados organizados en 9+ categorías exclusivas.' },
          { icon: 'public', title: 'Importación Directa', desc: 'Seleccionamos y traemos productos premium directamente de los mejores proveedores internacionales.' },
          { icon: 'favorite', title: 'Atención Personalizada', desc: 'Cada cliente es único. Nuestro equipo te asesora y acompaña en cada compra vía WhatsApp.' },
        ].map(item => `
          <div class="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div class="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
              <span class="material-symbols-outlined text-2xl">${item.icon}</span>
            </div>
            <h3 class="font-bold text-base text-accent mb-2">${item.title}</h3>
            <p class="text-text-muted text-sm leading-relaxed">${item.desc}</p>
          </div>
        `).join('')}
      </div>

      <div class="bg-background-soft rounded-2xl p-8 md:p-12 text-center">
        <h2 class="font-serif text-2xl font-bold text-accent mb-4">¿Por qué GO SHOPPING?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
          ${[
            { icon: 'verified', text: 'Productos 100% originales e importados' },
            { icon: 'local_shipping', text: 'Envío seguro a todo el Perú' },
            { icon: 'payments', text: 'Pago fácil con Yape, Plin o transferencia' },
            { icon: 'support_agent', text: 'Soporte directo por WhatsApp' },
            { icon: 'replay', text: 'Política de devolución flexible' },
            { icon: 'star', text: 'Miles de clientes satisfechos' },
          ].map(item => `
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">${item.icon}</span>
              <span class="text-sm text-text-main">${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>`;
}
