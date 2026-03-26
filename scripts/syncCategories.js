import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { categoriesConfig } from '../src/config/categories.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncCategories() {
  console.log('Syncing categories from src/config/categories.js...');
  for (let i = 0; i < categoriesConfig.length; i++) {
    const c = categoriesConfig[i];
    const { error } = await supabase.from('categories').upsert({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      icon: c.icon,
      image_url: c.image_url,
      hero_image_url: c.hero_image_url,
      color: c.color,
      sort_order: c.sort_order
    });
    if (error) {
      console.error(`Error syncing category ${c.id}:`, error);
    } else {
      console.log(`Synced category: ${c.id}`);
    }
  }
}

syncCategories().then(() => console.log('Done!')).catch(console.error);
