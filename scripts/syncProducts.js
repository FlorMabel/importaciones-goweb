import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { productsConfig } from '../src/config/products.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use Service Role Key for bypassing RLS during migration
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getCloudinaryUrl(localPath) {
  if (!localPath) return null;
  if (localPath.startsWith('http')) return localPath; // Already full URL
  const cleanPath = localPath.replace('/images/', '');
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1/goshopping/${cleanPath}`;
}

async function syncProducts() {
  console.log('Syncing products from config/products.js to Supabase...');
  let totalMigrated = 0;
  
  for (const p of productsConfig) {
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
    if (p.fragrances && p.fragrances.length > 0) {
      await supabase.from('product_fragrances').delete().eq('product_id', p.id);
      const fragToInsert = p.fragrances.map(f => ({
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
    console.log(`Synced: ${p.id}`);
  }
  
  console.log(`✅ Synced ${totalMigrated} products.`);
  
  // 7. Delete orphan products
  const { data: currentProducts } = await supabase.from('products').select('id');
  if (currentProducts) {
    const localIds = productsConfig.map(p => p.id);
    const orphans = currentProducts.filter(p => !localIds.includes(p.id)).map(p => p.id);
    if (orphans.length > 0) {
      console.log(`🗑️ Deleting ${orphans.length} removed products:`, orphans);
      await supabase.from('products').delete().in('id', orphans);
    }
  }
}

syncProducts().catch(console.error);
