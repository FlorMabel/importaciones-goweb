export default function ProductGallery({ images = [], activeIndex, onSelect, badge, isNew }) {
  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className="flex gap-3">
      {/* Miniaturas verticales */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all bg-white
                ${i === activeIndex
                  ? 'border-primary shadow-sm'
                  : 'border-border-color hover:border-primary/50'}`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="relative flex-1 bg-background-soft rounded-xl overflow-hidden aspect-square">
        {/* Badge izquierdo */}
        {badge && (
          <span className="absolute top-3 left-3 z-10 bg-accent text-white
                           text-xs font-bold px-3 py-1 rounded-full uppercase">
            {badge}
          </span>
        )}
        {/* Badge derecho — NUEVO */}
        {isNew && (
          <span className="absolute top-3 right-3 z-10 bg-primary text-white
                           text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            NUEVO
          </span>
        )}
        <img
          src={activeImage}
          alt="Producto"
          className={`w-full h-full transition-opacity duration-200 ${
            activeIndex === 0 
              ? 'object-cover' 
              : 'object-contain p-4'
          }`}
        />
      </div>
    </div>
  )
}
