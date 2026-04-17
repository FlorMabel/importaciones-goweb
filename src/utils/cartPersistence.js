import { getCookie, setCookie, deleteCookie } from './cookieManager';

const LS_KEY = 'go_shopping_cart';
const COOKIE_KEY = 'cart_items';

/**
 * Loads cart from either cookies or localStorage based on functional consent
 */
export function loadCart(isFunctionalAllowed) {
  // 1. Try Cookies (higher priority if allowed)
  if (isFunctionalAllowed) {
    const cookieCart = getCookie(COOKIE_KEY);
    if (cookieCart) return cookieCart;
  }

  // 2. Try localStorage
  try {
    const lsCart = localStorage.getItem(LS_KEY);
    if (lsCart) {
      const parsed = JSON.parse(lsCart);
      // Migration: If functional is now allowed, move it to cookies
      if (isFunctionalAllowed) {
        setCookie(COOKIE_KEY, parsed, { days: 30 });
        localStorage.removeItem(LS_KEY);
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading cart from LS', e);
  }

  return [];
}

/**
 * Persists cart based on functional consent
 */
export function persistCart(items, isFunctionalAllowed) {
  if (isFunctionalAllowed) {
    // Save to Cookie and clean LS
    setCookie(COOKIE_KEY, items, { days: 30 });
    localStorage.removeItem(LS_KEY);
  } else {
    // Save to LS and clean Cookie
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to LS', e);
    }
    deleteCookie(COOKIE_KEY);
  }
}
