import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'goshopping_store';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

const saved = loadState();
const initialState = {
  cart: saved.cart || [],
  wishlist: saved.wishlist || [],
  recentlyViewed: saved.recentlyViewed || [],
  darkMode: saved.darkMode || false,
};

function storeReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { id, qty, variant } = action.payload;
      const key = variant ? `${id}__${variant}` : id;
      const existing = state.cart.find(i => (i.variant ? `${i.id}__${i.variant}` : i.id) === key);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            (i.variant ? `${i.id}__${i.variant}` : i.id) === key
              ? { ...i, qty: i.qty + qty }
              : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { id, qty, variant }] };
    }
    case 'REMOVE_FROM_CART': {
      const { id, variant } = action.payload;
      const key = variant ? `${id}__${variant}` : id;
      return {
        ...state,
        cart: state.cart.filter(i => (i.variant ? `${i.id}__${i.variant}` : i.id) !== key),
      };
    }
    case 'UPDATE_CART_QTY': {
      const { id, qty, variant } = action.payload;
      const key = variant ? `${id}__${variant}` : id;
      return {
        ...state,
        cart: state.cart.map(i =>
          (i.variant ? `${i.id}__${i.variant}` : i.id) === key
            ? { ...i, qty: Math.max(1, qty) }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_WISHLIST': {
      const id = action.payload;
      const idx = state.wishlist.indexOf(id);
      return {
        ...state,
        wishlist: idx > -1
          ? state.wishlist.filter(wid => wid !== id)
          : [...state.wishlist, id],
      };
    }
    case 'ADD_RECENTLY_VIEWED': {
      const id = action.payload;
      return {
        ...state,
        recentlyViewed: [id, ...state.recentlyViewed.filter(i => i !== id)].slice(0, 10),
      };
    }
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      cart: state.cart,
      wishlist: state.wishlist,
      recentlyViewed: state.recentlyViewed,
      darkMode: state.darkMode,
    }));
  }, [state]);

  // Dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  const addToCart = useCallback((id, qty = 1, variant = null) => {
    dispatch({ type: 'ADD_TO_CART', payload: { id, qty, variant } });
  }, []);

  const removeFromCart = useCallback((id, variant = null) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, variant } });
  }, []);

  const updateCartQuantity = useCallback((id, qty, variant = null) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { id, qty, variant } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleWishlist = useCallback((id) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: id });
  }, []);

  const isInWishlist = useCallback((id) => {
    return state.wishlist.includes(id);
  }, [state.wishlist]);

  const addRecentlyViewed = useCallback((id) => {
    dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: id });
  }, []);

  const getCartCount = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
  }, [state.cart]);

  const getCartTotal = useCallback((products) => {
    return state.cart.reduce((sum, item) => {
      const p = products.find(pr => pr.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }, [state.cart]);

  const value = {
    cart: state.cart,
    wishlist: state.wishlist,
    recentlyViewed: state.recentlyViewed,
    darkMode: state.darkMode,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    getCartCount,
    getCartTotal,
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
