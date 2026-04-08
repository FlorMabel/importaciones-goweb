import React, { useState, useEffect, useMemo } from 'react';
import FormField from '../ui/FormField.jsx';
import ImageUploader from '../ui/ImageUploader.jsx';
import StatusBadge from '../ui/StatusBadge.jsx';
import { slugify } from '../../utils/slugify.js';
import { validateForm, required, minLength, minValue, isSlug } from '../../utils/validators.js';
import { formatPrice } from '../../utils/formatters.js';
import { useMediaUpload } from '../../hooks/useMediaUpload.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { WHOLESALE_TIERS } from '../../../config/productSchema.js';

const EMPTY_PRODUCT = {
  id: '',
  sku: '',
  name: '',
  slug: '',
  category_id: '',
  price: '',
  old_price: '',
  currency: 'PEN',
  badge: '',
  description: '',
  rating: 0,
  reviews: 0,
  stock: 10,
  is_new: false,
  is_on_sale: false,
  sale_percent: '',
  status: 'active',
  images: [],
  specs: [],
  colors: [],
  fragrances: [],
  tags: [],
  wholesale_tiers: [],
  wholesale_enabled: false,
  variants: [],
};

const VALIDATION_RULES = {
  name: [required, minLength(2)],
  slug: [required, isSlug],
  category_id: [required],
  price: [required, minValue(0)],
};

