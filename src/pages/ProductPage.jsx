import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductBySlug, getRelatedProducts } from '../services/api';
import { formatPrice } from '../utils';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import StarRating from '../components/StarRating';
import ProductDetailView from '../components/product/ProductDetailView';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useStore();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-primary
                          border-t-transparent rounded-full"></div>
        </div>
      )}
      {!loading && !product && (
        <p className="text-center text-text-muted py-16">
          No se pudo cargar el producto.
        </p>
      )}
      {product && <ProductDetailView product={product} />}
    </div>
  );
}
