import { getWholesalePrices } from '../../config/productSchema'

/**
 * WholesalePricing — muestra precios por mayor
 * Prioriza tiers personalizados de la DB, si no, usa los globales calculados
 * 
 * @param {number} price - Precio base del producto
 * @param {Array} customTiers - Tiers personalizados del producto (de product_wholesale_tiers)
 * @param {boolean} enabled - Indica si la opción de mayorista está activa para este producto
 */
export default function WholesalePricing({ price, customTiers, enabled = false }) {
  if (!enabled) return null

  // Si hay tiers personalizados del admin, usarlos
  const tiers = customTiers && customTiers.length > 0
    ? customTiers
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(t => ({
          label: t.label,
          displayPrice: t.fixed_price
            ? `S/ ${Number(t.fixed_price).toFixed(2)}`
            : `S/ ${(price * (1 - (t.discount_percent || 0) / 100)).toFixed(2)}`,
        }))
    : getWholesalePrices(price)

  if (!tiers || tiers.length === 0) return null

  return (
    <div className="bg-background-soft border border-border-color rounded-xl p-4">
      <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">
        Precios por mayor
      </p>
      <div className="grid grid-cols-3 gap-2">
        {tiers.map(tier => (
          <div key={tier.label}
               className="bg-surface-light border border-border-color rounded-lg p-3 text-center">
            <p className="text-text-muted text-xs mb-1">{tier.label}</p>
            <p className="text-text-main font-bold text-sm">{tier.displayPrice}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
