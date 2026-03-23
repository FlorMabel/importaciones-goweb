const STORAGE_KEY = 'goshopping_store';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    cart: state.cart,
    wishlist: state.wishlist,
    recentlyViewed: state.recentlyViewed,
    darkMode: state.darkMode,
  }));
}

const saved = loadState();
const state = {
  cart: saved.cart || [],           // [{id, qty, variant?}]
  wishlist: saved.wishlist || [],   // [id, id, ...]
  recentlyViewed: saved.recentlyViewed || [], // [id, id, ...]
  darkMode: saved.darkMode || false,
};

const listeners = {};

function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
}

export const store = {
  // --- Subscriptions ---
  on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => { listeners[event] = listeners[event].filter(f => f !== fn); };
  },

  // --- Cart ---
  getCart() { return state.cart; },

  getCartCount() {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
  },

  getCartTotal(products) {
    return state.cart.reduce((sum, item) => {
      const p = products.find(pr => pr.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },

  addToCart(id, qty = 1, variant = null) {
    const key = variant ? `${id}__${variant}` : id;
    const existing = state.cart.find(i => (i.variant ? `${i.id}__${i.variant}` : i.id) === key);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({ id, qty, variant });
    }
    saveState();
    emit('cart:changed', state.cart);
  },

  removeFromCart(id, variant = null) {
    const key = variant ? `${id}__${variant}` : id;
    state.cart = state.cart.filter(i => (i.variant ? `${i.id}__${i.variant}` : i.id) !== key);
    saveState();
    emit('cart:changed', state.cart);
  },

  updateCartQuantity(id, qty, variant = null) {
    const key = variant ? `${id}__${variant}` : id;
    const item = state.cart.find(i => (i.variant ? `${i.id}__${i.variant}` : i.id) === key);
    if (item) {
      item.qty = Math.max(1, qty);
      saveState();
      emit('cart:changed', state.cart);
    }
  },

  clearCart() {
    state.cart = [];
    saveState();
    emit('cart:changed', state.cart);
  },

  // --- Wishlist ---
  toggleWishlist(id) {
    const idx = state.wishlist.indexOf(id);
    if (idx > -1) state.wishlist.splice(idx, 1);
    else state.wishlist.push(id);
    saveState();
    emit('wishlist:changed', state.wishlist);
  },

  isInWishlist(id) { return state.wishlist.includes(id); },
  getWishlist() { return state.wishlist; },

  // --- Recently Viewed ---
  addRecentlyViewed(id) {
    state.recentlyViewed = [id, ...state.recentlyViewed.filter(i => i !== id)].slice(0, 10);
    saveState();
  },

  getRecentlyViewed() { return state.recentlyViewed; },

  // --- Dark Mode ---
  isDarkMode() { return state.darkMode; },
  toggleDarkMode() {
    state.darkMode = !state.darkMode;
    document.documentElement.classList.toggle('dark', state.darkMode);
    saveState();
    emit('theme:changed', state.darkMode);
  },
};
