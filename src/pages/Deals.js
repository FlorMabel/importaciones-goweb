import { getDeals } from '../services/api.js';
import { formatPrice } from '../utils.js';
import { renderStars } from './Home.js';

export async function renderDeals() {
  const products = await getDeals();

  return `
  <section class="py-12 px-4 md:px-10 lg:px-20">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-10">
        <span class="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">OFERTAS ESPECIALES</span>
        <h1 class="font-serif text-4xl font-bold text-accent mb-2">Ofertas</h1>
        <p class="text-text-muted text-sm max-w-md mx-auto">Aprovecha los mejores precios en productos premium importados.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        ${products.map((p, i) => `
          <div class="product-card bg-white border border-gray-100 flex flex-col stagger-card" style="animation-delay:${i*0.04}s">
            <div class="image-container relative bg-gray-50 cursor-pointer" onclick="navigate('product', {slug:'${p.slug}'})">
              ${p.badge ? `<span class="variant-badge ${p.badgeColor || ''}">${p.badge}</span>` : ''}
              ${p.salePercent ? `<span class="absolute top-3 right-3 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">-${p.salePercent}%</span>` : ''}
              <img src="${p.images?.[0] || ''}" alt="${p.name}" loading="lazy" />
              <button onclick="event.stopPropagation(); window.quickAddToCart('${p.id}')" class="add-btn"><span class="material-symbols-outlined text-base">add_shopping_cart</span></button>
            </div>
            <div class="p-4 flex flex-col flex-1">
              <p class="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">${p.category || ''}</p>
              <h3 class="text-sm font-bold text-text-main mb-1 line-clamp-2">${p.name}</h3>
              <div class="flex items-center gap-1 mb-2">${renderStars(p.rating)}<span class="text-[10px] text-text-muted">(${p.reviews || 0})</span></div>
              <div class="mt-auto flex items-center gap-2">
                <span class="text-sm font-bold text-accent">${formatPrice(p.price)}</span>
                ${p.oldPrice ? `<span class="text-xs text-text-muted line-through">${formatPrice(p.oldPrice)}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>`;
}
