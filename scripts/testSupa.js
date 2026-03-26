import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const pId = 'esencias-frutales';
  const fragToInsert = [
    { product_id: pId, name: 'Albaricoque', description: 'Test desc' }
  ];
  const { data, error } = await supabase.from('product_fragrances').insert(fragToInsert);
  console.log('Insert Result:', data, error);
}

run();
