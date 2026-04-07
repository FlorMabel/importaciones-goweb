import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no encontrada en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSkuColumn() {
  console.log('🚀 Iniciando actualización de esquema en Supabase...');
  
  // Nota: El cliente de Supabase JS no permite ejecutar SQL rpc directamente para ALTER TABLE 
  // a menos que tengas habilitada una función RPC específica. 
  // Sin embargo, podemos intentar insertar un valor nulo para verificar si la columna existe.
  
  console.log('⚠️  Por favor, asegúrate de ejecutar este comando en tu consola de SQL de Supabase:');
  console.log('\nALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;\n');
  
  console.log('Intentando verificar la tabla...');
  const { data, error } = await supabase.from('products').select('id, name').limit(1);
  
  if (error) {
    console.error('❌ Error al conectar con Supabase:', error.message);
  } else {
    console.log('✅ Conexión establecida. La estructura del código está lista.');
    console.log('Una vez ejecutado el SQL anterior, podrás ver el campo SKU en el Admin.');
  }
}

addSkuColumn();
