/**
 * Genera un slug URL-friendly desde un texto
 * "Anillo Ojos de Búho" → "anillo-ojos-de-buho"
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                   // Descompone acentos
    .replace(/ñ/g, '__NN__')           // Protege 'ñ' antes de limpiar diacríticos
    .replace(/[\u0300-\u036f]/g, '')    // Elimina diacríticos (acentos)
    .replace(/__NN__/g, 'ñ')           // Restaura 'ñ'
    .trim()
    .replace(/[^a-z0-9\s-ñ]/g, '')      // Solo alfanuméricos y 'ñ'
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
