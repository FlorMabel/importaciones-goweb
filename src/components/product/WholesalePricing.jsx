import { getWholesalePrices } from '../../config/productSchema'

export default function WholesalePricing({ price }) {
  const tiers = getWholesalePrices(price)

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
