/**
 * Genera un slug URL-friendly desde un texto
 * "Anillo Ojos de Búho" → "anillo-ojos-de-buho"
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')                   // Descompone acentos
    .replace(/[\u0300-\u036f]/g, '')    // Elimina diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')      // Solo alfanuméricos
    .replace(/[\s_]+/g, '-')           // Espacios → guiones
    .replace(/-+/g, '-')              // Guiones duplicados
    .replace(/^-|-$/g, '');           // Guiones al inicio/final
}

/**
 * Genera un slug único agregando sufijo numérico si ya existe
 */
export function uniqueSlug(text, existingSlugs = []) {
  let base = slugify(text);
  if (!existingSlugs.includes(base)) return base;
  let i = 2;
  while (existingSlugs.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
