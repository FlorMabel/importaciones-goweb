import { supabase } from './supabase.js';
import { productsConfig } from '../config/products.js';

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getCategoryById(id) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`id.eq.${id},slug.eq.${id}`)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getProductsByCategory(slug) {
  const category = await getCategoryById(slug);
  if (!category) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('category_id', category.id);
  if (error) throw error;

  // Format images array as the frontend expects
  return data.map(formatProduct);
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)');
  if (error) throw error;
  return data.map(formatProduct);
}

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_specs(*), product_colors(*), product_fragrances(*), product_wholesale_tiers(*)')
    .or(`id.eq.${slug},slug.eq.${slug}`)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ? formatProductFull(data) : null;
}

export async function getProductById(id) {
  return getProductBySlug(id);
}

export async function getProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .in('id', ids);
  if (error) throw error;
  return data.map(formatProduct);
}

export async function getDeals() {
  const { data, error } = await supabase
    .from('deals')
    .select('*, product_images(*)');
  if (error) throw error;
  return data.map(formatProduct);
}

export async function getNewArrivals() {
  const { data, error } = await supabase
    .from('new_arrivals')
    .select('*, product_images(*)');
  if (error) throw error;
  return data.map(formatProduct);
}

export async function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  const { data, error } = await supabase
    .from('search_index')
    .select('*');
  if (error) throw error;

  return data.filter(item => {
    const text = `${item.name} ${item.category_id} ${(item.tags || []).join(' ')}`.toLowerCase();
    return text.includes(q);
  }).slice(0, 20);
}

export async function getRelatedProducts(productId, limit = 4) {
  const { data: relatedRefs, error: refError } = await supabase
    .from('related_products')
    .select('related_id')
    .eq('product_id', productId)
    .limit(limit);
  
  if (refError) return [];
  if (!relatedRefs || relatedRefs.length === 0) return [];

  const ids = relatedRefs.map(r => r.related_id);
  return getProductsByIds(ids);
}

export async function getCrossCategoryProducts(categoryId, limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .neq('category_id', categoryId)
    .limit(limit * 3); // fetch extra to randomly pick
  
  if (error || !data) return [];
  
  return data
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
    .map(formatProduct);
}

// Helpers to match frontend data expectations
function formatProduct(p) {
  const images = p.product_images 
    ? p.product_images.sort((a,b)=>a.sort_order - b.sort_order).map(i => i.image_url)
    : [];
    
  const local = productsConfig.find(lp => lp.id === p.id || lp.slug === p.slug);
    
  return {
    ...p,
    variants: local?.variants || [],
    category: p.category_id,
    oldPrice: p.old_price,
    isNew: p.is_new,
    isOnSale: p.is_on_sale,
    salePercent: p.sale_percent,
    images
  };
}

function formatProductFull(p) {
  const base = formatProduct(p);
  
  return {
    ...base,
    specs: p.product_specs || [],
    colors: p.product_colors ? p.product_colors.map(c => c.hex_color) : [],
    fragance: p.product_fragrances || [], // Note: frontend uses 'fragance'
    wholesaleTiers: p.product_wholesale_tiers || [],
  };
}
