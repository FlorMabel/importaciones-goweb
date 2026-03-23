import './style.css';
import { initRouter } from './router.js';
import { renderHeader, initHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { store } from './store.js';

// Toast notification system
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info';
  toast.innerHTML = `<span class="material-symbols-outlined text-base">${icon}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// Quick add to cart from product cards
window.quickAddToCart = async function(productId) {
  const { getProductById } = await import('./services/api.js');
  const product = await getProductById(productId);
  if (product) {
    store.addToCart(product.id, 1);
    window.showToast(`${product.name} agregado al carrito`);
  }
};

// Initialize app
async function initApp() {
  try {
    // Render header
    const headerEl = document.getElementById('app-header');
    if (headerEl) {
      headerEl.innerHTML = await renderHeader();
      initHeader();
    }

    // Render footer
    const footerEl = document.getElementById('app-footer');
    if (footerEl) {
      footerEl.innerHTML = renderFooter();
    }

    // Dark mode initialization
    if (store.isDarkMode()) {
      document.documentElement.classList.add('dark');
    }

    // Init router (handles first page render)
    initRouter();

  } catch (err) {
    console.error('App init error:', err);
    document.getElementById('app').innerHTML = `
      <div class="text-center py-20">
        <p class="text-red-500 mb-4">Error al iniciar la aplicación</p>
        <p class="text-text-muted text-sm">${err.message || ''}</p>
        <button onclick="location.reload()" class="mt-4 bg-primary text-white px-6 py-2 rounded-full text-sm font-bold">Reintentar</button>
      </div>`;
  }
}

// Start
initApp();
