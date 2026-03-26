import { useProductGallery } from '../../hooks/useProductGallery'
import ProductGallery from './ProductGallery'
import WholesalePricing from './WholesalePricing'
import ColorSwatches from './ColorSwatches'
import SpecsTable from './SpecsTable'
import StockBadge from './StockBadge'
import QuantitySelector from './QuantitySelector'

export default function ProductCard({ product }) {
  const { activeIndex, selectVariant, selectColor } =
    useProductGallery(product.images, product.colors)

  return (
    <>
      <nav className="text-sm text-text-muted mb-6 flex items-center gap-1.5">
        <span className="hover:text-primary cursor-pointer transition-colors">Inicio</span>
        <span>›</span>
        <span className="hover:text-primary cursor-pointer transition-colors capitalize">
          {product.category}
        </span>
        <span>›</span>
        <span className="text-text-main">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        <ProductGallery
          images={product.images}
          activeIndex={activeIndex}
          onSelect={selectVariant}
          badge={product.badge}
          isNew={product.isNew}
        />

        <div className="flex flex-col gap-5">

          <p className="text-accent text-xs font-bold tracking-widest uppercase
                        flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            {product.category?.toUpperCase()}
          </p>

          <h1 className="font-serif text-3xl font-bold text-text-main leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex text-primary">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.round(product.rating)
                  ? 'opacity-100' : 'opacity-25'}>★</span>
              ))}
            </div>
            <span className="text-text-main font-medium text-sm">{product.rating}</span>
            <span className="text-text-muted text-sm">({product.reviews} reseñas)</span>
          </div>

          <div className="flex items-baseline gap-3">
            {product.oldPrice && (
              <span className="text-text-muted line-through text-lg">
                S/ {product.oldPrice}
              </span>
            )}
            <span className="text-4xl font-bold text-text-main">
              S/ {product.price}
            </span>
            {product.isOnSale && product.salePercent && (
              <span className="bg-red-100 text-red-600 text-xs font-bold
                               px-2 py-1 rounded-full">
                -{product.salePercent}%
              </span>
            )}
          </div>

          <p className="text-text-muted leading-relaxed text-sm">
            {product.description}
          </p>

          <WholesalePricing price={product.price} />
          {product.images?.length > 1 && (
            <ColorSwatches
              colors={product.colors}
              activeIndex={activeIndex}
              onSelectColor={selectColor}
            />
          )}
          <SpecsTable specs={product.specs} />
          <StockBadge stock={product.stock} />
          <QuantitySelector product={product} />

        </div>
      </div>
    </>
  )
}
