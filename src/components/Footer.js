export function renderFooter() {
  return `
  <footer class="bg-[#3B2066] text-white">
    <!-- Trust Bar -->
    <div class="border-b border-white/10">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${[
            { icon: 'verified', title: 'Productos Originales', desc: '100% importados' },
            { icon: 'local_shipping', title: 'Envío Seguro', desc: 'A todo el Perú' },
            { icon: 'support_agent', title: 'Soporte WhatsApp', desc: 'Respuesta rápida' },
            { icon: 'thumb_up', title: 'Satisfacción', desc: 'Garantía total' },
          ].map(t => `
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-2xl">${t.icon}</span>
              <div>
                <p class="text-sm font-bold">${t.title}</p>
                <p class="text-xs text-white/60">${t.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img 
              src="https://res.cloudinary.com/dod8hhjoo/image/upload/v1774224726/goshopping/optimized/logo-768w.webp" 
              alt="GO SHOPPING" 
              class="h-12 w-auto object-contain"
            />
            <span class="font-serif text-xl font-bold text-white">SHOPPING</span>
          </div>
          <p class="text-white/60 text-sm leading-relaxed mb-4">Selección exclusiva de productos importados premium para los gustos más exigentes.</p>
          <div class="flex gap-3">
            <a href="https://www.facebook.com" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors text-sm">f</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors text-sm">ig</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors text-sm">tk</a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-bold text-sm uppercase tracking-wider mb-4">Navegación</h4>
          <ul class="space-y-2 text-sm text-white/60">
            <li><a onclick="navigate('home')" class="hover:text-primary cursor-pointer transition-colors">Inicio</a></li>
            <li><a onclick="navigate('new-arrivals')" class="hover:text-primary cursor-pointer transition-colors">Novedades</a></li>
            <li><a onclick="navigate('deals')" class="hover:text-primary cursor-pointer transition-colors">Ofertas</a></li>
            <li><a onclick="navigate('about')" class="hover:text-primary cursor-pointer transition-colors">Nosotros</a></li>
            <li><a onclick="navigate('contact')" class="hover:text-primary cursor-pointer transition-colors">Contacto</a></li>
          </ul>
        </div>

        <!-- Payments -->
        <div>
          <h4 class="font-bold text-sm uppercase tracking-wider mb-4">Métodos de Pago</h4>
          <ul class="space-y-2 text-sm text-white/60">
            <li class="flex items-center gap-2"><span class="text-primary">●</span> Yape</li>
            <li class="flex items-center gap-2"><span class="text-primary">●</span> Plin</li>
            <li class="flex items-center gap-2"><span class="text-primary">●</span> Transferencia Bancaria</li>
            <li class="flex items-center gap-2"><span class="text-primary">●</span> Depósito</li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
          <ul class="space-y-3 text-sm text-white/60">
            <li class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">phone</span> +51 962 810 439
            </li>
            <li class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">mail</span> ventas@goshopping.pe
            </li>
            <li class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-base">location_on</span> Lima, Perú
            </li>
          </ul>
          <a href="https://wa.me/51962810439" target="_blank" rel="noopener" class="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Escríbenos
          </a>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="border-t border-white/10 py-6">
      <div class="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
        <p>© ${new Date().getFullYear()} GO SHOPPING. Todos los derechos reservados. RUC: 20601880904</p>
        <div class="flex gap-6">
          <a class="hover:text-white/70 cursor-pointer">Términos</a>
          <a class="hover:text-white/70 cursor-pointer">Privacidad</a>
          <a class="hover:text-white/70 cursor-pointer">Devoluciones</a>
        </div>
      </div>
    </div>
  </footer>`;
}
