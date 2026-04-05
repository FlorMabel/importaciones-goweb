/**
 * Cloudinary unsigned upload desde el frontend
 * Usa un upload preset configurado en tu panel de Cloudinary
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dod8hhjoo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'goshopping_unsigned';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Sube una imagen a Cloudinary
 * @param {File} file - Archivo de imagen
 * @param {Object} options - Opciones adicionales
 * @param {string} options.folder - Carpeta en Cloudinary (default: 'goshopping')
 * @param {Function} options.onProgress - Callback de progreso (0-100)
 * @returns {Promise<{url: string, publicId: string, width: number, height: number}>}
 */
export async function uploadImage(file, { folder = 'goshopping', onProgress } = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  formData.append('format', 'webp');             // Auto-convert to WebP
  formData.append('quality', 'auto:good');       // Auto quality

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        resolve({
          url: res.secure_url,
          publicId: res.public_id,
          width: res.width,
          height: res.height,
          format: res.format,
          bytes: res.bytes,
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload network error')));
    xhr.open('POST', UPLOAD_URL);
    xhr.send(formData);
  });
}

/**
 * Sube múltiples imágenes en secuencia
 */
export async function uploadMultipleImages(files, { folder, onFileProgress, onTotalProgress } = {}) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i], {
      folder,
      onProgress: (p) => onFileProgress?.(i, p),
    });
    results.push(result);
    onTotalProgress?.(Math.round(((i + 1) / files.length) * 100));
  }
  return results;
}

/**
 * Genera URL de Cloudinary optimizada
 */
export function getOptimizedUrl(url, { width, height, quality = 'auto', format = 'webp' } = {}) {
  if (!url || !url.includes('cloudinary.com')) return url;
  const transforms = ['f_' + format, 'q_' + quality];
  if (width) transforms.push('w_' + width);
  if (height) transforms.push('h_' + height);
  if (width || height) transforms.push('c_fill');
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
