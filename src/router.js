import { setHomeSeo, setCategorySeo, setProductSeo, setCartSeo, setNewArrivalsSeo, setDealsSeo, setAboutSeo, setContactSeo } from './seo.js';

let currentCleanup = null;

const LOADING_HTML = `
<div class="flex items-center justify-center min-h-[60vh]">
  <div class="flex flex-col items-center gap-4">
    <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    <p class="text-text-muted text-sm">Cargando...</p>
  </div>
</div>`;

export async function navigate(route, params = {}) {
  if (route === 'home') {
    window.location.hash = '#/';
  } else if (route === 'category') {
    window.location.hash = `#/categoria/${params.slug || ''}`;
  } else if (route === 'product') {
    window.location.hash = `#/producto/${params.slug || ''}`;
  } else if (route === 'cart') {
    window.location.hash = '#/carrito';
  } else if (route === 'checkout') {
    window.location.hash = '#/checkout';
  } else if (route === 'new-arrivals') {
    window.location.hash = '#/novedades';
  } else if (route === 'deals') {
    window.location.hash = '#/ofertas';
  } else if (route === 'about') {
    window.location.hash = '#/nosotros';
  } else if (route === 'contact') {
    window.location.hash = '#/contacto';
  }
}

// Make navigate globally available
window.navigate = navigate;

export function initRouter() {
  window.addEventListener('hashchange', () => handleRoute());
  handleRoute();
}

async function handleRoute() {
  const app = document.getElementById('app');
  const hash = window.location.hash || '#/';

  // Cleanup previous page
  if (currentCleanup) { currentCleanup(); currentCleanup = null; }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Show loading
  app.innerHTML = LOADING_HTML;

  try {
    const segments = hash.replace('#/', '').split('/');
    const route = segments[0] || '';
    const param = segments.slice(1).join('/');

    let pageModule, html;

    switch (route) {
      case '':
        pageModule = await import('./pages/Home.js');
        html = await pageModule.renderHome();
        setHomeSeo();
        break;
      case 'categoria':
        pageModule = await import('./pages/Category.js');
        html = await pageModule.renderCategory(param);
        break;
      case 'producto':
        pageModule = await import('./pages/Product.js');
        html = await pageModule.renderProduct(param);
        break;
      case 'carrito':
        pageModule = await import('./pages/Cart.js');
        html = await pageModule.renderCart();
        setCartSeo();
        break;
      case 'checkout':
        pageModule = await import('./pages/Checkout.js');
        html = await pageModule.renderCheckout();
        break;
      case 'novedades':
        pageModule = await import('./pages/NewArrivals.js');
        html = await pageModule.renderNewArrivals();
        setNewArrivalsSeo();
        break;
      case 'ofertas':
        pageModule = await import('./pages/Deals.js');
        html = await pageModule.renderDeals();
        setDealsSeo();
        break;
      case 'nosotros':
        pageModule = await import('./pages/About.js');
        html = await pageModule.renderAbout();
        setAboutSeo();
        break;
      case 'contacto':
        pageModule = await import('./pages/Contact.js');
        html = await pageModule.renderContact();
        setContactSeo();
        break;
      default:
        html = `<div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <span class="material-symbols-outlined text-6xl text-text-muted">search_off</span>
          <h2 class="text-2xl font-serif font-bold text-accent">Página no encontrada</h2>
          <button onclick="navigate('home')" class="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary-dark transition-colors">Volver al inicio</button>
        </div>`;
    }

    app.innerHTML = html;

    // Run page-specific init if defined
    if (pageModule?.init) {
      currentCleanup = pageModule.init();
    }

  } catch (err) {
    console.error('Router error:', err);
    app.innerHTML = `<div class="text-center py-20"><p class="text-red-500">Error al cargar la página</p></div>`;
  }
}
