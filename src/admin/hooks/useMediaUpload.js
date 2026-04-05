import { useState, useCallback } from 'react';
import { uploadImage, uploadMultipleImages } from '../services/cloudinaryUpload.js';

/**
 * Hook para gestión de upload de imágenes
 * Maneja estado de progreso, preview y errores
 */
export function useMediaUpload({ folder = 'goshopping' } = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const result = await uploadImage(file, {
        folder,
        onProgress: setProgress,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder]);

  const uploadBatch = useCallback(async (files) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const results = await uploadMultipleImages(Array.from(files), {
        folder,
        onFileProgress: () => {},
        onTotalProgress: setProgress,
      });
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder]);

  /**
   * Genera un preview URL temporal desde un File
   */
  const createPreview = useCallback((file) => {
    return URL.createObjectURL(file);
  }, []);

  return { upload, uploadBatch, createPreview, uploading, progress, error };
}
