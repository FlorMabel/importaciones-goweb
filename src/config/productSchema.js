// Fuente única para lógica de UI de productos
// Cambiar aquí afecta todo el sitio automáticamente

export const WHOLESALE_TIERS = [
  { label: '3–11 ud.',   min: 3,   max: 11,  discount: 0.15 },
  { label: '12–99 ud.',  min: 12,  max: 99,  discount: 0.20 },
  { label: '+100 ud.',   min: 100, max: null, discount: 0.30 },
]

export const COLOR_NAMES = {
  '#000000': 'NEGRO',
  '#ffffff': 'BLANCO',
  '#FFFFFF': 'BLANCO',
  '#808080': 'GRIS',
  '#ffd700': 'DORADO',
  '#FFD700': 'DORADO',
  '#d4a574': 'CAFÉ',
  '#D4A574': 'CAFÉ',
  '#c0c0c0': 'PLATEADO',
  '#C0C0C0': 'PLATEADO',
  '#EC1E1B': 'ROJO',
  '#e8b4b4': 'ROSA CLARO',
  '#ffb6c1': 'ROSA',
  '#FFB6C1': 'ROSA',
  '#add8e6': 'CELESTE',
  '#003785': 'AZUL',
  '#40E0D0': 'TURQUESA',
  '#9b59b6': 'MORADO',
  '#008000': 'VERDE',
  '#171512': 'NEGRO MATE',
  '#c9a34f': 'DORADO PREMIUM',
  '#430D06': 'MADERA OSCURO',
  '#AA7444': 'MADERA CLARO',
  '#2B0F01FF': 'CAFÉ MATE',
  '#FBB2A3': 'ROSADO',
  '#90EE90': 'VERDE MENTA',
  '#F0EBD7': 'CRAQUELADO',
  '#FF00FF': 'MAGENTA',
  '#CF4523FF': 'ORO ROSA',
  '#F0F0F0': 'TRANSPARENTE',
  '#916cea': 'LILA',
  '#94E7FF': 'CELESTE',
  '#69503C': 'AHUMADO',
  '#4D4D4D': 'PLOMO',
  '#2B0F01': 'CAFE',
  '#FFFFA2': 'AMARILLO',
  '#C99036': 'MARRON',
  '#03BB85': 'VERDEAMARELA',
  '#00FFF6': 'ARCO IRIS',
  '#E7C500': 'TORNASOL',
  '#D0CCD1': 'PLATEADO',
  '#588100': 'VERDE MARINO',
  '#FF9800': 'NARANJA',
  '#DDDAAB': 'BEIGE',
  '#73063B': 'FUCSIA OSCURO',
  '#955F34': 'MARRON OSCURO',
  '#7F00B2': 'MORADO'

}

export const getColorName = (hex) => {
  if (!hex) return ''
  return COLOR_NAMES[hex] ||
         COLOR_NAMES[hex.toLowerCase()] ||
         COLOR_NAMES[hex.toUpperCase()] ||
         hex.toUpperCase()
}

export const getWholesalePrices = (basePrice) =>
  WHOLESALE_TIERS.map(tier => ({
    ...tier,
    displayPrice: `S/ ${(basePrice * (1 - tier.discount)).toFixed(2)}`
  }))

/**
 * Calcula el precio unitario final basado en la cantidad y los tiers disponibles.
 * Prioriza los tiers personalizados del producto si existen.
 */
export const calculateUnitPrice = (basePrice, qty, customTiers = []) => {
  const quantity = Number(qty) || 1;
  const price = Number(basePrice) || 0;

  if (quantity < 1) return price;

  // 1. Intentar con tiers personalizados (de Supabase)
  if (customTiers && customTiers.length > 0) {
    // Ordenar por cantidad mínima descendente para encontrar el tier más alto que aplica
    const applicableTier = [...customTiers]
      .sort((a, b) => (Number(b.min_qty) || 0) - (Number(a.min_qty) || 0))
      .find(t => quantity >= (Number(t.min_qty) || 0));

    if (applicableTier) {
      if (applicableTier.fixed_price) return Number(applicableTier.fixed_price);
      if (applicableTier.discount_percent) return price * (1 - (Number(applicableTier.discount_percent) / 100));
    }
  }

  // 2. Fallback a tiers globales si no hay personalizado que aplique
  const globalTier = [...WHOLESALE_TIERS]
    .sort((a, b) => (b.min || 0) - (a.min || 0))
    .find(t => quantity >= (t.min || 0));

  if (globalTier) {
    return price * (1 - globalTier.discount);
  }

  return price;
};
