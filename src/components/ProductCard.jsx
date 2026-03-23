import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils';
import { getProductById } from '../services/api';

export default function ProductCard({ product: p, index = 0 }) {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const { showToast } = useToast();

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    const product = await getProductById(p.id);
    if (product) {
      addToCart(product.id, 1);
      showToast(`${product.name} agregado al carrito`);
    }
  };

  return (
    <div
      className="product-card bg-white border border-gray-100 flex flex-col stagger-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className="image-container relative bg-gray-50 cursor-pointer"
        onClick={() => navigate(`/producto/${p.slug}`)}
      >
        {p.badge && (
          <span className={`variant-badge ${p.badgeColor || ''}`}>{p.badge}</span>
        )}
        <img src={p.images?.[0] || ''} alt={p.name} loading="lazy" />
        <button
          onClick={handleQuickAdd}
          className="add-btn"
          title="Agregar al carrito"
        >
          <span className="material-symbols-outlined text-base">add_shopping_cart</span>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
          {p.category || ''}
        </p>
        <h3
          className="text-sm font-bold text-text-main mb-1 line-clamp-2 cursor-pointer hover:text-accent transition-colors"
          onClick={() => navigate(`/producto/${p.slug}`)}
        >
          {p.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={p.rating} />
          <span className="text-[10px] text-text-muted">({p.reviews || 0})</span>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <span className="text-sm font-bold text-accent">{formatPrice(p.price)}</span>
          {p.oldPrice && (
            <span className="text-xs text-text-muted line-through">{formatPrice(p.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
