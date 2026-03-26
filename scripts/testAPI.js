import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

function formatProduct(p) {
  const images = p.product_images 
    ? p.product_images.sort((a,b)=>a.sort_order - b.sort_order).map(i => i.image_url)
    : [];
  return { ...p, images };
}

function formatProductFull(p) {
  const base = formatProduct(p);
  return {
    ...base,
    specs: p.product_specs || [],
    colors: p.product_colors ? p.product_colors.map(c => c.hex_color) : [],
    fragance: p.product_fragrances || [], // Note: frontend uses 'fragance'
  };
}

async function run() {
  const slug = 'esencias-frutales';
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_specs(*), product_colors(*), product_fragrances(*)')
    .or(`id.eq.${slug},slug.eq.${slug}`)
    .single();
    
  if (error || !data) {
    console.log('Error:', error);
    return;
  }
  
  const formatted = formatProductFull(data);
  console.log('Formatted fragance length:', formatted.fragance.length);
  if (formatted.fragance.length === 0) {
    console.log('Raw data product_fragrances:', data.product_fragrances);
  } else {
    console.log('Sample fragance:', formatted.fragance[0]);
  }
}

run();
