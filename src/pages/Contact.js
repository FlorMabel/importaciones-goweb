export function renderContact() {
  return `
  <section class="py-16 px-4 md:px-10 lg:px-20">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">ESCRÍBENOS</span>
        <h1 class="font-serif text-4xl md:text-5xl font-bold text-accent mb-4">Contacto</h1>
        <p class="text-text-muted text-base max-w-lg mx-auto">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 class="font-bold text-base text-accent mb-4">Información de Contacto</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#16a34a"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <p class="text-xs text-text-muted">WhatsApp</p>
                  <a href="https://wa.me/51962810439" target="_blank" rel="noopener" class="text-sm font-bold text-text-main hover:text-accent">+51 962 810 439</a>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-accent text-lg">mail</span>
                </div>
                <div>
                  <p class="text-xs text-text-muted">Email</p>
                  <p class="text-sm font-bold text-text-main">ventas@goshopping.pe</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-accent text-lg">schedule</span>
                </div>
                <div>
                  <p class="text-xs text-text-muted">Horario</p>
                  <p class="text-sm font-bold text-text-main">Lun - Sáb: 9:00 - 20:00</p>
                </div>
              </div>
            </div>
          </div>

          <a href="https://wa.me/51962810439?text=${encodeURIComponent('Hola! Tengo una consulta sobre GO SHOPPING')}" target="_blank" rel="noopener" class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-4 px-6 rounded-full transition-colors w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chatear por WhatsApp
          </a>

          <!-- FAQ -->
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 class="font-bold text-base text-accent mb-4">Preguntas Frecuentes</h3>
            <div class="space-y-3">
              ${[
                { q: '¿Cuánto tarda el envío?', a: 'Lima: 1-2 días hábiles. Provincia: 3-5 días hábiles.' },
                { q: '¿Los productos son originales?', a: 'Sí, todos nuestros productos son 100% originales e importados con garantía.' },
                { q: '¿Puedo devolver un producto?', a: 'Sí, tienes 7 días para solicitar devolución si el producto presenta algún defecto.' },
              ].map(item => `
                <details class="group border-b border-gray-100 pb-3">
                  <summary class="flex justify-between items-center cursor-pointer text-sm font-medium text-text-main list-none">
                    ${item.q}
                    <span class="material-symbols-outlined text-base transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <p class="text-xs text-text-muted mt-2 leading-relaxed">${item.a}</p>
                </details>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 h-fit">
          <h3 class="font-bold text-base text-accent mb-4">Envíanos un Mensaje</h3>
          <form class="space-y-4" onsubmit="event.preventDefault(); window.showToast('¡Mensaje enviado! Te responderemos pronto.')">
            <div>
              <label class="block text-xs font-bold text-text-main mb-1">Nombre</label>
              <input type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="Tu nombre" />
            </div>
            <div>
              <label class="block text-xs font-bold text-text-main mb-1">Email</label>
              <input type="email" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="tucorreo@email.com" />
            </div>
            <div>
              <label class="block text-xs font-bold text-text-main mb-1">Mensaje</label>
              <textarea required rows="4" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button type="submit" class="w-full bg-accent hover:bg-accent-dark text-white text-sm font-bold py-3.5 rounded-full transition-colors">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>`;
}
