/**
 * Base utility for managing cookies with JSON support and consent helpers
 */

export function setCookie(name, value, options = {}) {
  const opts = {
    path: '/',
    sameSite: 'Lax',
    ...options
  };

  if (opts.days) {
    const d = new Date();
    d.setTime(d.getTime() + (opts.days * 24 * 60 * 60 * 1000));
    opts.expires = d.toUTCString();
  }

  const stringifiedValue = typeof value === 'object' ? JSON.stringify(value) : value;
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(stringifiedValue)}`;

  if (opts.expires) cookieString += `; expires=${opts.expires}`;
  if (opts.path) cookieString += `; path=${opts.path}`;
  if (opts.domain) cookieString += `; domain=${opts.domain}`;
  if (opts.secure) cookieString += `; secure`;
  if (opts.sameSite) cookieString += `; samesite=${opts.sameSite}`;

  document.cookie = cookieString;
}

export function getCookie(name) {
  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  }
  return null;
}

export function deleteCookie(name) {
  setCookie(name, "", { days: -1 });
}

// Consent Helpers
export const CONSENT_COOKIE = 'cookie_consent';
export const PREFERENCES_COOKIE = 'cookie_preferences';

export function hasConsent() {
  return getCookie(CONSENT_COOKIE) === 'accepted';
}

export function hasDeclined() {
  return getCookie(CONSENT_COOKIE) === 'declined';
}

export function saveConsent(preferences) {
  setCookie(CONSENT_COOKIE, 'accepted', { days: 365 });
  setCookie(PREFERENCES_COOKIE, {
    ...preferences,
    timestamp: new Date().toISOString()
  }, { days: 365 });
}

export function declineConsent() {
  setCookie(CONSENT_COOKIE, 'declined', { days: 365 });
  deleteCookie(PREFERENCES_COOKIE);
  // Clean cart if it was in cookies
  deleteCookie('cart_items');
}

export function getConsentPreferences() {
  const prefs = getCookie(PREFERENCES_COOKIE);
  return prefs || {
    necessary: true,
    functional: false,
    analytics: false
  };
}
