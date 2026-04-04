/** Format price in Peruvian Soles */
export function formatPrice(price) {
  if (price == null) return '';
  return `S/ ${Number(price).toFixed(2)}`;
}

/** Get price of a product, optionally considering a variant */
export function getItemPrice(product, variantName) {
  if (!product) return 0;
  if (variantName && product.variants) {
    const v = product.variants.find(v => v.name === variantName);
    if (v) return v.price;
  }
  return product.price || 0;
}

/** Resolve local image URL. path comes from JSON like "/images/ring/file.webp" */
export function getImageUrl(path, width) {
  if (!path) return 'https://placehold.co/400x400/f4f1ec/827a68?text=Sin+Imagen';
  // Images are served from /public by Vite, so paths like /images/... work directly
  return path;
}

/** Optimize Cloudinary image URL with auto format, quality and width */
export function getOptimizedImage(url, width = 400) {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('cloudinary')) return url;
  // Avoid double-transforming
  if (url.includes('f_auto')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

/** Sanitize string to prevent XSS */
export function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/** Debounce helper */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
