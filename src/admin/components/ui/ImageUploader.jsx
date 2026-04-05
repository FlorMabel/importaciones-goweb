import React, { useRef, useState, useCallback } from 'react';

/**
 * Componente de subida de imágenes con drag & drop, preview y reordenamiento
 */
export default function ImageUploader({
  images = [],         // Array de URLs existentes
  onChange,            // Callback con nuevo array de URLs
  onUpload,           // Callback async para subir un file → retorna { url }
  maxImages = 10,
  uploading = false,
  progress = 0,
}) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);

  const handleFiles = useCallback(async (files) => {
    if (!onUpload) return;
    const newUrls = [...images];
    for (const file of Array.from(files)) {
      if (newUrls.length >= maxImages) break;
      if (!file.type.startsWith('image/')) continue;
      try {
        const result = await onUpload(file);
        newUrls.push(result.url);
      } catch (e) {
        console.error('Upload error:', e);
      }
    }
    onChange?.(newUrls);
  }, [images, maxImages, onUpload, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = (idx) => {
    const next = images.filter((_, i) => i !== idx);
    onChange?.(next);
  };

  const moveImage = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange?.(next);
  };

  // Drag reorder handlers
  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverItem = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    moveImage(dragIdx, idx);
    setDragIdx(idx);
  };

  const handleDragEnd = () => setDragIdx(null);

  return (
    <div className="space-y-3">
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOverItem(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                dragIdx === idx ? 'border-primary opacity-50 scale-95' : 'border-border-light hover:border-primary/40'
              }`}
            >
              <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
              {/* Order badge */}
              <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => moveImage(idx, idx - 1)}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-text-main hover:bg-white disabled:opacity-30 transition"
                  title="Mover izquierda"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  onClick={() => removeImage(idx)}
                  className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <button
                  onClick={() => moveImage(idx, idx + 1)}
                  disabled={idx === images.length - 1}
                  className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-text-main hover:bg-white disabled:opacity-30 transition"
                  title="Mover derecha"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border-strong hover:border-primary/40 hover:bg-background-soft/50'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-text-secondary">Subiendo... {progress}%</p>
              <div className="w-48 h-1.5 bg-border-light rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-text-muted">cloud_upload</span>
              <p className="text-sm text-text-secondary">
                <span className="font-bold text-primary">Click para subir</span> o arrastra imágenes aquí
              </p>
              <p className="text-xs text-text-muted">PNG, JPG, WebP • Max {maxImages} imágenes</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
