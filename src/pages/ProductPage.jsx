import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductBySlug, getRelatedProducts } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/StarRating';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useStore();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [mainQty, setMainQty] = useState(1);
  const [fragQtys, setFragQtys] = useState({});

  useEffect(() => {
    setLoading(true);
    setMainQty(1);
    setFragQtys({});
    getProductBySlug(slug).then(async p => {
      if (p) {
        setProduct(p);
        setMainImage(p.images?.[0] || '');
        addRecentlyViewed(p.id);
        const rel = await getRelatedProducts(p.id, 4);
        setRelated(rel);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-text-muted text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif text-accent">Producto no encontrado</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold text-sm">Volver al inicio</button>
      </div>
    );
  }

  const hasFragrances = product.fragrances && product.fragrances.length > 0;
  const inWishlist = isInWishlist(product.id);
  const whatsappMsg = encodeURIComponent(`Hola! Me interesa: ${product.name} (${formatPrice(product.price)}) — https://goshopping.pe/producto/${product.slug}`);

  const handleAddToCart = () => {
    if (hasFragrances) {
      let added = false;
      Object.entries(fragQtys).forEach(([fragName, qty]) => {
        if (qty > 0) {
          addToCart(product.id, qty, fragName);
          added = true;
        }
      });
      if (added) {
        showToast('¡Fragancias agregadas al carrito!');
      } else {
        showToast('Selecciona al menos una fragancia', 'warning');
      }
    } else {
      addToCart(product.id, mainQty);
      showToast(`${product.name} agregado al carrito`);
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
    showToast(inWishlist ? 'Eliminado de favoritos' : 'Añadido a favoritos');
  };

  const updateFragQty = (fragName, delta) => {
    setFragQtys(prev => ({
      ...prev,
      [fragName]: Math.max(0, (prev[fragName] || 0) + delta),
    }));
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | GO SHOPPING</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:type" content="product" />
        {product.images?.[0] && <meta property="og:image" content={product.images[0]} />}
      </Helmet>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 py-6">
        <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
          <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/')}>Inicio</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer" onClick={() => navigate(`/categoria/${product.category}`)}>{product.category}</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-accent font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <section className="max-w-[1280px] mx-auto px-4 lg:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-3 h-fit lg:sticky lg:top-24">
            {product.images?.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 ${mainImage === img ? 'border-primary active' : 'border-gray-200'} hover:border-primary transition-colors`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden aspect-square relative p-6 flex items-center justify-center">
              <img src={mainImage} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              {product.badge && <span className={`variant-badge absolute top-4 left-4 ${product.badgeColor || ''}`}>{product.badge}</span>}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-accent leading-tight mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif text-accent font-bold">{formatPrice(product.price)}</span>
                {product.oldPrice && <span className="text-base text-text-muted line-through">{formatPrice(product.oldPrice)}</span>}
                {product.salePercent && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">-{product.salePercent}%</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.rating} />
              <span className="text-xs text-text-muted">({product.reviews || 0} Reseñas)</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-6">{product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-main mb-3 block">COLOR</span>
                <div className="flex gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c}
                      className={`w-8 h-8 rounded-full border-2 ${idx === 0 ? 'border-accent ring-2 ring-accent/20' : 'border-gray-300'}`}
                      style={{ backgroundColor: c }}
                      title={c}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            {/* Fragrances */}
            {hasFragrances && (
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-text-main mb-3 block">
                  FRAGANCIAS DISPONIBLES ({product.fragrances.length})
                </span>
                <div className="max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar pr-2">
                  {product.fragrances.map(f => (
                    <div key={f.name} className="flex items-center justify-between p-3 bg-background-soft rounded-xl hover:bg-background-soft/80 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-main">{f.name}</p>
                        <p className="text-[11px] text-text-muted">{f.desc}</p>
                      </div>
                      <div className="qty-selector ml-3 flex-shrink-0">
                        <button onClick={() => updateFragQty(f.name, -1)}>
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="qty-value">{fragQtys[f.name] || 0}</span>
                        <button onClick={() => updateFragQty(f.name, 1)}>
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA */}
            <div className="flex flex-wrap gap-3 pt-2 mb-6">
              {!hasFragrances && (
                <div className="qty-selector h-12 px-1">
                  <button onClick={() => setMainQty(q => Math.max(1, q - 1))}>
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                  <span className="qty-value">{mainQty}</span>
                  <button onClick={() => setMainQty(q => q + 1)}>
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                </div>
              )}
              <button
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary-dark text-white text-sm font-bold h-12 px-8 rounded-full transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
              >
                <span className="material-symbols-outlined text-lg">shopping_bag</span> AÑADIR AL CARRITO
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-red-50 transition-colors ${inWishlist ? 'text-red-500' : 'text-text-muted'}`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: `'FILL' ${inWishlist ? 1 : 0}` }}>favorite</span>
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/51962810439?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 px-6 rounded-full transition-colors mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Consultar por WhatsApp
            </a>

            {/* Specs */}
            {product.specs?.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mb-4">
                <details className="group" open>
                  <summary className="flex justify-between items-center font-bold text-sm list-none text-text-main cursor-pointer py-2">
                    Especificaciones
                    <span className="material-symbols-outlined text-lg transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-2 text-sm text-text-muted space-y-2">
                    {product.specs.map(s => (
                      <div key={s.label} className="flex justify-between">
                        <span className="font-light">{s.label}</span>
                        <span className="font-bold text-text-main">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-xs mb-4">
              {product.stock > 10
                ? <><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-green-700 font-medium">En stock ({product.stock} disponibles)</span></>
                : product.stock > 0
                  ? <><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-yellow-700 font-medium">Últimas {product.stock} unidades</span></>
                  : <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-700 font-medium">Agotado</span></>
              }
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 py-4 border-t border-gray-100">
              {[
                { icon: 'local_shipping', title: 'Envío Seguro', desc: 'A todo el Perú' },
                { icon: 'verified_user', title: 'Garantía Total', desc: 'Producto original' },
                { icon: 'cached', title: 'Devolución', desc: 'Política flexible' },
                { icon: 'eco', title: 'Eco-friendly', desc: 'Empaque reciclable' },
              ].map(t => (
                <div key={t.icon} className="flex items-start gap-2">
                  <div className="bg-background-soft rounded-full p-1.5 text-accent"><span className="material-symbols-outlined text-base">{t.icon}</span></div>
                  <div><h4 className="font-bold text-xs text-text-main">{t.title}</h4><p className="text-[10px] text-text-muted">{t.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-background-soft py-12">
          <div className="max-w-[1280px] mx-auto px-4 lg:px-10">
            <h3 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">TAMBIÉN PODRÍA GUSTARTE</h3>
            <h2 className="text-2xl font-serif font-bold text-text-main mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <div
                  key={p.id}
                  className="product-card bg-white border border-gray-100 flex flex-col cursor-pointer"
                  onClick={() => navigate(`/producto/${p.slug}`)}
                >
                  <div className="image-container relative bg-gray-50">
                    {p.badge && <span className={`variant-badge ${p.badgeColor || ''}`}>{p.badge}</span>}
                    <img src={p.images?.[0] || ''} alt={p.name} loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-text-main mb-1 line-clamp-2">{p.name}</h3>
                    <span className="text-sm font-bold text-accent">{formatPrice(p.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile CTA */}
      <div className="sticky-mobile-cta">
        <div className="flex-1">
          <p className="text-xs text-text-muted">Precio</p>
          <p className="text-lg font-bold text-accent">{formatPrice(product.price)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">shopping_bag</span> Agregar
        </button>
      </div>
    </>
  );
}
