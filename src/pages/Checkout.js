import { getProductsByIds } from '../services/api.js';
import { formatPrice, sanitize } from '../utils.js';
import { store } from '../store.js';

const DEPARTAMENTOS = [
  'Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco',
  'Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto',
  'Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali'
];

export async function renderCheckout() {
  const cart = store.getCart();
  if (cart.length === 0) {
    return `
    <div class="text-center py-20">
      <h2 class="text-2xl font-serif text-accent mb-4">No hay productos en el carrito</h2>
      <button onclick="navigate('home')" class="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold">Ir a la tienda</button>
    </div>`;
  }

  const uniqueIds = [...new Set(cart.map(i => i.id))];
  const products = await getProductsByIds(uniqueIds);

  const total = cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
  const shipping = total >= 150 ? 0 : 15;
  const grandTotal = total + shipping;

  return `
  <div class="max-w-[1280px] mx-auto px-4 lg:px-10 py-8 lg:py-12">
    <h1 class="text-3xl font-serif font-bold text-accent mb-8">Checkout</h1>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Form -->
      <div class="lg:col-span-7">
        <form id="checkout-form" class="space-y-6">
          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 class="font-bold text-lg text-accent mb-4">Datos de Envío</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-text-main mb-1">Nombre completo *</label>
                <input id="ck-name" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="Tu nombre" />
              </div>
              <div>
                <label class="block text-xs font-bold text-text-main mb-1">Teléfono *</label>
                <input id="ck-phone" type="tel" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="+51 999 999 999" />
              </div>
              <div>
                <label class="block text-xs font-bold text-text-main mb-1">Departamento *</label>
                <select id="ck-dept" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent">
                  <option value="">Seleccionar</option>
                  ${DEPARTAMENTOS.map(d => `<option value="${d}">${d}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-text-main mb-1">Ciudad / Distrito *</label>
                <input id="ck-city" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="Tu distrito" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-text-main mb-1">Dirección *</label>
                <input id="ck-address" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-accent focus:border-accent" placeholder="Av./Jr./Calle, número, referencia" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 class="font-bold text-lg text-accent mb-4">Método de Pago</h3>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center gap-3 p-4 rounded-xl border-2 border-accent bg-accent/5 cursor-pointer">
                <input type="radio" name="payment" value="yape" checked class="text-accent focus:ring-accent" />
                <div>
                  <p class="text-sm font-bold text-accent">Yape</p>
                  <p class="text-[10px] text-text-muted">Pago instantáneo</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-accent cursor-pointer">
                <input type="radio" name="payment" value="plin" class="text-accent focus:ring-accent" />
                <div>
                  <p class="text-sm font-bold">Plin</p>
                  <p class="text-[10px] text-text-muted">Pago rápido</p>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Confirmar Pedido por WhatsApp (${formatPrice(grandTotal)})
          </button>
        </form>
      </div>

      <!-- Summary -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
          <h3 class="font-serif text-lg font-bold text-accent mb-4">Tu Pedido</h3>
          <div class="space-y-3 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar">
            ${cart.map(item => {
              const p = products.find(pr => pr.id === item.id);
              if (!p) return '';
              return `
              <div class="flex items-center gap-3 py-2">
                <div class="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 p-1">
                  <img src="${p.images?.[0] || ''}" class="w-full h-full object-contain" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-text-main truncate">${p.name}</p>
                  ${item.variant ? `<p class="text-[10px] text-accent">${item.variant}</p>` : ''}
                  <p class="text-[10px] text-text-muted">Cant: ${item.qty}</p>
                </div>
                <span class="text-xs font-bold text-text-main">${formatPrice(p.price * item.qty)}</span>
              </div>`;
            }).join('')}
          </div>
          <div class="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-text-muted">Subtotal</span><span class="font-bold">${formatPrice(total)}</span></div>
            <div class="flex justify-between"><span class="text-text-muted">Envío</span><span class="font-bold ${shipping === 0 ? 'text-green-600' : ''}">${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span></div>
            <div class="border-t border-gray-200 pt-2 flex justify-between text-base">
              <span class="font-bold">Total</span>
              <span class="font-bold text-accent text-lg">${formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

export function init() {
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = sanitize(document.getElementById('ck-name').value);
      const phone = sanitize(document.getElementById('ck-phone').value);
      const dept = sanitize(document.getElementById('ck-dept').value);
      const city = sanitize(document.getElementById('ck-city').value);
      const address = sanitize(document.getElementById('ck-address').value);
      const payment = document.querySelector('input[name="payment"]:checked')?.value || 'yape';

      const cart = store.getCart();
      const { getProductsByIds } = await import('../services/api.js');
      const uniqueIds = [...new Set(cart.map(i => i.id))];
      const products = await getProductsByIds(uniqueIds);

      let orderLines = cart.map(item => {
        const p = products.find(pr => pr.id === item.id);
        if (!p) return '';
        const line = `• ${p.name}${item.variant ? ` (${item.variant})` : ''} x${item.qty} = S/ ${(p.price * item.qty).toFixed(2)}`;
        return line;
      }).filter(Boolean).join('\n');

      const total = cart.reduce((sum, item) => {
        const p = products.find(pr => pr.id === item.id);
        return sum + (p ? p.price * item.qty : 0);
      }, 0);
      const shipping = total >= 150 ? 0 : 15;
      const grandTotal = total + shipping;

      const msg = `🛍️ *NUEVO PEDIDO - GO SHOPPING*\n\n`
        + `👤 *Cliente:* ${name}\n📱 *Teléfono:* ${phone}\n📍 *Ubicación:* ${city}, ${dept}\n🏠 *Dirección:* ${address}\n💳 *Pago:* ${payment.toUpperCase()}\n\n`
        + `📦 *Productos:*\n${orderLines}\n\n`
        + `🚚 Envío: ${shipping === 0 ? 'GRATIS' : `S/ ${shipping.toFixed(2)}`}\n`
        + `💰 *TOTAL: S/ ${grandTotal.toFixed(2)}*\n\n`
        + `_Adjunto mi voucher de pago_ ✅`;

      const whatsappUrl = `https://wa.me/51962810439?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      store.clearCart();
      window.showToast('¡Pedido enviado! Te esperamos en WhatsApp 🎉');
      setTimeout(() => navigate('home'), 2000);
    });
  }
}
