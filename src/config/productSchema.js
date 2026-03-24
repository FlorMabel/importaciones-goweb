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
  '#ff0000': 'ROJO',
  '#e8b4b4': 'ROSA CLARO',
  '#ffb6c1': 'ROSA',
  '#FFB6C1': 'ROSA',
  '#add8e6': 'CELESTE',
  '#4b8bbe': 'AZUL',
  '#4B8BBE': 'AZUL',
  '#00bcd4': 'TURQUESA',
  '#9b59b6': 'MORADO',
  '#008000': 'VERDE',
  '#171512': 'NEGRO MATE',
  '#c9a34f': 'DORADO PREMIUM',
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
