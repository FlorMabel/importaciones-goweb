import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/ui/SearchBar.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useMediaUpload } from '../hooks/useMediaUpload.js';
import { supabase } from '../../services/supabase.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function MediaPage() {
  const { showToast } = useToast();
  const { upload, uploading, progress } = useMediaUpload();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const debouncedSearch = useDebounce(search);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('product_images').select('*, products:product_id(name, slug)').order('sort_order');
      if (debouncedSearch) {
        query = query.ilike('image_url', `%${debouncedSearch}%`);
      }
      const { data, error } = await query.limit(100);
      if (error) throw error;
      setImages(data || []);
    } catch (e) {
      showToast('Error al cargar imágenes', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, showToast]);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      for (const file of files) {
        await upload(file);
      }
      showToast('Imágenes subidas exitosamente', 'success');
      loadImages();
    } catch (err) {
      showToast('Error al subir imágenes', 'error');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast('URL copiada al portapapeles', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-main">Media</h1>
          <p className="text-xs text-text-muted">{images.length} imágenes</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-soft cursor-pointer">
            <span className="material-symbols-outlined text-lg">cloud_upload</span>
            Subir imagen
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por URL..." className="flex-1 max-w-sm" />
        <div className="flex border border-border-default rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-background-soft'}`}
          >
            <span className="material-symbols-outlined text-lg">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-background-soft'}`}
          >
            <span className="material-symbols-outlined text-lg">view_list</span>
          </button>
        </div>
      </div>

      {uploading && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text-main">Subiendo imagen...</p>
            <div className="w-full h-1.5 bg-border-light rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square skeleton-loader rounded-xl" />
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.02 }}
              className="group relative aspect-square rounded-xl overflow-hidden border border-border-light hover:border-primary/40 transition-all cursor-pointer"
              onClick={() => copyUrl(img.image_url)}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-[10px] font-medium truncate">{img.products?.name || 'Sin producto'}</p>
                  <p className="text-white/60 text-[9px] truncate">{img.image_url.split('/').pop()}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); copyUrl(img.image_url); }}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <span className="material-symbols-outlined text-sm text-text-main">content_copy</span>
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
          {images.map((img, idx) => (
            <div key={img.id} className={`flex items-center gap-4 px-4 py-3 hover:bg-primary/[0.02] transition-colors ${idx > 0 ? 'border-t border-border-light/50' : ''}`}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{img.products?.name || 'Sin producto'}</p>
                <p className="text-xs text-text-muted truncate">{img.image_url}</p>
              </div>
              <button onClick={() => copyUrl(img.image_url)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-lg">content_copy</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-4xl text-text-muted/30 mb-2 block">photo_library</span>
          <p className="text-sm text-text-muted">No hay imágenes</p>
        </div>
      )}
    </div>
  );
}
