import React, { useState, useEffect } from 'react';
import FormField from '../ui/FormField.jsx';
import ImageUploader from '../ui/ImageUploader.jsx';
import { slugify } from '../../utils/slugify.js';
import { validateForm, required, minLength, isSlug } from '../../utils/validators.js';
import { useMediaUpload } from '../../hooks/useMediaUpload.js';

const EMPTY_CATEGORY = {
  id: '',
  name: '',
  slug: '',
  description: '',
  icon: 'category',
  image_url: '',
  hero_image_url: '',
  color: '#c9a34f',
  sort_order: 0,
};

const RULES = {
  name: [required, minLength(2)],
  slug: [required, isSlug],
};

const ICON_OPTIONS = [
  'diamond', 'humidity_mid', 'savings', 'local_fire_department', 'fireplace',
  'devices', 'pets', 'water_drop', 'new_releases', 'category', 'shopping_bag',
  'inventory_2', 'redeem', 'styler', 'favorite', 'star',
];

export default function CategoryForm({ category, onSave, onCancel, saving = false }) {
  const isEditing = !!category?.id;
  const [form, setForm] = useState(EMPTY_CATEGORY);
  const [errors, setErrors] = useState({});
  const { upload, uploading, progress } = useMediaUpload();

  useEffect(() => {
    if (category) {
      setForm({ ...EMPTY_CATEGORY, ...category });
    } else {
      setForm(EMPTY_CATEGORY);
    }
  }, [category]);

  const setField = (value, name) => {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'name' && !isEditing) {
        next.slug = slugify(value);
        next.id = next.slug;
      }
      return next;
    });
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: newErrors } = validateForm(form, RULES);
    setErrors(newErrors);
    if (!valid) return;

    onSave?.({
      id: form.id || form.slug,
      name: form.name,
      slug: form.slug,
      description: form.description || '',
      icon: form.icon || 'category',
      image_url: form.image_url || '',
      hero_image_url: form.hero_image_url || '',
      color: form.color || '#c9a34f',
      sort_order: Number(form.sort_order) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nombre" name="name" value={form.name} onChange={setField} error={errors.name} required />
        <FormField label="Slug" name="slug" value={form.slug} onChange={setField} error={errors.slug} required />
      </div>

      <FormField label="Descripción" name="description" type="textarea" value={form.description} onChange={setField} rows={3} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Color" name="color" type="color" value={form.color} onChange={setField} />
        <FormField label="Orden" name="sort_order" type="number" value={form.sort_order} onChange={setField} min={0} />
      </div>

      {/* Icon selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-secondary">Icono</label>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map(icon => (
            <button
              key={icon}
              type="button"
              onClick={() => setField(icon, 'icon')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                form.icon === icon
                  ? 'bg-primary text-white shadow-soft scale-110'
                  : 'bg-background-soft text-text-muted hover:bg-border-light'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image URLs */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-main">Imágenes</h3>
        <FormField label="URL Imagen principal" name="image_url" value={form.image_url} onChange={setField} placeholder="https://..." />
        <FormField label="URL Imagen hero" name="hero_image_url" value={form.hero_image_url} onChange={setField} placeholder="https://..." />
        {/* Preview */}
        {(form.image_url || form.hero_image_url) && (
          <div className="grid grid-cols-2 gap-3">
            {form.image_url && (
              <div className="rounded-xl overflow-hidden border border-border-light aspect-video">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            {form.hero_image_url && (
              <div className="rounded-xl overflow-hidden border border-border-light aspect-video">
                <img src={form.hero_image_url} alt="Hero preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-background-soft transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50">
          {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isEditing ? 'Guardar' : 'Crear categoría'}
        </button>
      </div>
    </form>
  );
}
