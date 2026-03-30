import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    "id": "casco-modelo",
    "name": "Casco Motero",
    "slug": "casco-modelo",
    "category": "mascotas",
    "currency": "PEN",
    "badge": "SEGURIDAD",
    "images": [
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774755657/casco_modelo_nwamxa.webp",
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774755656/casco_dog_S_mf3ble.webp",
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774755655/casco_dog_M_lradyu.webp",
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774755655/casco_dog_L_zt1pi2.webp"
    ],
    "price": 49.9,
    "description": "Seguridad máxima para tus aventuras extremas.",
    "specs": [
      { "label": "Material", "value": "Polímero ABS" },
      { "label": "Tallas", "value": "S / M / L" }
    ],
    "colors": ["#000000", "#000000", "#000000"],
    "stock": 15
  },
  {
    "id": "lente-modelo-aviador",
    "name": "Lente Modelo Aviador",
    "slug": "lente-modelo-aviador",
    "category": "mascotas",
    "price": 15.9,
    "images": [
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774755691/gafa_animal_aviador_sqwgfp.webp",
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774762465/gaja_aviador_verde_zsohhb.webp",
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774762460/gafa_aviador_rosa_cbfkly.webp",
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774762459/gafa_aviador_trasparente_yvjsmv.webp",
      "https://res.cloudinary.com/dod8hhjoo/image/upload/v1774762459/gafa_aviador_azul_x01hnp.webp"
    ],
    "colors": ["#90EE90", "#fbb2a3", "#f0f0f0", "#003785"]
  }
];

async function sync() {
  for (const p of products) {
    console.log(`Syncing ${p.id}...`);
    await supabase.from('products').upsert({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_id: p.category,
      price: p.price,
      description: p.description,
      stock: p.stock
    });
    
    if (p.images) {
      await supabase.from('product_images').delete().eq('product_id', p.id);
      await supabase.from('product_images').insert(p.images.map((img, i) => ({
        product_id: p.id, image_url: img, sort_order: i
      })));
    }
    
    if (p.colors) {
      await supabase.from('product_colors').delete().eq('product_id', p.id);
      await supabase.from('product_colors').insert(p.colors.map(c => ({
        product_id: p.id, hex_color: c
      })));
    }
  }
  console.log('Done!');
}

sync();
