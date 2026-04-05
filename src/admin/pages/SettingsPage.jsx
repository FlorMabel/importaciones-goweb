import React, { useState, useEffect } from 'react';
import FormField from '../components/ui/FormField.jsx';
import { supabase } from '../../services/supabase.js';
import { useToast } from '../../context/ToastContext.jsx';

const DEFAULT_SETTINGS = {
  store_name: 'GO SHOPPING',
  store_description: 'Tienda online premium de productos importados',
  store_currency: 'PEN',
  whatsapp_number: '',
  shipping_cost: '10',
  free_shipping_threshold: '100',
  meta_title: 'GO SHOPPING | Premium Store',
  meta_description: 'Tienda online premium de productos importados. Anillos, humidificadores, esencias, quemadores, tecnología y más.',
};

export default function SettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('site_settings').select('*');
        if (data && data.length > 0) {
          const merged = { ...DEFAULT_SETTINGS };
          data.forEach(row => {
            if (row.value !== null) merged[row.key] = row.value;
          });
          setSettings(merged);
        }
      } catch (e) {
        // Table might not exist yet, use defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const setField = (value, name) => setSettings(p => ({ ...p, [name]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
      }
      showToast('Configuración guardada', 'success');
    } catch (e) {
      showToast('Error al guardar — verifica que la tabla site_settings exista', 'warning');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="skeleton-loader h-8 w-48 rounded-lg" />
        <div className="skeleton-loader h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-text-main">Configuración</h1>
        <p className="text-xs text-text-muted">Ajustes generales de la tienda</p>
      </div>

      {/* General */}
      <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">storefront</span>
          Tienda
        </h2>
        <FormField label="Nombre de la tienda" name="store_name" value={settings.store_name} onChange={setField} />
        <FormField label="Descripción" name="store_description" type="textarea" value={settings.store_description} onChange={setField} rows={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Moneda" name="store_currency" value={settings.store_currency} onChange={setField} />
          <FormField label="WhatsApp" name="whatsapp_number" value={settings.whatsapp_number} onChange={setField} placeholder="+51..." />
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">local_shipping</span>
          Envío
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Costo de envío (PEN)" name="shipping_cost" type="number" value={settings.shipping_cost} onChange={setField} min={0} />
          <FormField label="Envío gratis desde (PEN)" name="free_shipping_threshold" type="number" value={settings.free_shipping_threshold} onChange={setField} min={0} />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-2xl border border-border-light p-5 space-y-4">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-primary">search</span>
          SEO
        </h2>
        <FormField label="Meta Title" name="meta_title" value={settings.meta_title} onChange={setField} />
        <FormField label="Meta Description" name="meta_description" type="textarea" value={settings.meta_description} onChange={setField} rows={2} />
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-5 space-y-4">
        <h2 className="text-sm font-bold text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">warning</span>
          Zona de peligro
        </h2>
        <p className="text-xs text-text-muted">Estas acciones son irreversibles. Procede con cuidado.</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-red-200 text-xs font-medium text-error hover:bg-red-50 transition-colors">
            Limpiar caché
          </button>
          <button className="px-4 py-2 rounded-xl border border-red-200 text-xs font-medium text-error hover:bg-red-50 transition-colors">
            Re-sincronizar productos
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-soft disabled:opacity-50"
        >
          {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          Guardar configuración
        </button>
      </div>
    </div>
  );
}
