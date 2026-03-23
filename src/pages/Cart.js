import { getProductsByIds } from '../services/api.js';
import { formatPrice } from '../utils.js';
import { store } from '../store.js';

export async function renderCart() {
  const cart = store.getCart();

  if (cart.length === 0) {
    return `
    <div class="max-w-[1280px] mx-auto px-4 lg:px-10 py-20 text-center">
      <span class="material-symbols-outlined text-6xl text-text-muted/30 mb-4">shopping_cart</span>
      <h2 class="text-2xl font-serif font-bold text-accent mb-2">Tu carrito está vacío</h2>
      <p class="text-text-muted text-sm mb-6">Descubre nuestros productos premium y agrega tus favoritos.</p>
      <button onclick="navigate('home')" class="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 px-8 rounded-full transition-colors">
        Explorar Productos
      </button>
    </div>`;
  }

  const uniqueIds = [...new Set(cart.map(i => i.id))];
  const products = await getProductsByIds(uniqueIds);
  const total = cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const shipping = total >= 150 ? 0 : 15;

  return `
  <div class="bg-background-soft min-h-[70vh]">
    <div class="max-w-[1280px] mx-auto px-4 lg:px-10 py-8 lg:py-12">
      <div class="mb-6">
        <h1 class="text-3xl md:text-4xl font-serif font-bold text-accent mb-2">Tu Carrito de Compras</h1>
        <nav class="flex items-center gap-2 text-text-muted text-xs">
          <a class="hover:text-accent cursor-pointer" onclick="navigate('home')">Inicio</a>
          <span>/</span>
          <span class="text-text-main font-bold">Carrito</span>
        </nav>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-8">
          <div class="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-gray-300 text-[10px] font-bold text-text-muted uppercase tracking-widest">
            <div class="col-span-6">PRODUCTO</div>
            <div class="col-span-2 text-center">PRECIO</div>
            <div class="col-span-2 text-center">CANTIDAD</div>
            <div class="col-span-2 text-right">TOTAL</div>
          </div>

          <div id="cart-items">
            ${cart.map(item => {
              const p = products.find(pr => pr.id === item.id);
              if (!p) return '';
              const itemTotal = p.price * item.qty;
              const cartKey = item.variant ? `${item.id}__${item.variant}` : item.id;
              return `
              <div class="py-5 border-b border-gray-200" data-cart-key="${cartKey}">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div class="col-span-1 md:col-span-6 flex gap-4 items-center">
                    <div class="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg bg-white border border-gray-200 overflow-hidden p-1 cursor-pointer" onclick="navigate('product', {slug:'${p.slug}'})">
                      <img src="${p.images?.[0] || ''}" class="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-bold text-text-main truncate">${p.name}</h3>
                      ${item.variant ? `<p class="text-xs text-accent font-medium">${item.variant}</p>` : ''}
                      <p class="text-xs text-text-muted">${p.category}</p>
                    </div>
                  </div>
                  <div class="col-span-1 md:col-span-2 text-left md:text-center">
                    <span class="text-sm font-bold text-text-main">${formatPrice(p.price)}</span>
                  </div>
                  <div class="col-span-1 md:col-span-2 flex items-center md:justify-center">
                    <div class="qty-selector px-1">
                      <button onclick="window.updateCartQty('${cartKey}', ${item.qty - 1})"><span class="material-symbols-outlined text-sm">remove</span></button>
                      <span class="qty-value">${item.qty}</span>
                      <button onclick="window.updateCartQty('${cartKey}', ${item.qty + 1})"><span class="material-symbols-outlined text-sm">add</span></button>
                    </div>
                  </div>
                  <div class="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
                    <span class="text-sm font-bold text-text-main">${formatPrice(itemTotal)}</span>
                    <button onclick="window.removeCartItem('${cartKey}')" class="ml-3 text-text-muted hover:text-red-500 transition-colors">
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-4">
          <div class="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
            <h3 class="font-serif text-xl font-bold text-accent mb-5">Resumen del Pedido</h3>
            <div class="space-y-3 text-sm mb-6">
              <div class="flex justify-between"><span class="text-text-muted">Subtotal</span><span class="font-bold">${formatPrice(total)}</span></div>
              <div class="flex justify-between">
                <span class="text-text-muted">Envío</span>
                <span class="font-bold ${shipping === 0 ? 'text-green-600' : ''}">${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span>
              </div>
              ${shipping > 0 ? `<p class="text-[10px] text-green-600">¡Envío gratis en compras mayores a S/ 150.00!</p>` : ''}
              <div class="border-t border-gray-200 pt-3 flex justify-between text-base">
                <span class="font-bold text-text-main">Total</span>
                <span class="font-bold text-accent text-lg">${formatPrice(total + shipping)}</span>
              </div>
            </div>
            <button onclick="navigate('checkout')" class="w-full bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2">
              Proceder al Pago <span class="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            <button onclick="navigate('home')" class="w-full mt-3 text-text-muted text-sm hover:text-accent transition-colors text-center py-2">
              ← Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

export function init() {
  window.updateCartQty = function(key, newQty) {
    if (newQty < 1) return;
    const parts = key.split('__');
    const id = parts[0];
    const variant = parts[1] || null;
    store.updateCartQuantity(id, newQty, variant);
    handleRoute();
  };

  window.removeCartItem = function(key) {
    const parts = key.split('__');
    const id = parts[0];
    const variant = parts[1] || null;
    store.removeFromCart(id, variant);
    // Re-render the cart
    import('./Cart.js').then(m => m.renderCart()).then(html => {
      document.getElementById('app').innerHTML = html;
      init();
    });
  };

  return () => {
    delete window.updateCartQty;
    delete window.removeCartItem;
  };
}
