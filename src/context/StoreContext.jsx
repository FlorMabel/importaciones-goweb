import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { calculateUnitPrice } from '../config/productSchema';

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
  isCartDrawerOpen: false,
};

function storeReducer(state, action) {
  switch (action.type) {
    case 'SET_CART_DRAWER':
      return { ...state, isCartDrawerOpen: action.payload };
    case 'ADD_TO_CART': {
      const { product, qty, variant } = action.payload;
      const id = product.id;
      const key = variant ? `${id}__${variant}` : id;
      
      const existing = state.cart.find(i => (i.variant ? `${i.id}__${i.variant}` : i.id) === key);
      
      // Determine base price based on variant
      let basePrice = product.price;
      if (variant && product.variants) {
        const v = product.variants.find(v => v.name === variant);
        if (v) basePrice = v.price;
      }

      // NEW: Dynamic wholesale price calculation
      const newQty = existing ? existing.qty + qty : qty;
      const unitPrice = calculateUnitPrice(basePrice, newQty, product.wholesaleTiers);

      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            (i.variant ? `${i.id}__${i.variant}` : i.id) === key
              ? { ...i, qty: newQty, price: unitPrice }
              : i
          ),
          isCartDrawerOpen: true,
        };
      }
      
      const newItem = { 
        id, 
        qty, 
        variant, 
        name: product.name, 
        basePrice: Number(basePrice) || 0,
        price: unitPrice, 
        wholesaleTiers: product.wholesaleTiers || [],
        images: product.images || [],
        slug: product.slug 
      };
      
      return { 
        ...state, 
        cart: [...state.cart, newItem],
        isCartDrawerOpen: true,
      };
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
      const newQty = Math.max(1, qty);

      return {
        ...state,
        cart: state.cart.map(i => {
          if ((i.variant ? `${i.id}__${i.variant}` : i.id) === key) {
            const unitPrice = calculateUnitPrice(i.basePrice, newQty, i.wholesaleTiers);
            return { ...i, qty: newQty, price: unitPrice };
          }
          return i;
        }),
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
  const addToCart = useCallback((product, qty = 1, variant = null) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, qty, variant } });
  }, []);

  const setCartDrawerOpen = useCallback((open) => {
    dispatch({ type: 'SET_CART_DRAWER', payload: open });
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

  const getCartTotal = useCallback(() => {
    return state.cart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 0)), 0);
  }, [state.cart]);

  const value = {
    cart: state.cart,
    wishlist: state.wishlist,
    isCartDrawerOpen: state.isCartDrawerOpen,
    setCartDrawerOpen,
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
