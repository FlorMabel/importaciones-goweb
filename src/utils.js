/** Format price in Peruvian Soles */
export function formatPrice(price) {
  if (price == null) return '';
  return `S/ ${Number(price).toFixed(2)}`;
}

/** Resolve local image URL. path comes from JSON like "/images/ring/file.webp" */
export function getImageUrl(path, width) {
  if (!path) return 'https://placehold.co/400x400/f4f1ec/827a68?text=Sin+Imagen';
  // Images are served from /public by Vite, so paths like /images/... work directly
  return path;
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
