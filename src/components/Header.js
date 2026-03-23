import { getCategories, searchProducts } from '../services/api.js';
import { store } from '../store.js';
import { debounce } from '../utils.js';

export async function renderHeader() {
  const categories = await getCategories();

  const catMenuItems = categories.map(c => `
    <a onclick="navigate('category', {slug:'${c.slug}'})" class="flex items-center gap-3 p-3 rounded-xl hover:bg-background-soft cursor-pointer transition-colors group/item">
      <span class="material-symbols-outlined text-lg" style="color:${c.color}">${c.icon}</span>
      <div>
        <p class="text-sm font-bold text-text-main group-hover/item:text-accent transition-colors">${c.name}</p>
        <p class="text-[11px] text-text-muted line-clamp-1">${c.description}</p>
      </div>
    </a>
  `).join('');

  const cartCount = store.getCartCount();
  const badgeHtml = cartCount > 0
    ? `<span id="cart-badge" class="absolute -top-1 -right-2 size-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">${cartCount}</span>`
    : `<span id="cart-badge" class="absolute -top-1 -right-2 size-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center hidden">0</span>`;

  return `
  <header class="glass-header sticky top-0 z-50 w-full border-b border-gray-100 transition-all duration-300">
    <div class="mx-auto max-w-[1440px] px-4 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
      <div class="flex items-center gap-2 cursor-pointer" onclick="navigate('home')">
        <span class="material-symbols-outlined text-2xl text-primary">diamond</span>
        <h2 class="text-text-main font-serif text-lg lg:text-xl font-bold tracking-tight">GO SHOPPING</h2>
      </div>

      <nav class="hidden lg:flex items-center gap-8">
        <a class="text-text-main hover:text-accent transition-colors text-sm font-medium cursor-pointer" onclick="navigate('home')">Inicio</a>
        <div class="relative group" id="mega-menu-trigger">
          <a class="text-text-main hover:text-accent transition-colors text-sm font-medium cursor-pointer flex items-center gap-1">
            Tienda <span class="material-symbols-outlined text-sm">expand_more</span>
          </a>
          <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-[380px] grid grid-cols-1 gap-1">
              ${catMenuItems}
            </div>
          </div>
        </div>
        <a class="text-text-main hover:text-accent transition-colors text-sm font-medium cursor-pointer" onclick="navigate('new-arrivals')">Novedades</a>
        <a class="text-text-main hover:text-accent transition-colors text-sm font-medium cursor-pointer" onclick="navigate('about')">Nosotros</a>
        <a class="text-text-main hover:text-accent transition-colors text-sm font-medium cursor-pointer" onclick="navigate('contact')">Contacto</a>
      </nav>

      <div class="flex items-center gap-3 lg:gap-5">
        <button id="search-toggle" class="text-text-main hover:text-accent transition-colors">
          <span class="material-symbols-outlined text-[22px]">search</span>
        </button>
        <button onclick="navigate('cart')" class="text-text-main hover:text-accent transition-colors relative">
          <span class="material-symbols-outlined text-[22px]">shopping_bag</span>
          ${badgeHtml}
        </button>
        <button id="mobile-menu-toggle" class="lg:hidden text-text-main">
          <span class="material-symbols-outlined text-[24px]">menu</span>
        </button>
      </div>
    </div>

    <!-- Search Overlay -->
    <div id="search-overlay" class="hidden fixed inset-0 bg-black/40 z-[60]" onclick="closeSearch()">
      <div class="bg-white w-full max-w-2xl mx-auto mt-20 rounded-2xl shadow-2xl p-6" onclick="event.stopPropagation()">
        <div class="flex items-center gap-3 border-b border-gray-200 pb-4">
          <span class="material-symbols-outlined text-text-muted">search</span>
          <input id="search-input" type="text" placeholder="Buscar productos..." class="flex-1 border-none text-lg focus:ring-0 placeholder:text-text-muted/60" autofocus />
          <button onclick="closeSearch()" class="text-text-muted hover:text-text-main"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div id="search-results" class="mt-4 max-h-80 overflow-y-auto space-y-2"></div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobile-drawer" class="hidden fixed inset-0 z-[60] lg:hidden">
      <div class="absolute inset-0 bg-black/40" onclick="closeMobileMenu()"></div>
      <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-serif text-lg font-bold text-accent">Menú</h3>
          <button onclick="closeMobileMenu()"><span class="material-symbols-outlined">close</span></button>
        </div>
        <nav class="space-y-1">
          <a onclick="navigate('home'); closeMobileMenu()" class="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Inicio</a>
          <p class="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 pt-4 pb-2">Categorías</p>
          ${categories.map(c => `
            <a onclick="navigate('category', {slug:'${c.slug}'}); closeMobileMenu()" class="flex items-center gap-3 py-3 px-4 rounded-xl text-sm hover:bg-background-soft cursor-pointer">
              <span class="material-symbols-outlined text-base" style="color:${c.color}">${c.icon}</span> ${c.name}
            </a>
          `).join('')}
          <div class="border-t border-gray-100 mt-4 pt-4 space-y-1">
            <a onclick="navigate('new-arrivals'); closeMobileMenu()" class="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Novedades</a>
            <a onclick="navigate('deals'); closeMobileMenu()" class="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Ofertas</a>
            <a onclick="navigate('about'); closeMobileMenu()" class="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Nosotros</a>
            <a onclick="navigate('contact'); closeMobileMenu()" class="block py-3 px-4 rounded-xl text-sm font-medium hover:bg-background-soft cursor-pointer">Contacto</a>
          </div>
          <div class="mt-6">
            <a href="https://wa.me/51962810439" target="_blank" rel="noopener" class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 rounded-full transition-colors w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </div>
  </header>`;
}

export function initHeader() {
  // Search toggle
  document.getElementById('search-toggle')?.addEventListener('click', () => {
    document.getElementById('search-overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('search-input')?.focus(), 100);
  });

  // Mobile menu toggle
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    document.getElementById('mobile-drawer').classList.remove('hidden');
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
      const query = e.target.value;
      const resultsDiv = document.getElementById('search-results');
      if (!query || query.length < 2) { resultsDiv.innerHTML = ''; return; }
      const results = await searchProducts(query);
      if (results.length === 0) {
        resultsDiv.innerHTML = '<p class="text-text-muted text-sm py-4 text-center">No se encontraron resultados</p>';
        return;
      }
      resultsDiv.innerHTML = results.map(r => `
        <a onclick="navigate('product', {slug:'${r.slug}'}); closeSearch()" class="flex items-center gap-3 p-3 rounded-xl hover:bg-background-soft cursor-pointer">
          ${r.image ? `<img src="${r.image}" class="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1" />` : ''}
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-main truncate">${r.name}</p>
            <p class="text-xs text-text-muted">${r.category || ''}</p>
          </div>
          ${r.price ? `<span class="text-sm font-bold text-accent">S/ ${Number(r.price).toFixed(2)}</span>` : ''}
        </a>
      `).join('');
    }, 250));
  }

  // Cart badge updates
  store.on('cart:changed', updateCartBadge);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = store.getCartCount();
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

window.closeSearch = function() {
  document.getElementById('search-overlay')?.classList.add('hidden');
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  document.getElementById('search-results').innerHTML = '';
};

window.closeMobileMenu = function() {
  document.getElementById('mobile-drawer')?.classList.add('hidden');
};
