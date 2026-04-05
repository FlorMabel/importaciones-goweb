import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log('Setting up admin...\n');

  // 1. Check if admin_users table exists by trying to query it
  console.log('1. Checking admin_users table...');
  const { error: checkErr } = await supabase.from('admin_users').select('id').limit(1);
  
  if (checkErr && checkErr.message.includes('does not exist')) {
    console.log('   Table does not exist. Please run this SQL in your Supabase SQL Editor:\n');
    console.log(`
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_users_all" ON admin_users FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_all" ON activity_logs FOR ALL USING (true);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_all" ON site_settings FOR ALL USING (true);

ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
    `);
    console.log('\n   After running the SQL, re-run this script.');
    process.exit(0);
  } else {
    console.log('   OK - admin_users table exists');
  }

  // 2. Insert admin user
  console.log('2. Inserting admin user (imporpuno@gmail.com)...');
  const { data: existing } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', 'imporpuno@gmail.com')
    .maybeSingle();

  if (existing) {
    console.log('   Already exists: role=' + existing.role);
  } else {
    const { error: insertErr } = await supabase
      .from('admin_users')
      .insert({
        email: 'imporpuno@gmail.com',
        name: 'Administrador',
        role: 'admin',
      });

    if (insertErr) {
      console.log('   Error: ' + insertErr.message);
    } else {
      console.log('   OK - Admin user created');
    }
  }

  // 3. Test auth login
  console.log('3. Testing Supabase Auth login...');
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'imporpuno@gmail.com',
    password: 'GOadmin123',
  });

  if (authErr) {
    console.log('   Auth failed: ' + authErr.message);
  } else {
    console.log('   OK - Auth works! User ID: ' + authData.user.id);
    await supabase.auth.signOut();
  }

  console.log('\nDone! Login at http://localhost:5173/admin');
}

setup().catch(e => console.error('Error:', e.message));
