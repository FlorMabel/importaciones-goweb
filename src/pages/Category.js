import { getProductsByCategory, getCategoryById } from '../services/api.js';
import { setCategorySeo } from '../seo.js';
import { formatPrice } from '../utils.js';
import { store } from '../store.js';
import { renderStars } from './Home.js';

export async function renderCategory(slug) {
  if (!slug) {
    // Show all categories overview
    const { getCategories } = await import('../services/api.js');
    const cats = await getCategories();
    setCategorySeo({ name: 'Tienda', description: 'Explora todas nuestras categorías de productos premium importados.' });
    return `
    <section class="py-12 px-6 md:px-10 lg:px-20">
      <div class="max-w-7xl mx-auto">
        <h1 class="font-serif text-4xl font-bold text-accent mb-2">Tienda</h1>
        <p class="text-text-muted text-sm mb-8">Explora todas nuestras categorías de productos premium importados.</p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          ${cats.map(c => `
            <div onclick="navigate('category', {slug:'${c.slug}'})" class="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-sm">
              <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style="background-image: url('${c.image}');"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-5 w-full">
                <span class="material-symbols-outlined text-white text-xl mb-1" style="">${c.icon}</span>
                <h3 class="text-white font-serif text-lg font-medium">${c.name}</h3>
                <p class="text-white/60 text-xs mt-1">${c.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  const [category, products] = await Promise.all([
    getCategoryById(slug),
    getProductsByCategory(slug)
  ]);

  if (!category) {
    return `<div class="text-center py-20"><h2 class="text-2xl font-serif text-accent">Categoría no encontrada</h2>
      <button onclick="navigate('home')" class="mt-4 text-primary font-bold text-sm">Volver al inicio</button></div>`;
  }

  setCategorySeo(category);

  return `
  <!-- Hero Banner -->
  <section class="relative h-[220px] md:h-[280px] w-full bg-cover bg-center flex items-center justify-center" style="background-image: url('${category.heroImage || category.image}');">
    <div class="absolute inset-0 bg-black/45"></div>
    <div class="relative z-10 text-center text-white px-4">
      <p class="text-xs font-bold tracking-[0.2em] uppercase mb-3">COLECCIÓN EXCLUSIVA</p>
      <h1 class="font-serif text-4xl md:text-5xl font-medium mb-2">${category.name}</h1>
      <p class="max-w-md mx-auto text-white/80 font-light text-sm">${category.description}</p>
    </div>
  </section>

  <!-- Product Grid -->
  <div class="mx-auto max-w-[1440px] px-4 lg:px-12 py-8">
    <nav class="flex items-center text-xs text-text-muted mb-8">
      <a class="hover:text-primary cursor-pointer" onclick="navigate('home')">Inicio</a>
      <span class="mx-2">/</span>
      <span class="text-accent font-medium">${category.name}</span>
    </nav>

    <div class="flex items-center justify-between mb-6 text-sm">
      <span class="text-text-muted">${products.length} productos</span>
      <select id="sort-select" class="bg-transparent border border-gray-200 rounded-lg font-medium text-text-main text-sm py-2 px-3 focus:ring-1 focus:ring-accent cursor-pointer">
        <option value="default">Más vendidos</option>
        <option value="price-asc">Precio: Menor a Mayor</option>
        <option value="price-desc">Precio: Mayor a Menor</option>
        <option value="rating">Mejor valorados</option>
      </select>
    </div>

    <div id="products-grid" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      ${products.map((p, i) => renderCategoryCard(p, i)).join('')}
    </div>
  </div>`;
}

function renderCategoryCard(p, i = 0) {
  return `
  <div class="product-card bg-white border border-gray-100 flex flex-col stagger-card" style="animation-delay:${i * 0.04}s">
    <div class="image-container relative bg-gray-50 cursor-pointer" onclick="navigate('product', {slug:'${p.slug}'})">
      ${p.badge ? `<span class="variant-badge ${p.badgeColor || ''}">${p.badge}</span>` : ''}
      <img src="${p.images?.[0] || ''}" alt="${p.name}" loading="lazy" />
      <button onclick="event.stopPropagation(); window.quickAddToCart('${p.id}')" class="add-btn" title="Agregar al carrito">
        <span class="material-symbols-outlined text-base">add_shopping_cart</span>
      </button>
    </div>
    <div class="p-4 flex flex-col flex-1">
      <h3 class="text-sm font-bold text-text-main mb-1 line-clamp-2 cursor-pointer hover:text-accent" onclick="navigate('product', {slug:'${p.slug}'})">${p.name}</h3>
      <div class="flex items-center gap-1 mb-2">
        ${renderStars(p.rating)}
        <span class="text-[10px] text-text-muted">(${p.reviews || 0})</span>
      </div>
      <div class="mt-auto flex items-center gap-2">
        <span class="text-sm font-bold text-accent">${formatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="text-xs text-text-muted line-through">${formatPrice(p.oldPrice)}</span>` : ''}
      </div>
    </div>
  </div>`;
}

export function init() {
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const grid = document.getElementById('products-grid');
      if (!grid) return;
      const cards = [...grid.children];
      const getValue = (card) => {
        const priceEl = card.querySelector('.text-accent.font-bold');
        return priceEl ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, '')) : 0;
      };
      const getRating = (card) => {
        const stars = card.querySelectorAll('.material-symbols-outlined.text-primary');
        return stars.length;
      };
      switch (sortSelect.value) {
        case 'price-asc': cards.sort((a, b) => getValue(a) - getValue(b)); break;
        case 'price-desc': cards.sort((a, b) => getValue(b) - getValue(a)); break;
        case 'rating': cards.sort((a, b) => getRating(b) - getRating(a)); break;
      }
      cards.forEach(c => grid.appendChild(c));
    });
  }
}
