import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  console.log('Columns in orders:', data ? Object.keys(data[0]) : 'No data');
  if (error) console.error(error);
}

checkSchema();
