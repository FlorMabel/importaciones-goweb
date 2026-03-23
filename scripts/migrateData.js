import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../public/data');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use Service Role Key for bypassing RLS during migration
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to convert local image paths to Cloudinary URLs
// This assumes the uploadImages.js script was already run and images are in the 'goshopping' root folder on Cloudinary
function getCloudinaryUrl(localPath) {
  if (!localPath) return null;
  // Ex: /images/ring/anillo.webp -> https://res.cloudinary.com/.../goshopping/ring/anillo.webp
  const cleanPath = localPath.replace('/images/', '');
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1/goshopping/${cleanPath}`;
}

async function migrateCategories() {
  console.log('migrating categories...');
  const catPath = path.join(DATA_DIR, 'categories.json');
  if (!fs.existsSync(catPath)) return [];
  
  const categories = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const { error } = await supabase.from('categories').upsert({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      image_url: getCloudinaryUrl(c.image),
      hero_image_url: getCloudinaryUrl(c.heroImage),
      color: c.color,
      sort_order: i
    });
    
    if (error) console.error(`Error migrating category ${c.id}:`, error.message);
  }
  
  console.log(`✅ Migrated ${categories.length} categories.`);
  return categories;
}

async function migrateProducts() {
  console.log('migrating products...');
  const productsDir = path.join(DATA_DIR, 'products');
  if (!fs.existsSync(productsDir)) return;
  
  const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
  let totalMigrated = 0;
  
  for (const file of files) {
    const filePath = path.join(productsDir, file);
    const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    for (const p of products) {
      // 1. Insert product
      const { error: pError } = await supabase.from('products').upsert({
        id: p.id,
        name: p.name,
        slug: p.slug || p.id,
        category_id: p.category,
        price: p.price,
        old_price: p.oldPrice || null,
        currency: p.currency || 'PEN',
        badge: p.badge || null,
        badge_color: null,
        description: p.description || '',
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        stock: p.stock || 10,
        is_new: p.isNew || false,
        is_on_sale: p.isOnSale || false,
        sale_percent: p.salePercent || null
      });
      
      if (pError) {
        console.error(`Error migrating product ${p.id}:`, pError.message);
        continue;
      }
      
      // 2. Insert Images
      if (p.images && p.images.length > 0) {
        await supabase.from('product_images').delete().eq('product_id', p.id);
        const imagesToInsert = p.images.map((img, idx) => ({
          product_id: p.id,
          image_url: getCloudinaryUrl(img),
          sort_order: idx
        }));
        await supabase.from('product_images').insert(imagesToInsert);
      }
      
      // 3. Insert Specs
      if (p.specs && p.specs.length > 0) {
        await supabase.from('product_specs').delete().eq('product_id', p.id);
        const specsToInsert = p.specs.map(s => ({
          product_id: p.id,
          label: s.label,
          value: s.value
        }));
        await supabase.from('product_specs').insert(specsToInsert);
      }
      
      // 4. Insert Colors
      if (p.colors && p.colors.length > 0) {
        await supabase.from('product_colors').delete().eq('product_id', p.id);
        const colorsToInsert = p.colors.map(c => ({
          product_id: p.id,
          hex_color: c
        }));
        await supabase.from('product_colors').insert(colorsToInsert);
      }
      
      // 5. Insert Fragrances
      if (p.fragance && p.fragance.length > 0) {
        await supabase.from('product_fragrances').delete().eq('product_id', p.id);
        const fragToInsert = p.fragance.map(f => ({
          product_id: p.id,
          name: f.name || f,
          description: f.description || ''
        }));
        await supabase.from('product_fragrances').insert(fragToInsert);
      }
      
      // 6. Insert Tags
      if (p.tags && p.tags.length > 0) {
        await supabase.from('product_tags').delete().eq('product_id', p.id);
        const tagsToInsert = p.tags.map(t => ({
          product_id: p.id,
          tag: t
        }));
        await supabase.from('product_tags').insert(tagsToInsert);
      }
      
      totalMigrated++;
    }
  }
  
  console.log(`✅ Migrated ${totalMigrated} products.`);
}

async function run() {
  console.log('🚀 Starting Supabase data migration...');
  await migrateCategories();
  await migrateProducts();
  console.log('🎉 Migration complete!');
}

run().catch(console.error);