export default function ProductForm({ product, categories = [], onSave, onCancel, saving = false }) {
  const isEditing = !!product?.id;
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [autoSlug, setAutoSlug] = useState(true);
  const { showToast } = useToast();
  const { upload, uploading, progress } = useMediaUpload();

  // Initialize form
  useEffect(() => {
    if (product) {
      const images = (product.product_images || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(i => i.image_url);
      const specs = (product.product_specs || []).map(s => ({ label: s.label, value: s.value }));
      const colors = (product.product_colors || []).map(c => c.hex_color);
      const fragrances = (product.product_fragrances || []).map(f => ({ name: f.name, description: f.description || '' }));
      const tags = (product.product_tags || product.tags || []).map(t => typeof t === 'string' ? t : t.tag);

      const wholesale_tiers = (product.product_wholesale_tiers || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(t => ({
          label: t.label,
          min_qty: t.min_qty,
          max_qty: t.max_qty || '',
          discount_percent: t.discount_percent || '',
          fixed_price: t.fixed_price || '',
        }));

      setForm({
        ...EMPTY_PRODUCT,
        ...product,
        old_price: product.old_price || '',
        sale_percent: product.sale_percent || '',
        badge: product.badge || '',
        images, specs, colors, fragrances, tags,
        wholesale_tiers,
        wholesale_enabled: wholesale_tiers.length > 0,
        variants: (product.product_variants || []).sort((a,b) => a.name.localeCompare(b.name)),
      });
      setAutoSlug(false);
    } else {
      setForm(EMPTY_PRODUCT);
      setAutoSlug(true);
    }
  }, [product]);

  const setField = (value, name) => {
    let finalValue = value;
    // Auto-correct slug for lowercase, numbers and 'ñ'
    if (name === 'slug') {
      finalValue = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-ñ]/g, '');
    }

    setForm(prev => {
      const next = { ...prev, [name]: finalValue };
      // Auto-generate slug from name
      if (name === 'name' && autoSlug) {
        next.slug = slugify(finalValue);
        if (!isEditing) next.id = next.slug;
      }
      return next;
    });
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: newErrors } = validateForm(form, VALIDATION_RULES);
    setErrors(newErrors);
    
    if (!valid) {
      showToast('Por favor, revisa los campos marcados en rojo', 'error');
      return;
    }

    // Prepare data
    const data = {
      id: form.id || form.slug,
      sku: form.sku || null,
      name: form.name,
      slug: form.slug,
      category_id: form.category_id,
      price: Number(form.price),
      old_price: form.old_price ? Number(form.old_price) : null,
      currency: form.currency || 'PEN',
      badge: form.badge || null,
      description: form.description || '',
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      stock: Number(form.stock) || 0,
      is_new: !!form.is_new,
      is_on_sale: !!form.is_on_sale,
      sale_percent: form.sale_percent ? Number(form.sale_percent) : null,
      status: form.status || 'active',
      images: form.images,
      specs: form.specs.filter(s => s.label && s.value),
      colors: form.colors.filter(Boolean),
      fragrances: form.fragrances.filter(f => f.name),
      tags: form.tags.filter(Boolean),
      wholesale_tiers: form.wholesale_enabled
        ? form.wholesale_tiers.filter(t => t.label && (t.discount_percent || t.fixed_price))
        : [],
      variants: form.variants.filter(v => v.name && v.price),
    };

    onSave?.(data);
  };

  // Category options
  const categoryOptions = useMemo(() =>
    categories.map(c => ({ value: c.id, label: c.name })),
    [categories]
  );

  // Spec management
  const addSpec = () => setForm(p => ({ ...p, specs: [...p.specs, { label: '', value: '' }] }));
  const updateSpec = (idx, field, val) => {
    setForm(p => ({
      ...p,
      specs: p.specs.map((s, i) => i === idx ? { ...s, [field]: val } : s),
    }));
  };
  const removeSpec = (idx) => setForm(p => ({ ...p, specs: p.specs.filter((_, i) => i !== idx) }));

  // Color management
  const addColor = () => setForm(p => ({ ...p, colors: [...p.colors, '#000000'] }));
  const updateColor = (idx, val) => {
    setForm(p => ({ ...p, colors: p.colors.map((c, i) => i === idx ? val : c) }));
  };
  const removeColor = (idx) => setForm(p => ({ ...p, colors: p.colors.filter((_, i) => i !== idx) }));

  // Tag management
  const [tagInput, setTagInput] = useState('');
  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm(p => ({ ...p, tags: [...new Set([...p.tags, tagInput.trim()])] }));
    setTagInput('');
  };
  const removeTag = (idx) => setForm(p => ({ ...p, tags: p.tags.filter((_, i) => i !== idx) }));

  // Wholesale tier management
  const DEFAULT_TIERS = [
    { label: '3–11 ud.', min_qty: 3, max_qty: 11, discount_percent: 15, fixed_price: '' },
    { label: '12–99 ud.', min_qty: 12, max_qty: 99, discount_percent: 20, fixed_price: '' },
    { label: '+100 ud.', min_qty: 100, max_qty: '', discount_percent: 30, fixed_price: '' },
  ];

  const toggleWholesale = () => {
    setForm(p => {
      const enabling = !p.wholesale_enabled;
      return {
        ...p,
        wholesale_enabled: enabling,
        wholesale_tiers: enabling && p.wholesale_tiers.length === 0 ? DEFAULT_TIERS : p.wholesale_tiers,
      };
    });
  };

  const addWholesaleTier = () => setForm(p => ({
    ...p,
    wholesale_tiers: [...p.wholesale_tiers, { label: '', min_qty: '', max_qty: '', discount_percent: '', fixed_price: '' }],
  }));
  const updateWholesaleTier = (idx, field, val) => {
    setForm(p => ({
      ...p,
      wholesale_tiers: p.wholesale_tiers.map((t, i) => {
        if (i !== idx) return t;
        const updated = { ...t, [field]: val };
        // Auto-generate label from quantities
        if (field === 'min_qty' || field === 'max_qty') {
          const min = field === 'min_qty' ? val : t.min_qty;
          const max = field === 'max_qty' ? val : t.max_qty;
          if (min && max) updated.label = `${min}–${max} ud.`;
          else if (min && !max) updated.label = `+${min} ud.`;
        }
        return updated;
      }),
    }));
  };
  const removeWholesaleTier = (idx) => setForm(p => ({
    ...p,
    wholesale_tiers: p.wholesale_tiers.filter((_, i) => i !== idx),
  }));

  // Variant management
  const addVariant = () => setForm(p => ({
    ...p,
    variants: [...p.variants, { name: '', price: p.price, stock: p.stock }],
  }));
  const updateVariant = (idx, field, val) => {
    setForm(p => ({
      ...p,
      variants: p.variants.map((v, i) => i === idx ? { ...v, [field]: val } : v),
    }));
  };
  const removeVariant = (idx) => setForm(p => ({
    ...p,
    variants: p.variants.filter((_, i) => i !== idx),
  }));

  // Live preview price
  const previewPrice = form.price ? formatPrice(Number(form.price)) : 'S/ 0.00';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with status */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-text-main">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          {isEditing && <p className="text-xs text-text-muted mt-0.5">ID: {form.id}</p>}
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={form.status} size="md" />
          <select
            value={form.status}
            onChange={e => setField(e.target.value, 'status')}
            className="text-xs border border-border-default rounded-lg px-2 py-1.5 bg-white"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="draft">Borrador</option>
          </select>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main fields */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">info</span>
              Información básica
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Nombre" name="name" value={form.name} onChange={setField} error={errors.name} required />
              <FormField label="SKU (Manual)" name="sku" value={form.sku} onChange={setField} placeholder="ej: GS-ACC-001" />
              <FormField
                label="Slug"
                name="slug"
                value={form.slug}
                onChange={(v, n) => { setAutoSlug(false); setField(v, n); }}
                error={errors.slug}
                helper="URL: /producto/slug"
                required
              />
            </div>
            <FormField
              label="Categoría"
              name="category_id"
              type="select"
              value={form.category_id}
              onChange={setField}
              options={categoryOptions}
              error={errors.category_id}
              required
            />
            <FormField
              label="Descripción"
              name="description"
              type="textarea"
              value={form.description}
              onChange={setField}
              rows={4}
              placeholder="Describe el producto..."
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">image</span>
              Imágenes
            </h3>
            <ImageUploader
              images={form.images}
              onChange={(imgs) => setForm(p => ({ ...p, images: imgs }))}
              onUpload={upload}
              uploading={uploading}
              progress={progress}
            />
          </div>

          {/* Specs */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">tune</span>
                Especificaciones
              </h3>
              <button type="button" onClick={addSpec} className="text-xs font-bold text-primary hover:underline">
                + Agregar
              </button>
            </div>
            {form.specs.map((spec, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <input
                  value={spec.label}
                  onChange={e => updateSpec(idx, 'label', e.target.value)}
                  placeholder="Etiqueta"
                  className="flex-1 rounded-xl border border-border-default px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <input
                  value={spec.value}
                  onChange={e => updateSpec(idx, 'value', e.target.value)}
                  placeholder="Valor"
                  className="flex-1 rounded-xl border border-border-default px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <button type="button" onClick={() => removeSpec(idx)} className="w-8 h-8 mt-0.5 rounded-lg flex items-center justify-center text-text-muted hover:text-error hover:bg-red-50 transition-colors">
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ))}
          </div>

          {/* Colors */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-primary">palette</span>
                Colores disponibles
              </h3>
              <button type="button" onClick={addColor} className="text-xs font-bold text-primary hover:underline">
                + Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.colors.map((color, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-background-soft rounded-lg px-2 py-1.5">
                  <input
                    type="color"
                    value={color}
                    onChange={e => updateColor(idx, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0"
                  />
                  <span className="text-xs text-text-secondary font-mono">{color}</span>
                  <button type="button" onClick={() => removeColor(idx)} className="w-5 h-5 rounded flex items-center justify-center text-text-muted hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">label</span>
              Tags
            </h3>
            <div className="flex items-center gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Agregar tag..."
                className="flex-1 rounded-xl border border-border-default px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <button type="button" onClick={addTag} className="px-3 py-2 rounded-xl bg-background-soft text-sm font-medium text-text-secondary hover:bg-border-light transition-colors">
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 bg-accent/10 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(idx)} className="hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — sidebar */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">payments</span>
              Precio
            </h3>
            <FormField label="Precio (PEN)" name="price" type="number" value={form.price} onChange={setField} error={errors.price} required min={0} step={0.1} />
            <FormField label="Precio anterior" name="old_price" type="number" value={form.old_price} onChange={setField} min={0} step={0.1} helper="Deja vacío si no está en oferta" />
            <div className="pt-2 border-t border-border-light">
              <p className="text-2xl font-bold text-primary">{previewPrice}</p>
              {form.old_price && (
                <p className="text-sm text-text-muted line-through">{formatPrice(Number(form.old_price))}</p>
              )}
            </div>
          </div>

          {/* Wholesale Pricing */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-accent">storefront</span>
                Precios por Mayor
              </h3>
              <FormField type="toggle" name="wholesale_enabled" value={form.wholesale_enabled} onChange={toggleWholesale} />
            </div>

            {form.wholesale_enabled && (
              <>
                <p className="text-xs text-text-muted">
                  Define descuentos o precios fijos por volumen. Si defines precio fijo, se usa en lugar del descuento.
                </p>

                {form.wholesale_tiers.map((tier, idx) => (
                  <div key={idx} className="bg-background-soft rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-accent">{tier.label || `Nivel ${idx + 1}`}</span>
                      <button type="button" onClick={() => removeWholesaleTier(idx)} className="w-6 h-6 rounded-md flex items-center justify-center text-text-muted hover:text-error hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-text-muted">Mín. uds</label>
                        <input
                          type="number"
                          value={tier.min_qty}
                          onChange={e => updateWholesaleTier(idx, 'min_qty', e.target.value)}
                          placeholder="3"
                          min={1}
                          className="w-full rounded-lg border border-border-default px-2.5 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-text-muted">Máx. uds</label>
                        <input
                          type="number"
                          value={tier.max_qty}
                          onChange={e => updateWholesaleTier(idx, 'max_qty', e.target.value)}
                          placeholder="∞"
                          min={0}
                          className="w-full rounded-lg border border-border-default px-2.5 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-text-muted">% Descuento</label>
                        <input
                          type="number"
                          value={tier.discount_percent}
                          onChange={e => updateWholesaleTier(idx, 'discount_percent', e.target.value)}
                          placeholder="15"
                          min={0}
                          max={100}
                          className="w-full rounded-lg border border-border-default px-2.5 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-text-muted">Precio fijo (S/)</label>
                        <input
                          type="number"
                          value={tier.fixed_price}
                          onChange={e => updateWholesaleTier(idx, 'fixed_price', e.target.value)}
                          placeholder="Opcional"
                          min={0}
                          step={0.01}
                          className="w-full rounded-lg border border-border-default px-2.5 py-1.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                        />
                      </div>
                    </div>
                    {/* Preview */}
                    {form.price && (tier.discount_percent || tier.fixed_price) && (
                      <div className="text-xs text-right">
                        <span className="text-text-muted">Precio: </span>
                        <span className="font-bold text-accent">
                          {tier.fixed_price
                            ? formatPrice(Number(tier.fixed_price))
                            : formatPrice(Number(form.price) * (1 - Number(tier.discount_percent) / 100))
                          }
                          /ud.
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addWholesaleTier}
                  className="w-full py-2 rounded-xl border-2 border-dashed border-border-strong text-xs font-medium text-text-muted hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Agregar nivel
                </button>
              </>
            )}
          </div>

          {/* Stock & Badge */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">inventory</span>
              Inventario
            </h3>
            <FormField label="Stock" name="stock" type="number" value={form.stock} onChange={setField} min={0} />
            <FormField label="Badge" name="badge" value={form.badge} onChange={setField} placeholder="ej: NUEVO, OFERTA, TOP VENTAS" />
          </div>

          {/* Variants (Tallas y Precios) */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4 font-display">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-accent">straighten</span>
                Tallas y Precios
              </h3>
              <button type="button" onClick={addVariant} className="text-xs font-bold text-primary hover:underline">
                + Agregar Talla
              </button>
            </div>
            
            {form.variants.length === 0 ? (
              <p className="text-xs text-text-muted italic bg-background-soft p-3 rounded-xl border border-dashed border-border-default">
                Este producto no tiene tallas específicas. Usará el precio general.
              </p>
            ) : (
              <div className="space-y-3">
                {form.variants.map((variant, idx) => (
                  <div key={idx} className="bg-background-soft rounded-xl p-3 border border-border-light relative group">
                    <button 
                      type="button" 
                      onClick={() => removeVariant(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-border-default rounded-full flex items-center justify-center text-text-muted hover:text-error shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-text-muted mb-1 block">Talla</label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={e => updateVariant(idx, 'name', e.target.value)}
                          placeholder="ej: S, M, L"
                          className="w-full rounded-lg border border-border-default px-2.5 py-1.5 text-xs focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-text-muted mb-1 block">Precio (S/)</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={e => updateVariant(idx, 'price', e.target.value)}
                          step="0.1"
                          className="w-full rounded-lg border border-border-default px-2.5 py-1.5 text-xs focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-text-muted flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">inventory_2</span>
                      ID Talla: {variant.id || 'Nuevo'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">toggle_on</span>
              Opciones
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Producto nuevo</span>
              <FormField type="toggle" name="is_new" value={form.is_new} onChange={setField} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">En oferta</span>
              <FormField type="toggle" name="is_on_sale" value={form.is_on_sale} onChange={setField} />
            </div>
            {form.is_on_sale && (
              <FormField label="% Descuento" name="sale_percent" type="number" value={form.sale_percent} onChange={setField} min={0} max={100} />
            )}
          </div>

          {/* Rating (read-only for reference) */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">star</span>
              Valoración
            </h3>
            <FormField label="Rating" name="rating" type="number" value={form.rating} onChange={setField} min={0} max={5} step={0.1} />
            <FormField label="Reviews" name="reviews" type="number" value={form.reviews} onChange={setField} min={0} />
          </div>

          {/* Live preview card */}
          <div className="bg-white rounded-2xl border border-border-light p-5 space-y-3">
            <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-primary">preview</span>
              Vista previa
            </h3>
            <div className="rounded-xl overflow-hidden border border-border-light">
              <div className="aspect-[4/3] bg-background-soft flex items-center justify-center p-3">
                {form.images[0] ? (
                  <img src={form.images[0]} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-text-muted/30">image</span>
                )}
              </div>
              <div className="p-3">
                {form.badge && (
                  <span className="inline-block text-[10px] font-bold text-white bg-accent px-2 py-0.5 rounded-full uppercase mb-1.5">
                    {form.badge}
                  </span>
                )}
                <p className="text-sm font-bold text-text-main truncate">{form.name || 'Nombre del producto'}</p>
                <p className="text-sm font-bold text-primary mt-0.5">{previewPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-background-soft transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-soft disabled:opacity-50"
        >
          {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isEditing ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
