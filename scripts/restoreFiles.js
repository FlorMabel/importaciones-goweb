import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const PRODUCTS_DIR = path.join(DATA_DIR, 'products');

// Create directories if they don't exist
[IMAGES_DIR, DATA_DIR, PRODUCTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    // encode URL to handle spaces properly
    const encodedUrl = encodeURI(url);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    if (fs.existsSync(dest)) return resolve();

    const file = fs.createWriteStream(dest);
    https.get(encodedUrl, (response) => {
      // Handle redirects if any (Cloudinary usually doesn't need this for direct image URLs but just in case)
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          https.get(response.headers.location, (res) => {
              res.pipe(file);
              file.on('finish', () => { file.close(); resolve(); });
          }).on('error', err => reject(err));
      } else {
          response.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function cleanUrl(url) {
    if(!url) return '';
    const decoded = decodeURIComponent(url);
    return decoded.replace(/.*\/goshopping\//, '/images/');
}

async function restoreData() {
  console.log('📦 Recuperando categorias...');
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');
  
  if (!categories) {
      console.error('Error: No categories found');
      return;
  }
  
  const mappedCategories = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    image: cleanUrl(c.image_url),
    heroImage: cleanUrl(c.hero_image_url),
    color: c.color,
    relatedCategories: []
  }));
  
  fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify(mappedCategories, null, 2));

  console.log('📦 Recuperando productos...');
  const { data: products } = await supabase.from('products').select('*, product_images(*), product_specs(*), product_colors(*), product_fragrances(*), product_tags(*)');
  
  if (!products) {
      console.error('Error: No products found');
      return;
  }
  
  const productsByCat = {};
  
  for (const p of products) {
    const images = (p.product_images || []).sort((a,b)=>a.sort_order - b.sort_order).map(i => cleanUrl(i.image_url));
    const specs = (p.product_specs || []).map(s => ({ label: s.label, value: s.value }));
    const colors = (p.product_colors || []).map(c => c.hex_color);
    const fragance = (p.product_fragrances || []).map(f => ({ name: f.name, description: f.description }));
    const tags = (p.product_tags || []).map(t => t.tag);
    
    const mappedProduct = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category_id,
      price: p.price,
      oldPrice: p.old_price,
      currency: p.currency,
      badge: p.badge,
      images,
      description: p.description,
      specs,
      rating: p.rating,
      reviews: p.reviews,
      colors,
      stock: p.stock,
      tags,
      fragance,
      isNew: p.is_new,
      isOnSale: p.is_on_sale,
      salePercent: p.sale_percent
    };
    
    if (!productsByCat[p.category_id]) productsByCat[p.category_id] = [];
    productsByCat[p.category_id].push(mappedProduct);
  }
  
  for (const [cat, prods] of Object.entries(productsByCat)) {
    fs.writeFileSync(path.join(PRODUCTS_DIR, `${cat}.json`), JSON.stringify(prods, null, 2));
  }
  
  console.log('✅ JSONs locales recreados correctamente.');
}

async function restoreImages() {
  console.log('🖼️ Descargando imágenes desde la nube...');
  
  const urlsToDownload = new Set();
  
  const { data: categories } = await supabase.from('categories').select('image_url, hero_image_url');
  if (categories) {
    categories.forEach(c => {
      if (c.image_url) urlsToDownload.add(c.image_url);
      if (c.hero_image_url) urlsToDownload.add(c.hero_image_url);
    });
  }
  
  const { data: images } = await supabase.from('product_images').select('image_url');
  if (images) {
    images.forEach(i => urlsToDownload.add(i.image_url));
  }
  
  let i = 0;
  const downloadPromises = [];
  
  for (const url of urlsToDownload) {
    if (!url.includes('/goshopping/')) continue;
    
    const decodedUrl = decodeURIComponent(url);
    const localRelative = decodedUrl.split('/goshopping/')[1];
    const dest = path.join(IMAGES_DIR, localRelative);
    
    const p = downloadImage(url, dest).then(() => {
        i++;
        if (i % 20 === 0) console.log(`   Descargadas ${i}/${urlsToDownload.size}...`);
    }).catch(err => {
        console.error(`Error descargando ${url}:`, err.message);
    });
    
    downloadPromises.push(p);
  }
  
  await Promise.all(downloadPromises);
  console.log('✅ Imágenes restauradas localmente.');
}

async function run() {
  await restoreData();
  await restoreImages();
  console.log('🎉 Todo el contenido ha sido restaurado exitosamente.');
}

run();
